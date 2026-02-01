"use client";

import React from "react";
import { useRouter } from "next/navigation"; // ✅ import router
import { 
  Shield, Upload, Fingerprint, Award, Zap, 
  Lock, Database, CheckCircle2, FileText, 
  GraduationCap, Users, Github, Twitter, ExternalLink 
} from "lucide-react";

import { Button } from "@/components/ui/Button";


// ... your Button component remains the same

export default function StarkVaultPage() {
  const router = useRouter(); // ✅ initialize router

  const goToSignup = () => {
    router.push("/auth"); // goes to your email signup page
  };

  const goToLogin = () => {
    router.push("/auth"); // if login is same page, or create /login
  };

  return (
    <div className="min-h-screen bg-[#050508] text-white font-sans selection:bg-purple-500/30">
      {/* NAVBAR */}
      <nav className="p-6 max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center">
            <Shield className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold tracking-tight">StarkVault</span>
        </div>
      </nav>

      {/* HERO SECTION */}
      <section className="relative pt-20 pb-16">
        <div className="max-w-5xl mx-auto px-6 text-center relative z-10">
          <h1 className="text-5xl md:text-7xl font-bold leading-[1.1] mb-8">
            Cryptographic Proof for Every Document
          </h1>
          <p className="text-gray-400 text-lg md:text-xl max-w-3xl mx-auto mb-10">
            Trustless document storage and NFT verification on StarkNet. Upload, verify, and prove ownership with zero-knowledge security.
          </p>

          <div className="flex items-center justify-center gap-4 mb-16">
            <Button onClick={goToSignup}>Sign Up</Button>
            <Button variant="secondary" onClick={goToLogin}>Login</Button>
          </div>

          
          {/* STATS STRIP */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 py-12 border-t border-white/5">
            <StatItem label="256-bit" sub="Encryption Standard" />
            <StatItem label="100%" sub="On-Chain Verification" />
            <StatItem label="Instant" sub="Proof Generation" />
            <StatItem label="Forever" sub="Immutable Storage" />
          </div>
        </div>
      </section>

      {/* HOW IT WORKS (Image 1 bottom) */}
      <section className="py-24 max-w-6xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">How It Works</h2>
          <p className="text-gray-500">Three simple steps to cryptographic document verification</p>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          <StepCard 
            number="1" 
            icon={<Upload className="text-purple-400" />} 
            title="Upload Your Document" 
            desc="Securely upload any document. Data is encrypted client-side before transmission, ensuring zero-knowledge privacy." 
          />
          <StepCard 
            number="2" 
            icon={<Fingerprint className="text-purple-400" />} 
            title="Generate Cryptographic Proof" 
            desc="Our system creates a unique cryptographic hash and stores it on StarkNet, providing immutable verification." 
          />
          <StepCard 
            number="3" 
            icon={<Award className="text-purple-400" />} 
            title="Mint as NFT" 
            desc="Receive a verification NFT representing ownership and authenticity. Share, transfer, or prove at any time." 
          />
        </div>
      </section>

      {/* BUILT FOR TRUST & USE CASES (Image 2) */}
      <section className="py-24 bg-[#08080c]">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Built for Trust</h2>
            <p className="text-gray-500">Enterprise-ready infrastructure designed for maximum security and reliability</p>
          </div>
          <div className="grid md:grid-cols-2 gap-8 mb-24">
            <FeatureCard 
              icon={<Shield size={20} />} 
              title="Enterprise-Grade Security" 
              desc="Military-grade encryption with zero-knowledge proof architecture. Your documents remain private and secure."
              bullets={["Client-side encryption", "Zero-knowledge proofs", "Audited smart contracts"]}
            />
            <FeatureCard 
              icon={<Database size={20} />} 
              title="Immutable Storage" 
              desc="Documents stored on StarkNet are permanent and tamper-proof. Once verified, always verified."
              bullets={["Blockchain permanence", "Tamper-proof records", "Decentralized infrastructure"]}
            />
          </div>

          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Trusted by Industry Leaders</h2>
            <p className="text-gray-500">Purpose-built for organizations that demand the highest standards</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <UseCaseCard 
              icon={<Shield className="text-purple-400" />} 
              title="Enterprises" 
              desc="Secure contract management, IP protection, and compliance documentation."
              cases={["Legal contracts", "IP filing", "Regulatory records"]}
            />
            <UseCaseCard 
              icon={<GraduationCap className="text-purple-400" />} 
              title="Universities" 
              desc="Credential verification, research protection, and academic records."
              cases={["Degree issuance", "Research authentication", "Transcript verification"]}
            />
            <UseCaseCard 
              icon={<Users className="text-purple-400" />} 
              title="Web3 Teams" 
              desc="DAO governance, tokenomics, and decentralized operations."
              cases={["DAO proposal archiving", "Whitepaper version control", "Smart contract docs"]}
            />
          </div>
        </div>
      </section>

      {/* INFRASTRUCTURE & SECURITY (Image 3) */}
      <section className="py-24 max-w-6xl mx-auto px-6">
        <div className="text-center mb-16">
          <span className="text-blue-400 text-xs bg-blue-400/10 px-4 py-1.5 rounded-full border border-blue-400/20 mb-6 inline-block">Powered by StarkNet</span>
          <h2 className="text-4xl font-bold">Built on Industry-Leading Infrastructure</h2>
          <p className="text-gray-500 mt-4">StarkVault leverages StarkNet's cutting-edge L2 technology</p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-6 mb-16">
          <InfraCard icon={<Zap />} title="Lightning Fast" desc="StarkNet's L2 scaling delivers instant transactions with minimal latency" />
          <InfraCard icon={<ExternalLink />} title="Low Cost" desc="Significantly reduced gas fees compared to Ethereum mainnet" />
          <InfraCard icon={<Lock />} title="Zero-Knowledge Proofs" desc="STARK-based cryptography ensures maximum privacy and security" />
          <InfraCard icon={<Shield />} title="Ethereum Security" desc="Inherit Ethereum's battle-tested security with L2 efficiency" />
        </div>

        <div className="grid grid-cols-3 gap-8 py-12 bg-gradient-to-b from-white/5 to-transparent rounded-3xl border border-white/5 text-center mb-24">
          <StatItem label="<$0.01" sub="Average transaction cost" color="text-blue-400" />
          <StatItem label="<10s" sub="Confirmation time" color="text-blue-400" />
          <StatItem label="100%" sub="Ethereum-backed security" color="text-indigo-400" />
        </div>

        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">Security First, Always</h2>
          <p className="text-gray-500">Built with enterprise-grade security standards from day one</p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <SecurityCard title="Audited Smart Contracts" desc="All smart contracts undergo rigorous third-party security audits." />
          <SecurityCard title="Open Source" desc="Fully transparent codebase available for community review." />
          <SecurityCard title="End-to-End Encryption" desc="Client-side encryption ensures your data remains private." />
          <SecurityCard title="Compliance Ready" desc="Built to meet enterprise requirements including SOC 2 and GDPR." />
        </div>
      </section>

      {/* TRUST FOUNDATION & FINAL CTA (Image 4) */}
      <section className="py-24 bg-[#08080c] border-t border-white/5">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <div className="w-12 h-12 bg-purple-600/20 border border-purple-500/50 rounded-xl flex items-center justify-center mx-auto mb-8">
             <Shield className="text-purple-400" />
          </div>
          <h2 className="text-4xl font-bold mb-6">Your Trust is Our Foundation</h2>
          <p className="text-gray-400 mb-8 leading-relaxed">
            StarkVault is built on a zero-trust architecture where cryptographic proofs replace blind faith. 
            We never have access to your unencrypted data, and all verification happens on-chain with mathematical certainty.
          </p>
          <div className="flex flex-wrap justify-center gap-6 text-sm text-green-400 mb-24">
            <span className="flex items-center gap-2">● No backdoors</span>
            <span className="flex items-center gap-2">● No data mining</span>
            <span className="flex items-center gap-2">● No third-party access</span>
          </div>

          <div className="bg-gradient-to-b from-[#0c0c14] to-transparent border border-white/5 rounded-3xl p-16">
            <h2 className="text-4xl font-bold mb-6">Ready to Get Started?</h2>
            <p className="text-gray-400 mb-10">Experience cryptographic document verification on StarkNet. Sign up today to secure and verify your documents.</p>
            <div className="flex justify-center gap-4">
              <Button>Sign Up</Button>
              <Button variant="secondary">Login</Button>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER (Image 4 bottom) */}
      <footer className="py-20 border-t border-white/5 bg-[#050508]">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-4 gap-12">
          <div className="col-span-2">
            <div className="flex items-center gap-2 mb-6">
              <Shield className="w-6 h-6 text-purple-600" />
              <span className="text-xl font-bold">StarkVault</span>
            </div>
            <p className="text-gray-500 max-w-sm mb-6">
              Decentralized document verification and NFT minting on StarkNet. Built for enterprises, institutions, and serious Web3 users.
            </p>
          </div>
          <div>
            <h4 className="font-bold mb-6">Product</h4>
            <ul className="space-y-4 text-gray-500 text-sm">
              <li>How It Works</li>
              <li>Use Cases</li>
              <li>Pricing</li>
              <li>Documentation</li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-6">Company</h4>
            <ul className="space-y-4 text-gray-500 text-sm">
              <li>About</li>
              <li>Security</li>
              <li>Privacy Policy</li>
              <li>Terms of Service</li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-6 mt-20 pt-8 border-t border-white/5 flex flex-col md:row items-center justify-between gap-6">
          <p className="text-xs text-gray-600">© 2026 StarkVault. All rights reserved.</p>
          <div className="flex gap-4">
            <div className="w-8 h-8 bg-white/5 rounded flex items-center justify-center hover:bg-white/10 cursor-pointer"><Twitter size={16} /></div>
            <div className="w-8 h-8 bg-white/5 rounded flex items-center justify-center hover:bg-white/10 cursor-pointer"><Github size={16} /></div>
            <div className="w-8 h-8 bg-white/5 rounded flex items-center justify-center hover:bg-white/10 cursor-pointer"><Shield size={16} /></div>
          </div>
        </div>
      </footer>
    </div>
  );
}

