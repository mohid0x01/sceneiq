import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { FileText, CheckCircle, Loader, TrendingUp, ArrowRight } from "lucide-react";

export const Route = createFileRoute("/dashboard/")({
  component: DashboardHome,
});

const stats = [
  { label: "Total FIRs Submitted", value: "47", icon: FileText },
  { label: "Reconstructions Completed", value: "43", icon: CheckCircle },
  { label: "Processing", value: "2", icon: Loader, pulse: true },
  { label: "Success Rate", value: "91.4%", icon: TrendingUp },
];

const recentCases = [
  { id: "FIR-2024-SHK-00142", district: "Khairpur", date: "2024-12-18", status: "completed", entities: 6 },
  { id: "FIR-2024-SHK-00141", district: "Khairpur", date: "2024-12-17", status: "processing", entities: 4 },
  { id: "FIR-2024-SHK-00140", district: "Sukkur", date: "2024-12-16", status: "completed", entities: 8 },
  { id: "FIR-2024-SHK-00139", district: "Larkana", date: "2024-12-15", status: "completed", entities: 3 },
  { id: "FIR-2024-SHK-00138", district: "Khairpur", date: "2024-12-14", status: "failed", entities: 0 },
];

const statusStyles: Record<string, string> = {
  completed: "bg-gold/10 text-gold",
  processing: "bg-processing/20 text-blue-400",
  failed: "bg-destructive/10 text-destructive",
};

function DashboardHome() {
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
        <div className="overflow-hidden rounded-[4px] border border-border-subtle">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border-subtle bg-surface">
                <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-[0.12em] text-text-muted">Case No.</th>
                <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-[0.12em] text-text-muted">District</th>
                <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-[0.12em] text-text-muted">Submitted</th>
                <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-[0.12em] text-text-muted">Status</th>
                <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-[0.12em] text-text-muted">Entities</th>
                <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-[0.12em] text-text-muted">Action</th>
              </tr>
            </thead>
            <tbody>
              {recentCases.map((c, i) => (
                <tr key={c.id} className={`border-b border-border-subtle transition-colors hover:bg-surface-overlay hover:border-l-[3px] hover:border-l-gold ${i % 2 === 0 ? "bg-card" : "bg-[oklch(0.11_0.005_60)]"}`}>
                  <td className="px-4 py-3 font-mono text-sm text-gold">{c.id}</td>
                  <td className="px-4 py-3 text-sm text-text-secondary">{c.district}</td>
                  <td className="px-4 py-3 font-mono text-sm text-text-muted">{c.date}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-block rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.05em] ${statusStyles[c.status]}`}>
                      {c.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-text-secondary">{c.entities}</td>
                  <td className="px-4 py-3">
                    {c.status === "completed" && (
                      <Link to="/dashboard/viewer" className="flex items-center gap-1 text-[12px] font-semibold uppercase tracking-[0.1em] text-gold hover:text-gold-light">
                        View Scene <ArrowRight className="h-3 w-3" />
                      </Link>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
