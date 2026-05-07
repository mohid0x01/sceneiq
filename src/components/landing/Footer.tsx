import { SceneIQLogo } from "@/components/SceneIQLogo";
import { Link } from "@tanstack/react-router";

export function Footer() {
  return (
    <footer id="contact" className="border-t border-subtle bg-[oklch(0.06_0.005_60)]">
      <div className="gold-divider" style={{ width: "100%" }} />
      <div className="mx-auto max-w-7xl px-6 py-16">
        <div className="flex flex-col justify-between gap-8 md:flex-row">
          <div>
            <SceneIQLogo />
            <p className="mt-4 max-w-xs text-sm text-text-secondary">
              AI-powered FIR scene reconstruction for Pakistan law enforcement. Turning unstructured narratives into actionable intelligence.
            </p>
          </div>
          <div className="flex gap-16">
            <div>
              <h4 className="text-[11px] font-semibold uppercase tracking-[0.15em] text-gold">Platform</h4>
              <div className="mt-4 flex flex-col gap-2">
                <Link to="/login" className="text-sm text-text-secondary hover:text-gold">Officer Portal</Link>
                <a href="#features" className="text-sm text-text-secondary hover:text-gold">Features</a>
                <a href="#how-it-works" className="text-sm text-text-secondary hover:text-gold">How It Works</a>
              </div>
            </div>
            <div>
              <h4 className="text-[11px] font-semibold uppercase tracking-[0.15em] text-gold">Institution</h4>
              <div className="mt-4 flex flex-col gap-2">
                <span className="text-sm text-text-secondary">SALU Khairpur</span>
                <span className="text-sm text-text-secondary">ICS Department</span>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-12 border-t border-subtle pt-6 text-center text-[12px] text-text-muted">
          © {new Date().getFullYear()} SCENEIQ. Institute of Computer Science, Shah Abdul Latif University, Khairpur.
        </div>
      </div>
    </footer>
  );
}
