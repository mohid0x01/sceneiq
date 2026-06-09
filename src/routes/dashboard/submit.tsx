import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { useServerFn } from "@tanstack/react-start";
import { submitFir, runMockPipeline } from "@/lib/fir.functions";
import { supabase } from "@/integrations/supabase/client";
import {
  PAKISTAN_DISTRICTS,
  INCIDENT_TYPES,
  generateCaseNumber,
} from "@/lib/pakistan-locations";

export const Route = createFileRoute("/dashboard/submit")({
  component: SubmitFIR,
});

const pipelineStages = [
  "Preprocessing",
  "Entity Extraction",
  "Spatial Resolution",
  "Timeline Sequencing",
  "Scene Generation",
];
const tips = [
  "Include all actor descriptions as stated",
  "Mention locations by name or landmark",
  "Include directional references if present",
  "Roman Urdu is fully supported",
  "Minimum 50 words for accurate reconstruction",
];

const DEFAULT_DISTRICT = "Karachi South";

function SubmitFIR() {
  const [narrative, setNarrative] = useState("");
  const [district, setDistrict] = useState(DEFAULT_DISTRICT);
  const [caseNumber, setCaseNumber] = useState(() => generateCaseNumber(DEFAULT_DISTRICT));
  const [caseAuto, setCaseAuto] = useState(true);
  const [incidentDate, setIncidentDate] = useState("");
  const [incidentType, setIncidentType] = useState<string>("assault");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const submitFirFn = useServerFn(submitFir);
  const runPipelineFn = useServerFn(runMockPipeline);

  // Keep case number in sync with district while user hasn't manually edited it
  useEffect(() => {
    if (caseAuto) setCaseNumber(generateCaseNumber(district));
  }, [district, caseAuto]);

  const districtOptions = useMemo(() => PAKISTAN_DISTRICTS, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (narrative.length < 10) {
      setError("Narrative must be at least 10 characters.");
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate({ to: "/login" });
        return;
      }

      const result = await submitFirFn({
        data: {
          caseNumber,
          district,
          incidentDate: incidentDate || null,
          incidentType: incidentType as "assault",
          narrative,
        },
      });

      runPipelineFn({ data: { jobId: result.jobId } }).catch(console.error);
      navigate({ to: "/dashboard/processing", search: { jobId: result.jobId } });
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to submit FIR");
      setSubmitting(false);
    }
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

        {error && (
          <div className="mt-4 rounded-[4px] border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
          <div className="grid gap-5 md:grid-cols-2">
            <div>
              <div className="flex items-center justify-between">
                <label className="text-[11px] font-semibold uppercase tracking-[0.15em] text-text-muted">
                  Case Number {caseAuto && <span className="ml-1 text-gold/70">· auto</span>}
                </label>
                <button
                  type="button"
                  onClick={() => {
                    setCaseAuto(true);
                    setCaseNumber(generateCaseNumber(district));
                  }}
                  className="text-[10px] font-semibold uppercase tracking-[0.15em] text-gold/80 hover:text-gold"
                >
                  Regenerate
                </button>
              </div>
              <input
                type="text"
                value={caseNumber}
                onChange={(e) => {
                  setCaseAuto(false);
                  setCaseNumber(e.target.value);
                }}
                className="glass-input mt-2 w-full rounded-[2px] px-4 py-3 font-mono text-sm text-gold"
              />
            </div>
            <div>
              <label className="text-[11px] font-semibold uppercase tracking-[0.15em] text-text-muted">
                District / City
              </label>
              <select
                value={district}
                onChange={(e) => setDistrict(e.target.value)}
                className="glass-input mt-2 w-full rounded-[2px] px-4 py-3 text-sm text-text-primary"
              >
                {districtOptions.map((group) => (
                  <optgroup key={group.province} label={group.province}>
                    {group.districts.map((d) => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </optgroup>
                ))}
              </select>
            </div>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            <div>
              <label className="text-[11px] font-semibold uppercase tracking-[0.15em] text-text-muted">Date of Incident</label>
              <input
                type="date"
                value={incidentDate}
                onChange={(e) => setIncidentDate(e.target.value)}
                className="glass-input mt-2 w-full rounded-[2px] px-4 py-3 text-sm text-text-primary"
              />
            </div>
            <div>
              <label className="text-[11px] font-semibold uppercase tracking-[0.15em] text-text-muted">Incident Type</label>
              <select
                value={incidentType}
                onChange={(e) => setIncidentType(e.target.value)}
                className="glass-input mt-2 w-full rounded-[2px] px-4 py-3 text-sm text-text-primary"
              >
                {INCIDENT_TYPES.map((t) => (
                  <option key={t.value} value={t.value}>{t.label}</option>
                ))}
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
                className="glass-input w-full resize-none rounded-[2px] px-4 py-3 text-sm leading-relaxed text-text-primary placeholder:text-text-muted"
              />
              <span className="absolute bottom-3 right-3 font-mono text-[11px] text-text-muted">
                {narrative.length} chars
              </span>
            </div>
          </div>

          <motion.button
            type="submit"
            disabled={submitting}
            className="glass-button-primary w-full rounded-[6px] py-3.5 text-[13px] font-semibold uppercase tracking-[0.1em] disabled:opacity-50 disabled:cursor-not-allowed"
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
          >
            {submitting ? "Submitting..." : "Process FIR →"}
          </motion.button>
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
