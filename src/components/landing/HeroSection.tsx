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

      {/* Animated radial glow */}
      <motion.div
        className="absolute right-[20%] top-[40%] h-[500px] w-[500px] rounded-full bg-gold/5 blur-[120px]"
        animate={{ scale: [1, 1.15, 1], opacity: [0.5, 0.8, 0.5] }}
        transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
      />

      {/* Floating particles */}
      {[...Array(5)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full bg-gold/20"
          style={{
            width: 3 + i * 2,
            height: 3 + i * 2,
            left: `${20 + i * 12}%`,
            top: `${30 + i * 8}%`,
          }}
          animate={{
            y: [0, -30, 0],
            opacity: [0.2, 0.6, 0.2],
          }}
          transition={{ repeat: Infinity, duration: 4 + i, ease: "easeInOut", delay: i * 0.5 }}
        />
      ))}

      <div className="relative z-10 mx-auto max-w-7xl px-6 py-20">
        <motion.div
          className="max-w-full px-2 md:max-w-[55%] md:px-0"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
        >
          <motion.p
            className="label-uppercase text-[11px] tracking-[0.2em]"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            Powered by AI · For Pakistan Law Enforcement
          </motion.p>

          <GoldDivider />

          <motion.h1
            className="font-display text-3xl font-bold leading-[1.1] text-text-primary md:text-5xl lg:text-[64px]"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.7 }}
          >
            We Turn Unstructured FIR Text Into Visual Crime Reconstructions
          </motion.h1>

          <motion.p
            className="mt-6 max-w-[480px] text-lg leading-relaxed text-text-secondary"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            Upload any FIR narrative. Our AI extracts every actor, location, and event — and renders a 3D animated scene reconstruction in under 30 seconds.
          </motion.p>

          <motion.div
            className="mt-10 flex gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
          >
            <Link to="/dashboard">
              <motion.button
                className="glass-button-primary group flex items-center gap-2 rounded-[6px] px-8 py-3 text-[13px] font-semibold uppercase tracking-[0.1em]"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
              >
                Access Portal
                <motion.span className="inline-block" whileHover={{ x: 4 }} transition={{ type: "spring" }}>
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </motion.span>
              </motion.button>
            </Link>
            <motion.button
              className="glass-button group flex items-center gap-2 rounded-[6px] px-8 py-3 text-[13px] font-semibold uppercase tracking-[0.1em]"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
            >
              <Play className="h-4 w-4 transition-transform group-hover:scale-110" /> Watch Demo
            </motion.button>
          </motion.div>

          <motion.p
            className="mt-8 text-[12px] text-text-muted"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9 }}
          >
            Developed for Shah Abdul Latif University · Institute of Computer Science
          </motion.p>
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
