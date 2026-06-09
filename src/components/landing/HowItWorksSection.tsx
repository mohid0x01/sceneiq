import { motion } from "framer-motion";
import { FileText, Brain, Play } from "lucide-react";

const steps = [
  { icon: FileText, title: "Submit FIR Text", desc: "Paste or upload any FIR narrative in Roman Urdu or English." },
  { icon: Brain, title: "AI Processes Narrative", desc: "Our pipeline extracts entities, resolves locations, and sequences the timeline." },
  { icon: Play, title: "View 3D Reconstruction", desc: "Explore the interactive scene with entity tracking and event playback." },
];

export function HowItWorksSection() {
  return (
    <section id="how-it-works" className="py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-6">
        <motion.div
          className="mx-auto flex max-w-3xl flex-col items-center text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <p className="label-uppercase">Process</p>
          <h2 className="mt-4 font-display text-balance text-3xl font-bold leading-[1.15] tracking-tight text-text-primary sm:text-4xl md:text-5xl">
            Three Steps to a Full Reconstruction
          </h2>
          <p className="mt-4 max-w-xl text-sm text-text-secondary md:text-base">
            From raw FIR text to an interactive 3D scene — usually in under 30 seconds.
          </p>
        </motion.div>

        <div className="mt-16 flex flex-col items-center gap-0 md:mt-20 md:flex-row md:gap-0">
          {steps.map((step, i) => (
            <div key={step.title} className="flex w-full flex-1 flex-col items-center md:flex-row">
              <motion.div
                className="flex flex-col items-center text-center"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.15 }}
              >
                <motion.div
                  className="glass-panel flex h-16 w-16 items-center justify-center rounded-full border-2 border-gold/40 bg-surface"
                  whileHover={{ scale: 1.12, borderColor: "oklch(0.72 0.18 255 / 70%)" }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <motion.div
                    whileHover={{ rotate: -10, scale: 1.2 }}
                    transition={{ type: "spring", stiffness: 400 }}
                  >
                    <step.icon className="h-7 w-7 text-gold" />
                  </motion.div>
                </motion.div>
                <div className="mt-1 font-display text-sm font-bold text-gold">0{i + 1}</div>
                <h3 className="mt-3 text-lg font-semibold text-text-primary">{step.title}</h3>
                <p className="mt-2 max-w-[240px] text-sm text-text-secondary">{step.desc}</p>
              </motion.div>
              {i < steps.length - 1 && (
                <motion.div
                  className="my-4 h-12 w-[1px] bg-gold/30 md:mx-4 md:my-0 md:h-[1px] md:w-full"
                  initial={{ scaleX: 0 }}
                  whileInView={{ scaleX: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 + i * 0.15, duration: 0.6 }}
                />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
