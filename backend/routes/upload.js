import express from "express";
import multer from "multer";
import Arweave from "arweave";
import crypto from "crypto";
import { body, validationResult } from "express-validator";
import Document from "../models/Document.js";
import authMiddleware from "../middleware/auth.js";

const router = express.Router();

// Initialize Arweave client
const arweave = Arweave.init({
  host: process.env.ARWEAVE_HOST || "arweave.net",
  port: process.env.ARWEAVE_PORT || 443,
  protocol: process.env.ARWEAVE_PROTOCOL || "https",
});

// Configure multer for file uploads
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB limit
  },
  fileFilter: (req, file, cb) => {
    // Allow all file types for now, but you can restrict if needed
    cb(null, true);
  },
});

// Generate document hash from file buffer
const generateDocumentHash = (buffer) => {
  return crypto.createHash("sha256").update(buffer).digest("hex");
};

// Generate metadata
const generateMetadata = (
  file,
  arweaveHash,
  documentHash,
  description = "",
  tags = [],
) => {
  return {
    uploadedAt: new Date(),
    checksum: crypto.createHash("md5").update(file.buffer).digest("hex"),
    description,
    tags: Array.isArray(tags) ? tags : [],
  };
};

// Create Arweave transaction
const createArweaveTransaction = async (data, contentType) => {
  try {
    // Create transaction
    const transaction = await arweave.createTransaction({ data });

    // Add tags
    transaction.addTag("Content-Type", contentType);
    transaction.addTag("App-Name", "Starkvault");
    transaction.addTag("App-Version", "1.0.0");
    transaction.addTag("Timestamp", Date.now().toString());

    // For development/testing, we'll create unsigned transactions
    // In production, you'd need to sign with a wallet
    if (process.env.ARWEAVE_WALLET_KEY) {
      const wallet = JSON.parse(process.env.ARWEAVE_WALLET_KEY);
      await arweave.transactions.sign(transaction, wallet);
    }

    return transaction;
  } catch (error) {
    console.error("Error creating Arweave transaction:", error);
    throw error;
  }
};

// Upload file to Arweave endpoint
router.post(
  "/file",
  authMiddleware,
  upload.single("file"),
  [
    body("description").optional().trim(),
    body("tags").optional(),
    body("isPublic").optional().isBoolean(),
  ],
  async (req, res) => {
    try {
      // Check validation errors
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: "Validation failed",
          errors: errors.array(),
        });
      }

      // Check if file was uploaded
      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: "No file uploaded",
        });
      }

      const { description = "", tags = [], isPublic = false } = req.body;
      const file = req.file;

      // Generate document hash
      const documentHash = generateDocumentHash(file.buffer);

      // Check if document already exists
      const existingDoc = await Document.findOne({ documentHash });
      if (existingDoc) {
        return res.status(409).json({
          success: false,
          message: "Document already exists",
          document: {
            id: existingDoc._id,
            arweaveHash: existingDoc.arweaveHash,
            documentHash: existingDoc.documentHash,
          },
        });
      }

      // Create Arweave transaction
      const transaction = await createArweaveTransaction(
        file.buffer,
        file.mimetype,
      );
      const arweaveHash = transaction.id;

      // Post transaction to Arweave network (if wallet is configured)
      if (process.env.ARWEAVE_WALLET_KEY) {
        try {
          const response = await arweave.transactions.post(transaction);
          if (response.status !== 200) {
            throw new Error(
              `Arweave upload failed with status: ${response.status}`,
            );
          }
        } catch (uploadError) {
          console.error("Arweave upload error:", uploadError);
          return res.status(503).json({
            success: false,
            message: "Failed to upload to Arweave network",
          });
        }
      }

      // Generate metadata
      const metadata = generateMetadata(
        file,
        arweaveHash,
        documentHash,
        description,
        typeof tags === "string"
          ? tags.split(",").map((tag) => tag.trim())
          : tags,
      );

      // Save document to database
      const document = new Document({
        filename: `${Date.now()}-${file.originalname}`,
        originalName: file.originalname,
        mimeType: file.mimetype,
        size: file.size,
        arweaveHash,
        documentHash,
        metadata,
        owner: req.user._id,
        isPublic: Boolean(isPublic),
      });

      await document.save();

      res.status(201).json({
        success: true,
        message: "File uploaded successfully to Arweave",
        document: {
          id: document._id,
          filename: document.filename,
          originalName: document.originalName,
          mimeType: document.mimeType,
          size: document.size,
          arweaveHash: document.arweaveHash,
          documentHash: document.documentHash,
          metadata: document.metadata,
          isPublic: document.isPublic,
          createdAt: document.createdAt,
          arweaveUrl: `https://arweave.net/${arweaveHash}`,
        },
      });
    } catch (error) {
      console.error("Upload error:", error);

      res.status(500).json({
        success: false,
        message: "Server error during file upload",
        error:
          process.env.NODE_ENV === "development" ? error.message : undefined,
      });
    }
  },
);

