import { ChevronRight, Flame } from "lucide-react";

export function RightSidebar({ isOpen, onToggle }: { isOpen: boolean; onToggle: () => void }) {
  return (
    <aside
      className="h-full relative shrink-0 overflow-hidden transition-all duration-250 ease-in-out"
      style={{
        width: isOpen ? 320 : 0,
        background: "var(--ember-charcoal)",
      }}
    >
      {/* Accent stripe left edge */}
      <div className="ember-stripe absolute left-0 top-0 bottom-0 w-[2px] z-10" />

      <div style={{ width: 320, opacity: isOpen ? 1 : 0, transition: "opacity 150ms ease" }}>
        {/* Header */}
        <div
          className="flex items-center justify-between px-4 shrink-0"
          style={{ height: 56, borderBottom: "1px solid rgba(69,69,69,0.4)" }}
        >
          <span className="text-[16px] text-[var(--ember-text-tertiary)]" style={{ fontWeight: 600, fontFamily: "'Archivo', sans-serif" }}>Panel</span>
          <button
            onClick={onToggle}
            className="w-8 h-8 rounded-lg flex items-center justify-center transition-colors hover:bg-[var(--ember-ash)]"
            aria-label="Close panel"
          >
            <ChevronRight size={16} className="text-[var(--ember-text-tertiary)]" strokeWidth={1.5} />
          </button>
        </div>

        {/* Empty state */}
        <div className="flex flex-col items-center justify-center" style={{ height: "calc(100vh - 56px)" }}>
          <Flame size={48} className="text-[var(--ember-flame)]" style={{ opacity: 0.2 }} strokeWidth={1.5} />
          <span className="text-[13px] text-[var(--ember-text-tertiary)] mt-3">Coming soon</span>
        </div>
      </div>
    </aside>
  );
}
