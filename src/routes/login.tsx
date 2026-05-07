import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { motion } from "framer-motion";
import { SceneIQLogo } from "@/components/SceneIQLogo";
import { Eye, EyeOff, Shield } from "lucide-react";

export const Route = createFileRoute("/login")({
  component: LoginPage,
  head: () => ({
    meta: [
      { title: "Officer Login — SCENEIQ" },
      { name: "description", content: "Restricted system. Authorized personnel only." },
    ],
  }),
});

function LoginPage() {
  const [showPass, setShowPass] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate({ to: "/dashboard" });
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-background px-4">
      {/* Geometric grid bg */}
      <div className="absolute inset-0 opacity-[0.02]" style={{
        backgroundImage: "repeating-linear-gradient(45deg, transparent, transparent 40px, oklch(0.72 0.12 85) 40px, oklch(0.72 0.12 85) 41px)",
      }} />

      {/* Gold shield decorative */}
      <Shield className="absolute bottom-8 left-8 h-24 w-24 text-gold/5" />

      <motion.div
        className="relative w-full max-w-[420px]"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="gold-top-border rounded-[4px] border border-border-accent bg-card p-8 shadow-[0_24px_80px_rgba(0,0,0,0.9)]">
          <div className="flex justify-center">
            <SceneIQLogo size="large" />
          </div>

          <h1 className="mt-6 text-center font-display text-2xl font-bold text-text-primary">
            Officer Authentication
          </h1>
          <p className="mt-2 text-center text-[13px] text-destructive/80">
            Restricted system. Authorized personnel only.
          </p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
            <div>
              <label className="text-[11px] font-semibold uppercase tracking-[0.15em] text-text-muted">
                Badge Number / Email
              </label>
              <input
                type="text"
                placeholder="Enter badge number or email"
                className="mt-2 w-full rounded-[2px] border border-border-accent bg-input px-4 py-3 text-sm text-text-primary placeholder:text-text-muted focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold"
              />
            </div>

            <div>
              <label className="text-[11px] font-semibold uppercase tracking-[0.15em] text-text-muted">
                Password
              </label>
              <div className="relative mt-2">
                <input
                  type={showPass ? "text" : "password"}
                  placeholder="Enter password"
                  className="w-full rounded-[2px] border border-border-accent bg-input px-4 py-3 pr-10 text-sm text-text-primary placeholder:text-text-muted focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gold/60 hover:text-gold"
                >
                  {showPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full rounded-[6px] bg-gold py-3 text-[13px] font-semibold uppercase tracking-[0.1em] text-background shadow-[0_2px_12px_rgba(201,168,76,0.25)] transition-all duration-200 hover:bg-gold-light hover:scale-[1.01]"
            >
              Sign In
            </button>
          </form>

          <div className="my-6 flex items-center gap-3">
            <div className="h-[1px] flex-1 bg-border-accent" />
            <span className="text-[10px] uppercase tracking-[0.15em] text-text-muted">Secure Portal</span>
            <div className="h-[1px] flex-1 bg-border-accent" />
          </div>

          <p className="text-center text-[12px] text-text-muted">
            Forgot credentials? Contact your district admin
          </p>
        </div>
      </motion.div>
    </div>
  );
}
