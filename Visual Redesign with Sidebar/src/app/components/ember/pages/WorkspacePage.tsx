import { useState } from "react";
import { useNavigate, useLocation } from "react-router";
import { Plus, Brain, BookOpen, MessageSquare, Zap, Wrench } from "lucide-react";

const tabs = [
  { id: "models", label: "Models", icon: Brain },
  { id: "knowledge", label: "Knowledge", icon: BookOpen },
  { id: "prompts", label: "Prompts", icon: MessageSquare },
  { id: "skills", label: "Skills", icon: Zap },
  { id: "tools", label: "Tools", icon: Wrench },
];

const mockItems: Record<string, { id: string; name: string; description: string }[]> = {
  models: [
    { id: "1", name: "Custom GPT-4o", description: "Fine-tuned for code review tasks" },
    { id: "2", name: "Content Writer", description: "Optimized for blog and marketing copy" },
    { id: "3", name: "Data Analyst", description: "Specializes in data interpretation" },
  ],
  knowledge: [
    { id: "1", name: "Company Docs", description: "Internal documentation and policies" },
    { id: "2", name: "API Reference", description: "REST API documentation v3.2" },
  ],
  prompts: [
    { id: "1", name: "Code Review", description: "Structured code review prompt template" },
    { id: "2", name: "Summarizer", description: "Concise document summarization" },
  ],
  skills: [
    { id: "1", name: "Web Search", description: "Search the web for current information" },
  ],
  tools: [
    { id: "1", name: "Calculator", description: "Mathematical calculations" },
    { id: "2", name: "Weather API", description: "Current weather data lookup" },
  ],
};

export function WorkspacePage() {
  const [activeTab, setActiveTab] = useState("models");
  const items = mockItems[activeTab] || [];

  return (
    <div className="flex-1 flex flex-col min-h-0 overflow-y-auto ember-scrollbar">
      {/* Tab strip */}
      <div className="shrink-0 flex gap-0 px-6 pt-2" style={{ background: "var(--ember-shadow)" }}>
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

      {/* Content */}
      <div className="flex-1 p-6">
        <div className="max-w-[900px] mx-auto">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-[var(--ember-text-primary)] capitalize" style={{ fontFamily: "'Archivo', sans-serif" }}>{activeTab}</h2>
            <button
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-white text-[13px] ember-glow transition-colors"
              style={{ background: "var(--ember-flame)", fontWeight: 600 }}
            >
              <Plus size={16} strokeWidth={2} />
              Create
            </button>
          </div>
          <div className="grid gap-3">
            {items.map(item => (
              <div
                key={item.id}
                className="flex items-center gap-4 px-4 py-3 rounded-xl transition-colors hover:bg-[var(--ember-ash)] cursor-pointer"
                style={{ background: "var(--ember-stone)" }}
              >
                <div className="flex-1">
                  <div className="text-[14px] text-[var(--ember-text-primary)]" style={{ fontWeight: 500 }}>{item.name}</div>
                  <div className="text-[13px] text-[var(--ember-text-secondary)] mt-0.5">{item.description}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
