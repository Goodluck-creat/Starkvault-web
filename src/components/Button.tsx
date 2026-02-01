export default function Button({
  children,
  variant = "primary",
}: {
  children: React.ReactNode;
  variant?: "primary" | "secondary";
}) {
  return (
    <button
      className={`px-6 py-3 rounded-xl font-medium transition-all duration-200
        ${
          variant === "primary"
            ? "bg-primary text-white shadow-glow hover:opacity-90"
            : "bg-white/10 text-white hover:bg-white/20"
        }`}
    >
      {children}
    </button>
  );
}
