import { Flame } from "lucide-react";

export function SharedChatPage() {
  return (
    <div className="min-h-screen flex flex-col" style={{ background: "var(--ember-graphite)" }}>
      <div className="px-6 py-4 flex items-center gap-3" style={{ background: "var(--ember-shadow)", borderBottom: "1px solid rgba(69,69,69,0.4)" }}>
        <Flame size={20} className="text-[var(--ember-flame)]" strokeWidth={1.5} />
        <div>
          <div className="text-[11px] uppercase tracking-wider text-[var(--ember-text-tertiary)]" style={{ fontWeight: 500 }}>Shared Conversation</div>
          <div className="text-[14px] text-[var(--ember-text-primary)]" style={{ fontWeight: 500 }}>React Server Components Discussion</div>
        </div>
      </div>
      <div className="flex-1 p-6 max-w-[760px] mx-auto w-full">
        <p className="text-[var(--ember-text-secondary)]" style={{ fontSize: 15, lineHeight: 1.7 }}>
          This is a shared conversation view. The full message thread would appear here with the same styling as the chat interface.
        </p>
      </div>
      <div className="px-6 py-3 text-center" style={{ borderTop: "1px solid rgba(69,69,69,0.4)" }}>
        <span className="text-[12px] text-[var(--ember-text-tertiary)]">Powered by Ember</span>
      </div>
    </div>
  );
}