// Get user's documents
router.get("/documents", authMiddleware, async (req, res) => {
  try {
    const { page = 1, limit = 10, search = "" } = req.query;
    const skip = (page - 1) * limit;

    // Build search query
    const searchQuery = {
      owner: req.user._id,
      ...(search && {
        $or: [
          { originalName: { $regex: search, $options: "i" } },
          { "metadata.description": { $regex: search, $options: "i" } },
          { "metadata.tags": { $in: [new RegExp(search, "i")] } },
        ],
      }),
    };

    const documents = await Document.find(searchQuery)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .select("-__v");

    // Add Arweave URLs to response
    const documentsWithUrls = documents.map((doc) => ({
      ...doc.toObject(),
      arweaveUrl: `https://arweave.net/${doc.arweaveHash}`,
    }));

    const total = await Document.countDocuments(searchQuery);

    res.json({
      success: true,
      documents: documentsWithUrls,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Get documents error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching documents",
    });
  }
});

// Get document by ID
router.get("/document/:id", authMiddleware, async (req, res) => {
  try {
    const document = await Document.findOne({
      _id: req.params.id,
      $or: [{ owner: req.user._id }, { isPublic: true }],
    }).select("-__v");

    if (!document) {
      return res.status(404).json({
        success: false,
        message: "Document not found",
      });
    }

    res.json({
      success: true,
      document: {
        ...document.toObject(),
        arweaveUrl: `https://arweave.net/${document.arweaveHash}`,
      },
    });
  } catch (error) {
    console.error("Get document error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching document",
    });
  }
});

// Get file from Arweave (proxy endpoint)
router.get("/file/:arweaveHash", authMiddleware, async (req, res) => {
  try {
    const { arweaveHash } = req.params;

    // Find document to check permissions
    const document = await Document.findOne({
      arweaveHash,
      $or: [{ owner: req.user._id }, { isPublic: true }],
    });

    if (!document) {
      return res.status(404).json({
        success: false,
        message: "File not found or access denied",
      });
    }

    // Fetch file from Arweave
    const data = await arweave.transactions.getData(arweaveHash, {
      decode: true,
      string: false,
    });

    // Set appropriate headers
    res.set({
      "Content-Type": document.mimeType,
      "Content-Length": data.length,
      "Content-Disposition": `attachment; filename="${document.originalName}"`,
    });

    res.send(Buffer.from(data));
  } catch (error) {
    console.error("File retrieval error:", error);

    if (error.type === "TX_NOT_FOUND") {
      return res.status(404).json({
        success: false,
        message: "File not found on Arweave network",
      });
    }

    res.status(500).json({
      success: false,
      message: "Server error while retrieving file from Arweave",
    });
  }
});

// Get Arweave transaction status
router.get("/status/:arweaveHash", authMiddleware, async (req, res) => {
  try {
    const { arweaveHash } = req.params;

    // Check if user has access to this document
    const document = await Document.findOne({
      arweaveHash,
      $or: [{ owner: req.user._id }, { isPublic: true }],
    });

    if (!document) {
      return res.status(404).json({
        success: false,
        message: "Document not found or access denied",
      });
    }

    // Get transaction status from Arweave
    const status = await arweave.transactions.getStatus(arweaveHash);

    res.json({
      success: true,
      status: {
        confirmed: status.confirmed,
        blockHeight: status.block_height,
        blockIndepHash: status.block_indep_hash,
        numberOfConfirmations: status.number_of_confirmations,
      },
    });
  } catch (error) {
    console.error("Status check error:", error);
    res.status(500).json({
      success: false,
      message: "Error checking Arweave transaction status",
    });
  }
});

// Delete document (removes from database, but file remains on Arweave permanently)
router.delete("/document/:id", authMiddleware, async (req, res) => {
  try {
    const document = await Document.findOneAndDelete({
      _id: req.params.id,
      owner: req.user._id,
    });

    if (!document) {
      return res.status(404).json({
        success: false,
        message: "Document not found",
      });
    }

    res.json({
      success: true,
      message:
        "Document deleted from database (file remains permanently on Arweave)",
      note: "Files uploaded to Arweave are permanent and cannot be deleted from the network",
    });
  } catch (error) {
    console.error("Delete document error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while deleting document",
    });
  }
});

export default router;
