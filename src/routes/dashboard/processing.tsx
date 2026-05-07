import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Check, Loader } from "lucide-react";

export const Route = createFileRoute("/dashboard/processing")({
  component: ProcessingPage,
});

const stages = [
  { title: "Preprocessing & Language Normalization", desc: "Detecting language, normalizing Roman Urdu transliterations" },
  { title: "AI Entity & Event Extraction", desc: "Identifying actors, objects, locations, and temporal markers" },
  { title: "Spatial Coordinate Resolution", desc: "Mapping referenced locations to relative spatial positions" },
  { title: "Timeline Sequencing & Validation", desc: "Ordering events chronologically and validating causal chains" },
  { title: "3D Scene Manifest Generation", desc: "Building the scene graph for interactive 3D rendering" },
];

function ProcessingPage() {
  const [active, setActive] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setInterval(() => {
      setActive((prev) => {
        if (prev >= stages.length - 1) {
          clearInterval(timer);
          setTimeout(() => navigate({ to: "/dashboard/viewer" }), 1200);
          return prev;
        }
        return prev + 1;
      });
    }, 2500);
    return () => clearInterval(timer);
  }, [navigate]);

  const progress = ((active + 1) / stages.length) * 100;

  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center">
      {/* Top progress bar */}
      <div className="fixed left-60 right-0 top-0 z-50 h-[2px] bg-border-subtle">
        <motion.div
          className="h-full bg-gold"
          initial={{ width: "0%" }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.5 }}
        />
      </div>

      <motion.div
        className="w-full max-w-lg text-center"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <p className="font-mono text-lg text-gold">JOB-2024-SHK-00143</p>
        <h1 className="mt-2 font-display text-3xl font-bold text-text-primary">Processing Your FIR</h1>
        <p className="mt-2 text-sm text-text-muted">Do not close this tab. Your reconstruction is being generated.</p>

        <div className="mt-12 space-y-4 text-left">
          {stages.map((stage, i) => {
            const status = i < active ? "complete" : i === active ? "active" : "pending";
            return (
              <motion.div
                key={stage.title}
                className={`flex items-start gap-4 rounded-[4px] border p-4 transition-all duration-300 ${
                  status === "active"
                    ? "border-gold/40 bg-gold/5 shimmer"
                    : status === "complete"
                    ? "border-success/20 bg-success/5"
                    : "border-border-subtle bg-card"
                }`}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.08 }}
              >
                <div className={`mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full border-2 ${
                  status === "complete"
                    ? "border-success bg-success/20"
                    : status === "active"
                    ? "border-gold bg-gold/10"
                    : "border-border-accent"
                }`}>
                  {status === "complete" ? (
                    <Check className="h-3.5 w-3.5 text-success" />
                  ) : status === "active" ? (
                    <Loader className="h-3.5 w-3.5 animate-spin text-gold" />
                  ) : (
                    <span className="text-[10px] font-semibold text-text-muted">{i + 1}</span>
                  )}
                </div>
                <div>
                  <div className={`text-sm font-semibold ${status === "pending" ? "text-text-muted" : "text-text-primary"}`}>
                    {stage.title}
                  </div>
                  <div className="mt-0.5 text-[12px] text-text-muted">{stage.desc}</div>
                  {status === "active" && (
                    <span className="mt-1 inline-block text-[11px] font-semibold uppercase tracking-[0.1em] text-gold gold-pulse">
                      Processing...
                    </span>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>

        <p className="mt-8 font-mono text-[12px] text-text-muted">Estimated time remaining: calculating...</p>
      </motion.div>
    </div>
  );
}
