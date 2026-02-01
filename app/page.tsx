import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";

export default function Home() {
  return (
    <>
      <Navbar />
      <main className="bg-bg min-h-screen">
        <Hero />
      </main>
    </>
  );
}