// --- SUB-COMPONENTS ---

function StatItem({ label, sub, color = "text-purple-400" }: any) {
  return (
    <div>
      <div className={`text-3xl font-bold mb-1 ${color}`}>{label}</div>
      <div className="text-xs text-gray-500 uppercase tracking-wider">{sub}</div>
    </div>
  );
}

function StepCard({ number, title, desc, icon }: any) {
  return (
    <div className="bg-[#0c0c14] border border-white/5 p-8 rounded-2xl relative group hover:border-purple-500/30 transition-colors">
      <div className="absolute -top-3 left-8 w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center text-sm font-bold ring-4 ring-[#050508]">
        {number}
      </div>
      <div className="mb-6 p-3 bg-white/5 w-fit rounded-xl">{icon}</div>
      <h3 className="text-xl font-bold mb-3">{title}</h3>
      <p className="text-gray-400 text-sm leading-relaxed">{desc}</p>
    </div>
  );
}

function FeatureCard({ title, desc, bullets, icon }: any) {
  return (
    <div className="bg-[#0c0c14] border border-white/5 p-8 rounded-2xl">
      <div className="flex items-center gap-3 mb-4 text-purple-400">
        {icon}
        <h3 className="text-xl font-bold text-white">{title}</h3>
      </div>
      <p className="text-gray-400 text-sm mb-6">{desc}</p>
      <ul className="space-y-2">
        {bullets.map((b: string, i: number) => (
          <li key={i} className="text-xs text-gray-500 flex items-center gap-2">
            <span className="w-1 h-1 bg-purple-500 rounded-full" /> {b}
          </li>
        ))}
      </ul>
    </div>
  );
}

