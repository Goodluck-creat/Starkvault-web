import mongoose from "mongoose";

const documentSchema = new mongoose.Schema(
  {
    filename: {
      type: String,
      required: true,
    },
    originalName: {
      type: String,
      required: true,
    },
    mimeType: {
      type: String,
      required: true,
    },
    size: {
      type: Number,
      required: true,
    },
    arweaveHash: {
      type: String,
      required: true,
      unique: true,
    },
    documentHash: {
      type: String,
      required: true,
    },
    metadata: {
      uploadedAt: {
        type: Date,
        default: Date.now,
      },
      checksum: String,
      description: String,
      tags: [String],
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    isPublic: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);

// Index for efficient queries
documentSchema.index({ owner: 1, createdAt: -1 });
documentSchema.index({ documentHash: 1 });

export default mongoose.model("Document", documentSchema);
