import {
  ChevronDown, Timer, Plus, Share2, SlidersHorizontal, PanelRight, Menu
} from "lucide-react";

interface ChatNavbarProps {
  leftSidebarOpen: boolean;
  onToggleLeftSidebar: () => void;
  rightSidebarOpen: boolean;
  onToggleRightSidebar: () => void;
  title?: string;
}

export function ChatNavbar({
  leftSidebarOpen, onToggleLeftSidebar,
  rightSidebarOpen, onToggleRightSidebar,
  title
}: ChatNavbarProps) {
  return (
    <div
      className="sticky top-0 z-30 flex items-center px-4 gap-3"
      style={{
        height: 56,
        background: "linear-gradient(to bottom, #212121 0%, #212121 60%, transparent 100%)",
      }}
    >
      {/* Left */}
      <div className="flex items-center gap-2">
        {!leftSidebarOpen && (
          <button
            onClick={onToggleLeftSidebar}
            className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-[var(--ember-ash)] transition-colors"
            aria-label="Toggle sidebar"
          >
            <Menu size={20} className="text-[var(--ember-text-secondary)]" strokeWidth={1.5} />
          </button>
        )}
        <button
          className="flex items-center gap-2 px-3 rounded-lg ember-glow-subtle transition-colors hover:bg-[var(--ember-ash)] hover:border-[var(--ember-cinder)]"
          style={{
            height: 36,
            minWidth: 180,
            background: "var(--ember-stone)",
            border: "1px solid transparent",
            borderRadius: 8,
          }}
        >
          <span className="text-[14px] text-[var(--ember-text-primary)]">GPT-4o</span>
          <ChevronDown size={14} className="text-[var(--ember-text-tertiary)] ml-auto" strokeWidth={1.5} />
        </button>
      </div>

      {/* Center */}
      <div className="flex-1 flex justify-center">
        {title && (
          <span className="text-[14px] text-[var(--ember-text-secondary)] truncate max-w-[300px]">{title}</span>
        )}
      </div>

      {/* Right */}
      <div className="flex items-center gap-1">
        {[
          { icon: Timer, label: "Temporary Chat" },
          { icon: Share2, label: "Share" },
          { icon: SlidersHorizontal, label: "Controls" },
        ].map(btn => (
          <button
            key={btn.label}
            className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-[var(--ember-ash)] transition-colors"
            aria-label={btn.label}
          >
            <btn.icon size={18} className="text-[var(--ember-text-secondary)]" strokeWidth={1.5} />
          </button>
        ))}
        <button
          onClick={onToggleRightSidebar}
          className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${
            rightSidebarOpen ? "ember-glow-subtle" : ""
          }`}
          style={{
            background: rightSidebarOpen ? "rgba(255,77,0,0.1)" : undefined,
          }}
          aria-label="Toggle right sidebar"
        >
          <PanelRight
            size={18}
            className={rightSidebarOpen ? "text-[var(--ember-flame)]" : "text-[var(--ember-text-tertiary)]"}
            strokeWidth={1.5}
          />
        </button>
      </div>
    </div>
  );
}
