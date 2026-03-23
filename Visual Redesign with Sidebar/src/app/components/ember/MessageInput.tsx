import { useState } from "react";
import { ArrowUp, Paperclip, Image, Globe, Mic, Wrench, Database } from "lucide-react";

export function MessageInput({ onSend }: { onSend?: (msg: string) => void }) {
  const [value, setValue] = useState("");
  const hasText = value.trim().length > 0;

  const handleSend = () => {
    if (hasText && onSend) {
      onSend(value.trim());
      setValue("");
    }
  };

  return (
    <div
      className="sticky bottom-0 z-20 px-4 pb-4"
      style={{
        background: "linear-gradient(to top, #212121 0%, #212121 60%, transparent 100%)",
      }}
    >
      <div className="max-w-[760px] mx-auto">
        <div
          className="relative rounded-2xl transition-shadow"
          style={{
            background: "var(--ember-stone)",
            border: "1px solid rgba(69,69,69,0.6)",
            boxShadow: "0 4px 24px rgba(0,0,0,0.4)",
          }}
        >
          <textarea
            value={value}
            onChange={e => setValue(e.target.value)}
            onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
            placeholder="Message…"
            className="w-full resize-none bg-transparent outline-none text-[var(--ember-text-primary)] placeholder:text-[var(--ember-text-tertiary)]"
            style={{ minHeight: 52, maxHeight: 240, padding: "14px 56px 14px 16px", fontSize: 15, lineHeight: 1.6 }}
            rows={1}
          />

          {/* Send button */}
          <button
            onClick={handleSend}
            disabled={!hasText}
            className={`absolute right-3 bottom-3 w-9 h-9 rounded-full flex items-center justify-center transition-all ${
              hasText ? "ember-glow" : ""
            }`}
            style={{
              background: hasText ? "var(--ember-flame)" : "var(--ember-ash)",
            }}
            aria-label="Send message"
          >
            <ArrowUp size={18} className={hasText ? "text-white" : "text-[var(--ember-text-tertiary)]"} strokeWidth={2} />
          </button>
        </div>

        {/* Toolbar */}
        <div className="flex items-center gap-1 mt-2 px-1">
          {[
            { icon: Paperclip, label: "Attach file" },
            { icon: Image, label: "Upload image" },
            { icon: Globe, label: "Web search" },
            { icon: Mic, label: "Voice input" },
            { icon: Wrench, label: "Tools" },
            { icon: Database, label: "Knowledge" },
          ].map(btn => (
            <button
              key={btn.label}
              className="w-7 h-7 rounded flex items-center justify-center hover:bg-[var(--ember-ash)] transition-colors"
              aria-label={btn.label}
            >
              <btn.icon size={16} className="text-[var(--ember-text-tertiary)] hover:text-[var(--ember-text-primary)]" strokeWidth={1.5} />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
