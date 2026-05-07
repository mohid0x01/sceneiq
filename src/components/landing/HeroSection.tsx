import { motion } from "framer-motion";
import { Link } from "@tanstack/react-router";
import { ArrowRight, Play } from "lucide-react";
import { GoldDivider } from "@/components/GoldDivider";
import heroImage from "@/assets/hero-officer.jpg";

export function HeroSection() {
  return (
    <section id="home" className="relative flex min-h-screen items-center overflow-hidden pt-16">
      {/* Background image */}
      <div className="absolute inset-0">
        <img
          src={heroImage}
          alt="Officer silhouette"
          className="absolute right-0 top-0 h-full w-full object-cover object-right md:w-[60%]"
          width={960}
          height={1080}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/98 to-background/40 md:via-background/95" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
      </div>

      {/* Radial gold glow */}
      <div className="absolute right-[20%] top-[40%] h-[500px] w-[500px] rounded-full bg-gold/5 blur-[120px]" />

      <div className="relative z-10 mx-auto max-w-7xl px-6 py-20">
        <motion.div
          className="max-w-full px-2 md:max-w-[55%] md:px-0"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
        >
          <p className="label-uppercase text-[11px] tracking-[0.2em]">
            Powered by AI · For Pakistan Law Enforcement
          </p>

          <GoldDivider />

          <h1 className="font-display text-3xl font-bold leading-[1.1] text-text-primary md:text-5xl lg:text-[64px]">
            We Turn Unstructured FIR Text Into Visual Crime Reconstructions
          </h1>

          <p className="mt-6 max-w-[480px] text-lg leading-relaxed text-text-secondary">
            Upload any FIR narrative. Our AI extracts every actor, location, and event — and renders a 3D animated scene reconstruction in under 30 seconds.
          </p>

          <div className="mt-10 flex gap-4">
            <Link to="/dashboard">
              <button className="flex items-center gap-2 rounded-[6px] bg-gold px-8 py-3 text-[13px] font-semibold uppercase tracking-[0.1em] text-background shadow-[0_2px_12px_rgba(201,168,76,0.25)] transition-all duration-200 hover:bg-gold-light hover:scale-[1.01]">
                Access Portal <ArrowRight className="h-4 w-4" />
              </button>
            </Link>
            <button className="flex items-center gap-2 rounded-[6px] border border-gold/50 px-8 py-3 text-[13px] font-semibold uppercase tracking-[0.1em] text-gold transition-all duration-200 hover:border-gold hover:bg-gold/10">
              <Play className="h-4 w-4" /> Watch Demo
            </button>
          </div>

          <p className="mt-8 text-[12px] text-text-muted">
            Developed for Shah Abdul Latif University · Institute of Computer Science
          </p>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
        animate={{ y: [0, 8, 0] }}
        transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
      >
        <div className="h-8 w-[1px] bg-gradient-to-b from-gold/60 to-transparent" />
      </motion.div>
    </section>
  );
}
