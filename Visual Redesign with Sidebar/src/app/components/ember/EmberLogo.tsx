import { Flame } from "lucide-react";

export function EmberLogo({ size = 24, className = "" }: { size?: number; className?: string }) {
  return (
    <div className={`inline-flex items-center justify-center ${className}`}>
      <Flame
        size={size}
        className="text-[var(--ember-flame)]"
        style={{ filter: "drop-shadow(0 0 6px rgba(255,77,0,0.5))" }}
        strokeWidth={1.5}
      />
    </div>
  );
}