function UseCaseCard({ title, desc, cases, icon }: any) {
  return (
    <div className="bg-[#0c0c14] border border-white/5 p-8 rounded-2xl">
      <div className="mb-6">{icon}</div>
      <h3 className="text-xl font-bold mb-3">{title}</h3>
      <p className="text-gray-400 text-sm mb-8 leading-relaxed">{desc}</p>
      <div className="text-[10px] uppercase tracking-widest text-gray-600 font-bold mb-4">Common Use Cases</div>
      <ul className="space-y-3">
        {cases.map((c: string, i: number) => (
          <li key={i} className="text-xs text-purple-300 flex items-center gap-2">
            <CheckCircle2 size={12} className="text-purple-500" /> {c}
          </li>
        ))}
      </ul>
    </div>
  );
}

function InfraCard({ title, desc, icon }: any) {
  return (
    <div className="bg-[#0c0c14] border border-white/5 p-6 rounded-2xl flex gap-4 items-start hover:bg-white/[0.02] transition-colors">
      <div className="text-blue-500 mt-1">{icon}</div>
      <div>
        <h4 className="font-bold mb-1">{title}</h4>
        <p className="text-gray-500 text-sm leading-relaxed">{desc}</p>
      </div>
    </div>
  );
}

function SecurityCard({ title, desc }: any) {
  return (
    <div className="bg-[#0c0c14] border border-white/5 p-6 rounded-2xl text-center hover:border-white/10 transition-colors">
      <h4 className="font-bold mb-3 text-sm">{title}</h4>
      <p className="text-gray-500 text-xs leading-relaxed">{desc}</p>
    </div>
  );
}