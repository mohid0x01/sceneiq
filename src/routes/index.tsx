import { createFileRoute } from "@tanstack/react-router";
import { Navbar } from "@/components/landing/Navbar";
import { HeroSection } from "@/components/landing/HeroSection";
import { AboutSection } from "@/components/landing/AboutSection";
import { FeaturesSection } from "@/components/landing/FeaturesSection";
import { HowItWorksSection } from "@/components/landing/HowItWorksSection";
import { Footer } from "@/components/landing/Footer";

export const Route = createFileRoute("/")({
  component: LandingPage,
  head: () => ({
    meta: [
      { title: "SCENEIQ — AI-Powered FIR Scene Reconstruction" },
      { name: "description", content: "Upload any FIR narrative. Our AI extracts every actor, location, and event — and renders a 3D animated scene reconstruction in under 30 seconds." },
    ],
  }),
});

function LandingPage() {
  return (
    <div className="noise-overlay min-h-screen bg-background">
      <Navbar />
      <HeroSection />
      <PoliceStrip />
      <AboutSection />
      <FeaturesSection />
      <HowItWorksSection />
      <Footer />
    </div>
  );
}

const provinces = ["Sindh Police", "Punjab Police", "KPK Police", "Balochistan Police"];

function PoliceStrip() {
  return (
    <div className="border-y border-subtle bg-[oklch(0.09_0.005_60)] py-6">
      <div className="mx-auto flex max-w-4xl flex-wrap items-center justify-center gap-4 px-6 text-center">
        <span className="text-[12px] text-text-muted">Processes FIR text from</span>
        {provinces.map((p, i) => (
          <span key={p} className="flex items-center gap-4">
            {i > 0 && <span className="h-3 w-[1px] bg-gold/30" />}
            <span className="text-[12px] font-medium uppercase tracking-[0.1em] text-text-secondary">{p}</span>
          </span>
        ))}
        <span className="text-[12px] text-text-muted">and all provincial systems</span>
      </div>
    </div>
  );
}
