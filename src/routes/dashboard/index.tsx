import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { FileText, CheckCircle, Loader, TrendingUp, ArrowRight, AlertCircle } from "lucide-react";
import { useJobsRealtime } from "@/hooks/useJobRealtime";

export const Route = createFileRoute("/dashboard/")({
  component: DashboardHome,
});

const statusStyles: Record<string, string> = {
  completed: "bg-gold/10 text-gold",
  pending: "bg-text-muted/10 text-text-muted",
  preprocessing: "bg-processing/20 text-blue-400",
  entity_extraction: "bg-processing/20 text-blue-400",
  spatial_resolution: "bg-processing/20 text-blue-400",
  timeline_sequencing: "bg-processing/20 text-blue-400",
  scene_generation: "bg-processing/20 text-blue-400",
  failed: "bg-destructive/10 text-destructive",
};

const statusLabels: Record<string, string> = {
  pending: "Pending",
  preprocessing: "Stage 1/5",
  entity_extraction: "Stage 2/5",
  spatial_resolution: "Stage 3/5",
  timeline_sequencing: "Stage 4/5",
  scene_generation: "Stage 5/5",
  completed: "Completed",
  failed: "Failed",
};

function DashboardHome() {
  const jobs = useJobsRealtime();

  const totalFirs = jobs.length;
  const completed = jobs.filter(j => j.status === "completed").length;
  const processing = jobs.filter(j => !["completed", "failed", "pending"].includes(j.status)).length;
  const successRate = totalFirs > 0 ? ((completed / totalFirs) * 100).toFixed(1) : "0.0";

  const stats = [
    { label: "Total FIRs Submitted", value: String(totalFirs), icon: FileText },
    { label: "Reconstructions Completed", value: String(completed), icon: CheckCircle },
    { label: "Processing", value: String(processing), icon: Loader, pulse: processing > 0 },
    { label: "Success Rate", value: `${successRate}%`, icon: TrendingUp },
  ];

  return (
    <div>
      {/* Stats */}
      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            className="gold-top-border rounded-[4px] border border-border-subtle bg-card p-5"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: i * 0.06 }}
          >
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold uppercase tracking-[0.15em] text-text-muted">{stat.label}</span>
              <stat.icon className={`h-4 w-4 text-gold ${stat.pulse ? "gold-pulse" : ""}`} />
            </div>
            <div className="mt-3 font-display text-3xl font-bold text-gold">{stat.value}</div>
          </motion.div>
        ))}
      </div>

      {/* Recent Cases */}
      <div className="mt-10">
        <h2 className="label-uppercase mb-4">Recent Cases</h2>
        {jobs.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-[4px] border border-border-subtle bg-card py-16">
            <AlertCircle className="h-8 w-8 text-text-muted" />
            <p className="mt-3 text-sm text-text-muted">No FIR records yet. Submit your first FIR to get started.</p>
            <Link to="/dashboard/submit" className="mt-4 rounded-[4px] bg-gold px-6 py-2 text-[12px] font-semibold uppercase tracking-[0.1em] text-background">
              Submit FIR
            </Link>
          </div>
        ) : (
          <div className="overflow-hidden rounded-[4px] border border-border-subtle">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border-subtle bg-surface">
                  <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-[0.12em] text-text-muted">Case No.</th>
                  <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-[0.12em] text-text-muted">District</th>
                  <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-[0.12em] text-text-muted">Submitted</th>
                  <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-[0.12em] text-text-muted">Status</th>
                  <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-[0.12em] text-text-muted">Action</th>
                </tr>
              </thead>
              <tbody>
                {jobs.map((job, i) => (
                  <tr key={job.id} className={`border-b border-border-subtle transition-colors hover:bg-surface-overlay ${i % 2 === 0 ? "bg-card" : "bg-[oklch(0.11_0.005_60)]"}`}>
                    <td className="px-4 py-3 font-mono text-sm text-gold">{job.fir_records?.case_number || "—"}</td>
                    <td className="px-4 py-3 text-sm text-text-secondary">{job.fir_records?.district || "—"}</td>
                    <td className="px-4 py-3 font-mono text-sm text-text-muted">{new Date(job.created_at).toLocaleDateString()}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-block rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.05em] ${statusStyles[job.status] || ""}`}>
                        {statusLabels[job.status] || job.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      {job.status === "completed" ? (
                        <Link to="/dashboard/viewer" search={{ jobId: job.id }} className="flex items-center gap-1 text-[12px] font-semibold uppercase tracking-[0.1em] text-gold hover:text-gold-light">
                          View Scene <ArrowRight className="h-3 w-3" />
                        </Link>
                      ) : job.status === "failed" ? (
                        <span className="text-[12px] text-destructive">Failed</span>
                      ) : job.status !== "pending" ? (
                        <Link to="/dashboard/processing" search={{ jobId: job.id }} className="flex items-center gap-1 text-[12px] font-semibold uppercase tracking-[0.1em] text-blue-400">
                          <Loader className="h-3 w-3 animate-spin" /> Live
                        </Link>
                      ) : null}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
