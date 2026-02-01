"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";
import { connect, disconnect } from "@argent/get-starknet";

export default function Dashboard() {
  const [user, setUser] = useState<any>(null);
  const [walletAddress, setWalletAddress] = useState("");
  const [dragActive, setDragActive] = useState(false);
  const [uploadMessage, setUploadMessage] = useState("");
  const [documents, setDocuments] = useState<any[]>([]);
  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.push("/");
        return;
      }

      setUser(user);

      // Fetch wallet
      const { data: profile } = await supabase
        .from("profiles")
        .select("wallet_address")
        .eq("id", user.id)
        .single();

      if (profile?.wallet_address) {
        setWalletAddress(profile.wallet_address);
      }

      // Fetch documents
      const { data: docs } = await supabase
        .from("documents")
        .select("*")
        .eq("user_id", user.id)
        .order("uploaded_at", { ascending: false });

      setDocuments(docs || []);
    };

    fetchUser();
  }, [router]);

  const handleConnectWallet = async () => {
    try {
      const wallet = await connect();
      if (!wallet) {
        alert("No wallet detected");
        return;
      }

      const address = wallet.address.toString();
      setWalletAddress(address);

      await supabase.from("profiles").upsert({
        id: user.id,
        wallet_address: address,
      });

      alert(`Wallet connected: ${address}`);
    } catch (err) {
      console.error("Wallet connect error:", err);
      alert("Failed to connect wallet");
    }
  };

  const handleDisconnectWallet = async () => {
    try {
      await disconnect();
      setWalletAddress("");

      await supabase
        .from("profiles")
        .upsert({ id: user.id, wallet_address: null });

      alert("Wallet disconnected");
    } catch (err) {
      console.error("Wallet disconnect error:", err);
      alert("Failed to disconnect wallet");
    }
  };

  const handleFileUpload = async (file: File) => {
    if (!file || !user) return;

    setUploadMessage("Uploading to IPFS...");

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const text = await res.text();
      console.log("UPLOAD STATUS:", res.status);
      console.log("UPLOAD RAW RESPONSE:", text);

      let data: any = {};
      try {
        data = text ? JSON.parse(text) : {};
      } catch (parseErr) {
        console.error("JSON parse failed:", parseErr);
      }

      if (!res.ok) {
        setUploadMessage(`Upload failed: ${data.error || "Server error"}`);
        console.error("UPLOAD ERROR DATA:", data);
        return;
      }

      if (!data.IpfsHash) {
        setUploadMessage("Upload failed: Invalid Pinata response");
        console.error("INVALID RESPONSE:", data);
        return;
      }

      setUploadMessage(`Uploaded! CID: ${data.IpfsHash}`);

      // Save document to Supabase
      const { data: newDoc, error } = await supabase
        .from("documents")
        .insert({
          user_id: user.id,
          file_name: file.name,
          ipfs_cid: data.IpfsHash,
          uploaded_at: new Date(),
        })
        .select()
        .single();

      if (error) {
        console.error("Supabase insert error:", error);
        return;
      }

      if (newDoc) {
        setDocuments((prev) => [newDoc, ...prev]);
      }
    } catch (err) {
      console.error("UPLOAD FAILED:", err);
      setUploadMessage("Upload failed");
    }
  };

  const handleDrag = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();

    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  if (!user) {
    return <p className="text-white p-8">Loading...</p>;
  }

  return (
    <div className="min-h-screen bg-[#050508] text-white p-8">
      <h1 className="text-3xl font-bold mb-6">
        Welcome, {user.email} 🚀
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Wallet Box */}
        <div className="bg-[#0c0c14] p-6 rounded-2xl shadow-lg flex flex-col items-center">
          <h2 className="text-xl font-semibold mb-4">Wallet</h2>

          {walletAddress ? (
            <>
              <p className="mb-4 break-all text-center">
                {walletAddress}
              </p>
              <button
                onClick={handleDisconnectWallet}
                className="bg-red-600 py-2 px-6 rounded-lg"
              >
                Disconnect
              </button>
            </>
          ) : (
            <button
              onClick={handleConnectWallet}
              className="bg-gradient-to-r from-purple-600 to-blue-600 py-3 px-6 rounded-lg"
            >
              Connect Wallet
            </button>
          )}
        </div>

        {/* Upload Box */}
        <div
          onDragEnter={handleDrag}
          onDragOver={handleDrag}
          onDragLeave={handleDrag}
          onDrop={handleDrop}
          className={`bg-[#0c0c14] p-6 rounded-2xl shadow-lg flex flex-col items-center justify-center border-2 border-dashed ${
            dragActive ? "border-blue-500" : "border-white/20"
          }`}
        >
          <h2 className="text-xl font-semibold mb-4">
            Upload Document
          </h2>
          <p className="mb-4 text-center">
            Drag & drop or click to upload
          </p>

          <input
            type="file"
            className="hidden"
            id="fileInput"
            onChange={(e) =>
              e.target.files && handleFileUpload(e.target.files[0])
            }
          />

          <label
            htmlFor="fileInput"
            className="cursor-pointer bg-gradient-to-r from-purple-600 to-blue-600 py-3 px-6 rounded-lg"
          >
            Choose File
          </label>

          {uploadMessage && (
            <p className="mt-4 text-green-400 text-center">
              {uploadMessage}
            </p>
          )}
        </div>

        {/* Documents Box */}
        <div className="bg-[#0c0c14] p-6 rounded-2xl shadow-lg flex flex-col items-center">
          <h2 className="text-xl font-semibold mb-4">
            Your Documents
          </h2>

          {documents.length === 0 ? (
            <p className="text-center text-white/70">
              No documents uploaded yet
            </p>
          ) : (
            <ul className="w-full space-y-2">
              {documents.map((doc) => (
                <li
                  key={doc.id}
                  className="bg-[#1a1a25] p-3 rounded-lg flex justify-between items-center"
                >
                  <span className="break-all">
                    {doc.file_name}
                  </span>
                  <a
                    href={`https://gateway.pinata.cloud/ipfs/${doc.ipfs_cid}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-400 hover:underline"
                  >
                    View
                  </a>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
