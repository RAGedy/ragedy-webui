import { useState } from "react";
import { MessageSquare, Type, ImageIcon } from "lucide-react";

const tabs = [
  { id: "chat", label: "Chat", icon: MessageSquare },
  { id: "completions", label: "Completions", icon: Type },
  { id: "images", label: "Images", icon: ImageIcon },
];

export function PlaygroundPage() {
  const [activeTab, setActiveTab] = useState("chat");

  return (
    <div className="flex-1 flex flex-col min-h-0">
      <div className="shrink-0 flex gap-0 px-6" style={{ background: "var(--ember-shadow)" }}>
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className="flex items-center gap-2 px-4 py-3 relative transition-colors"
            style={{ color: activeTab === tab.id ? "var(--ember-text-primary)" : "var(--ember-text-tertiary)", fontSize: 13, fontWeight: 500 }}
          >
            <tab.icon size={16} strokeWidth={1.5} />
            {tab.label}
            {activeTab === tab.id && (
              <div className="absolute bottom-0 left-0 right-0 h-[2px]" style={{ background: "var(--ember-flame)" }} />
            )}
          </button>
        ))}
      </div>
      <div className="flex-1 flex items-center justify-center">
        <p className="text-[14px] text-[var(--ember-text-tertiary)]">
          {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} playground
        </p>
      </div>
    </div>
  );
}
