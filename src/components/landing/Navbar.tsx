import { Link } from "@tanstack/react-router";
import { SceneIQLogo } from "@/components/SceneIQLogo";
import { DiamondSeparator } from "@/components/GoldDivider";

const navLinks = ["Home", "About", "Features", "How It Works", "Contact"];

export function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 h-16 border-b border-subtle bg-background/95 backdrop-blur-[12px]">
      <div className="mx-auto flex h-full max-w-7xl items-center justify-between px-6">
        <Link to="/">
          <SceneIQLogo />
        </Link>

        <div className="hidden items-center md:flex">
          {navLinks.map((link, i) => (
            <span key={link} className="flex items-center">
              {i > 0 && <DiamondSeparator />}
              <a
                href={`#${link.toLowerCase().replace(/\s+/g, "-")}`}
                className="text-[13px] uppercase tracking-[0.12em] text-text-secondary transition-colors duration-200 hover:text-gold"
              >
                {link}
              </a>
            </span>
          ))}
        </div>

        <Link to="/login">
          <button className="rounded-[6px] border border-gold/60 px-5 py-2 text-[12px] font-semibold uppercase tracking-[0.12em] text-gold transition-all duration-200 hover:bg-gold hover:text-primary-foreground">
            Officer Login
          </button>
        </Link>
      </div>
    </nav>
  );
}
