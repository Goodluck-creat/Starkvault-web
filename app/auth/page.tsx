"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

export default function AuthPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleAuth = async () => {
    setError("");

    // Validation
    if (!email || !password || !confirmPassword) {
      setError("All fields are required");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);

    try {
      // 1️⃣ Try to sign in first
      const { error: signInError, data: signInData } =
        await supabase.auth.signInWithPassword({ email, password });

      if (signInError) {
        // 2️⃣ If user doesn’t exist, create user WITHOUT sending emails
        if (signInError.message.includes("Invalid login credentials")) {
          const { error: signUpError, data: signUpData } =
            await supabase.auth.signUp({
              email,
              password,
              options: {
                emailRedirectTo: undefined, // disables email sending
              },
            });

          if (signUpError) {
            setError(signUpError.message);
            setLoading(false);
            return;
          }

          // Immediately sign in after signup
          await supabase.auth.signInWithPassword({ email, password });
        } else {
          setError(signInError.message);
          setLoading(false);
          return;
        }
      }

      // ✅ Success → redirect to dashboard
      router.push("/dashboard");
    } catch (err) {
      console.error(err);
      setError("Something went wrong. Try again.");
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#050508] text-white">
      <div className="bg-[#0c0c14] p-8 rounded-2xl w-full max-w-md border border-white/10">
        <h1 className="text-2xl font-bold mb-6">Sign Up / Sign In</h1>

        <input
          type="email"
          placeholder="you@example.com"
          className="w-full p-3 rounded-lg bg-black/40 border border-white/10 mb-4"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full p-3 rounded-lg bg-black/40 border border-white/10 mb-4"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <input
          type="password"
          placeholder="Confirm Password"
          className="w-full p-3 rounded-lg bg-black/40 border border-white/10 mb-4"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />

        <button
          onClick={handleAuth}
          disabled={loading}
          className="w-full bg-gradient-to-r from-purple-600 to-blue-600 py-3 rounded-lg"
        >
          {loading ? "Please wait..." : "Continue"}
        </button>

        {error && <p className="mt-4 text-red-400 text-sm">{error}</p>}
      </div>
    </div>
  );
}
