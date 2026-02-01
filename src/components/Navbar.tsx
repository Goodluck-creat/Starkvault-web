import Button from "@/components/Button";

export default function Navbar() {
  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-black/40 backdrop-blur-xl border-b border-white/10">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        
        {/* Logo */}
        <div className="text-xl font-semibold tracking-tight">
          <span className="text-primary">Stark</span>Vault
        </div>

        {/* Actions */}
        {/* <div className="flex items-center gap-4">
          <Button variant="secondary">Docs</Button>
          <Button>Launch App</Button>
        </div> */}
      </div>
    </nav>
  );
}
