import { Shield } from "lucide-react";

export function SceneIQLogo({ size = "default" }: { size?: "default" | "large" }) {
  const textClass = size === "large" ? "text-3xl" : "text-xl";
  return (
    <div className="flex items-center gap-2">
      <div className="relative">
        <Shield className={`${size === "large" ? "h-8 w-8" : "h-5 w-5"} text-gold`} />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className={`${size === "large" ? "h-2 w-2" : "h-1.5 w-1.5"} rounded-full bg-gold gold-pulse`} />
        </div>
      </div>
      <span className={`font-display font-bold text-gold tracking-[0.05em] ${textClass}`}>
        SCENEIQ
      </span>
    </div>
  );
}
