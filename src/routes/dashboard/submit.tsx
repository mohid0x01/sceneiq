import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { motion } from "framer-motion";
import { Check } from "lucide-react";

export const Route = createFileRoute("/dashboard/submit")({
  component: SubmitFIR,
});

const districts = ["Khairpur", "Sukkur", "Larkana", "Hyderabad", "Karachi South", "Karachi East", "Thatta", "Dadu", "Nawabshah"];
const incidentTypes = ["Theft", "Assault", "Vehicular", "Property", "Kidnapping", "Robbery", "Other"];
const pipelineStages = ["Preprocessing", "Entity Extraction", "Spatial Resolution", "Timeline Sequencing", "Scene Generation"];

const tips = [
  "Include all actor descriptions as stated",
  "Mention locations by name or landmark",
  "Include directional references if present",
  "Roman Urdu is fully supported",
  "Minimum 50 words for accurate reconstruction",
];

function SubmitFIR() {
  const [narrative, setNarrative] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate({ to: "/dashboard/processing" });
  };

  return (
    <div className="grid gap-8 lg:grid-cols-5">
      <motion.div
        className="lg:col-span-3"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <h1 className="font-display text-3xl font-bold text-text-primary">Submit FIR for Reconstruction</h1>
        <div className="gold-divider mt-2" style={{ width: "60px" }} />

        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
          <div className="grid gap-5 md:grid-cols-2">
            <div>
              <label className="text-[11px] font-semibold uppercase tracking-[0.15em] text-text-muted">Case Number</label>
              <input
                type="text"
                defaultValue="FIR-2024-SHK-00143"
                className="mt-2 w-full rounded-[2px] border border-border-accent bg-input px-4 py-3 font-mono text-sm text-gold placeholder:text-text-muted focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold"
              />
            </div>
            <div>
              <label className="text-[11px] font-semibold uppercase tracking-[0.15em] text-text-muted">District</label>
              <select className="mt-2 w-full rounded-[2px] border border-border-accent bg-input px-4 py-3 text-sm text-text-primary focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold">
                {districts.map(d => <option key={d}>{d}</option>)}
              </select>
            </div>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            <div>
              <label className="text-[11px] font-semibold uppercase tracking-[0.15em] text-text-muted">Date of Incident</label>
              <input
                type="date"
                className="mt-2 w-full rounded-[2px] border border-border-accent bg-input px-4 py-3 text-sm text-text-primary focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold"
              />
            </div>
            <div>
              <label className="text-[11px] font-semibold uppercase tracking-[0.15em] text-text-muted">Incident Type</label>
              <select className="mt-2 w-full rounded-[2px] border border-border-accent bg-input px-4 py-3 text-sm text-text-primary focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold">
                {incidentTypes.map(t => <option key={t}>{t}</option>)}
              </select>
            </div>
          </div>

          <div>
            <label className="text-[11px] font-semibold uppercase tracking-[0.15em] text-text-muted">FIR Narrative</label>
            <div className="relative mt-2">
              <textarea
                value={narrative}
                onChange={(e) => setNarrative(e.target.value)}
                rows={10}
                placeholder="Enter the full FIR narrative here. Roman Urdu and English both supported. Example: Mulzim Ahmed ne raat 11 baje Bazaar Road par victim Imran ko loha rod se mara..."
                className="w-full resize-none rounded-[2px] border border-border-accent bg-[oklch(0.11_0.005_60)] px-4 py-3 text-sm leading-relaxed text-text-primary placeholder:text-text-muted focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold"
              />
              <span className="absolute bottom-3 right-3 font-mono text-[11px] text-text-muted">
                {narrative.length} chars
              </span>
            </div>
          </div>

          <button
            type="submit"
            className="w-full rounded-[6px] bg-gold py-3.5 text-[13px] font-semibold uppercase tracking-[0.1em] text-background shadow-[0_2px_12px_rgba(201,168,76,0.25)] transition-all duration-200 hover:bg-gold-light hover:scale-[1.01]"
          >
            Process FIR →
          </button>
        </form>
      </motion.div>

      {/* Right panel */}
      <motion.div
        className="lg:col-span-2"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
      >
        <div className="gold-top-border rounded-[4px] border border-border-subtle bg-card p-6">
          <h3 className="text-sm font-semibold text-text-primary">Submission Guidelines</h3>
          <div className="mt-4 space-y-3">
            {tips.map((tip) => (
              <div key={tip} className="flex items-start gap-2">
                <span className="mt-0.5 text-gold">✦</span>
                <span className="text-sm text-text-secondary">{tip}</span>
              </div>
            ))}
          </div>

          <div className="gold-divider my-6" style={{ width: "100%" }} />

          <h4 className="text-[11px] font-semibold uppercase tracking-[0.15em] text-text-muted">Pipeline Stages</h4>
          <div className="mt-4 space-y-3">
            {pipelineStages.map((stage, i) => (
              <div key={stage} className="flex items-center gap-3">
                <div className="flex h-6 w-6 items-center justify-center rounded-full border border-border-accent text-[10px] font-semibold text-text-muted">
                  {i + 1}
                </div>
                <span className="text-sm text-text-secondary">{stage}</span>
              </div>
            ))}
          </div>

          <p className="mt-6 text-center font-mono text-[11px] text-text-muted">
            Average processing time: 18-30 seconds
          </p>
        </div>
      </motion.div>
    </div>
  );
}
