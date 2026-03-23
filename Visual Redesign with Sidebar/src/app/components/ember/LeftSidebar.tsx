import { useState } from "react";
import {
  PenSquare, Search, Hash, ChevronDown, ChevronRight, Folder, Pin,
  MoreHorizontal, FlaskConical, Shield, Settings, Keyboard,
  Archive, HelpCircle, LogOut, Flame
} from "lucide-react";
import { useNavigate, useLocation } from "react-router";
import { EmberLogo } from "./EmberLogo";

const mockChats = [
  { id: "1", title: "How to optimize React performance", date: "today", pinned: true },
  { id: "2", title: "Explain quantum computing basics", date: "today", pinned: false },
  { id: "3", title: "Write a Python web scraper", date: "today", pinned: false },
  { id: "4", title: "Best practices for API design", date: "yesterday", pinned: false },
  { id: "5", title: "Kubernetes deployment strategies", date: "yesterday", pinned: false },
  { id: "6", title: "Machine learning model evaluation", date: "week", pinned: false },
  { id: "7", title: "Database schema design patterns", date: "week", pinned: false },
  { id: "8", title: "CSS Grid vs Flexbox comparison", date: "week", pinned: false },
];

const mockChannels = [
  { id: "general", name: "general" },
  { id: "random", name: "random" },
  { id: "dev", name: "dev-chat" },
];

const groupByDate = (chats: typeof mockChats) => {
  const groups: Record<string, typeof mockChats> = {};
  chats.forEach(c => {
    const label = c.date === "today" ? "Today" : c.date === "yesterday" ? "Yesterday" : "Previous 7 Days";
    if (!groups[label]) groups[label] = [];
    groups[label].push(c);
  });
  return groups;
};

export function LeftSidebar({ isOpen, onToggle }: { isOpen: boolean; onToggle: () => void }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [channelsOpen, setChannelsOpen] = useState(true);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const grouped = groupByDate(mockChats);

  if (!isOpen) return null;

  return (
    <aside
      className="h-full flex flex-col relative"
      style={{
        width: 260,
        background: "var(--ember-shadow)",
        flexShrink: 0,
      }}
    >
      {/* Accent stripe right edge */}
      <div className="ember-stripe absolute right-0 top-0 bottom-0 w-[2px] z-10" />

      {/* Header */}
      <div
        className="flex items-center gap-2 px-3 shrink-0"
        style={{ height: 56, borderBottom: "1px solid rgba(69,69,69,0.4)" }}
      >
        <EmberLogo size={24} />
        <span className="text-[var(--ember-text-primary)] font-['Archivo'] tracking-tight" style={{ fontSize: 16, fontWeight: 600 }}>Ember</span>
        <div className="flex-1" />
        <button
          onClick={() => navigate("/")}
          className="w-8 h-8 rounded-lg flex items-center justify-center ember-glow transition-colors hover:bg-[var(--ember-ash)]"
          aria-label="New Chat"
        >
          <PenSquare size={18} className="text-[var(--ember-text-secondary)] hover:text-[var(--ember-flame)]" strokeWidth={1.5} />
        </button>
        <button
          className="w-8 h-8 rounded-lg flex items-center justify-center transition-colors hover:bg-[var(--ember-ash)]"
          aria-label="Search"
        >
          <Search size={18} className="text-[var(--ember-text-secondary)]" strokeWidth={1.5} />
        </button>
      </div>

      {/* Channels */}
      <div className="px-[9px] pt-2">
        <button
          onClick={() => setChannelsOpen(!channelsOpen)}
          className="flex items-center gap-1.5 w-full px-1 py-1"
        >
          <Hash size={14} className="text-[var(--ember-text-tertiary)]" strokeWidth={1.25} />
          <span className="text-[11px] tracking-[0.3px] uppercase text-[var(--ember-text-tertiary)]" style={{ fontWeight: 500 }}>Channels</span>
          {channelsOpen
            ? <ChevronDown size={12} className="text-[var(--ember-text-tertiary)] ml-auto" />
            : <ChevronRight size={12} className="text-[var(--ember-text-tertiary)] ml-auto" />
          }
        </button>
        {channelsOpen && (
          <div className="mt-0.5">
            {mockChannels.map(ch => {
              const active = location.pathname === `/channels/${ch.id}`;
              return (
                <button
                  key={ch.id}
                  onClick={() => navigate(`/channels/${ch.id}`)}
                  className="flex items-center gap-2 w-full px-2 rounded-md transition-colors"
                  style={{
                    height: 36,
                    background: active ? "var(--ember-stone)" : undefined,
                    borderLeft: active ? "2px solid var(--ember-flame)" : "2px solid transparent",
                  }}
                >
                  <Hash size={14} className={active ? "text-[var(--ember-flame)]" : "text-[var(--ember-text-tertiary)]"} strokeWidth={1.25} />
                  <span
                    className="text-[13px] truncate"
                    style={{ color: active ? "var(--ember-text-primary)" : "var(--ember-text-secondary)" }}
                  >
                    {ch.name}
                  </span>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Chat list */}
      <div className="flex-1 overflow-y-auto ember-scrollbar-hidden px-[9px] pt-2">
        {Object.entries(grouped).map(([label, chats]) => (
          <div key={label}>
            <div className="px-3 py-2.5 text-[11px] tracking-[0.3px] uppercase text-[var(--ember-text-tertiary)]" style={{ fontWeight: 500 }}>
              {label}
            </div>
            {chats.map(chat => {
              const active = location.pathname === `/c/${chat.id}`;
              return (
                <button
                  key={chat.id}
                  onClick={() => navigate(`/c/${chat.id}`)}
                  className="flex items-center gap-2 w-full px-2 rounded-md transition-all group"
                  style={{
                    minHeight: 36,
                    padding: "4px 9px",
                    background: active ? "var(--ember-stone)" : undefined,
                    borderLeft: active ? "2px solid var(--ember-flame)" : "2px solid transparent",
                  }}
                >
                  {chat.pinned && <Pin size={12} className="text-[var(--ember-spark)] shrink-0" strokeWidth={1.5} />}
                  <span
                    className="text-[13px] truncate text-left"
                    style={{ color: active ? "var(--ember-text-primary)" : "var(--ember-text-secondary)" }}
                  >
                    {chat.title}
                  </span>
                </button>
              );
            })}
          </div>
        ))}
      </div>

      {/* User menu */}
      <div
        className="shrink-0 px-3 flex items-center gap-3 relative"
        style={{ height: 64, borderTop: "1px solid rgba(69,69,69,0.4)" }}
      >
        <div
          className="w-8 h-8 rounded-full flex items-center justify-center shrink-0"
          style={{ background: "var(--ember-ash)", fontSize: 13, fontWeight: 500, color: "var(--ember-text-primary)" }}
        >
          A
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-[13px] truncate" style={{ fontWeight: 500, color: "var(--ember-text-primary)" }}>Admin User</div>
          <div className="text-[11px] truncate" style={{ color: "var(--ember-text-tertiary)" }}>🟢 Online</div>
        </div>
        <button
          onClick={() => setUserMenuOpen(!userMenuOpen)}
          className="w-8 h-8 rounded-lg flex items-center justify-center transition-colors hover:bg-[var(--ember-ash)]"
        >
          <MoreHorizontal size={16} className="text-[var(--ember-text-tertiary)]" strokeWidth={1.5} />
        </button>

        {/* Dropdown */}
        {userMenuOpen && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setUserMenuOpen(false)} />
            <div
              className="absolute bottom-[68px] left-3 z-50"
              style={{
                width: 220,
                background: "var(--ember-stone)",
                border: "1px solid var(--ember-cinder)",
                borderRadius: 12,
                boxShadow: "0 -8px 32px rgba(0,0,0,0.6)",
                padding: "4px 0",
              }}
            >
              {[
                { icon: FlaskConical, label: "Playground", path: "/playground" },
                { icon: Shield, label: "Admin Panel", path: "/admin" },
              ].map(item => (
                <button
                  key={item.label}
                  onClick={() => { navigate(item.path); setUserMenuOpen(false); }}
                  className="flex items-center gap-2.5 w-full px-3 py-2 hover:bg-[var(--ember-ash)] transition-colors"
                >
                  <item.icon size={16} className="text-[var(--ember-text-tertiary)]" strokeWidth={1.5} />
                  <span className="text-[13px] text-[var(--ember-text-secondary)]">{item.label}</span>
                </button>
              ))}
              <div className="mx-3 my-1" style={{ height: 1, background: "rgba(69,69,69,0.3)" }} />
              {[
                { icon: Settings, label: "Settings" },
                { icon: Keyboard, label: "Keyboard Shortcuts" },
                { icon: Archive, label: "Archived Chats" },
                { icon: HelpCircle, label: "Help & Docs" },
              ].map(item => (
                <button
                  key={item.label}
                  onClick={() => setUserMenuOpen(false)}
                  className="flex items-center gap-2.5 w-full px-3 py-2 hover:bg-[var(--ember-ash)] transition-colors"
                >
                  <item.icon size={16} className="text-[var(--ember-text-tertiary)]" strokeWidth={1.5} />
                  <span className="text-[13px] text-[var(--ember-text-secondary)]">{item.label}</span>
                </button>
              ))}
              <div className="mx-3 my-1" style={{ height: 1, background: "rgba(69,69,69,0.3)" }} />
              <button
                onClick={() => { navigate("/auth"); setUserMenuOpen(false); }}
                className="flex items-center gap-2.5 w-full px-3 py-2 hover:bg-[var(--ember-ash)] transition-colors"
              >
                <LogOut size={16} className="text-[var(--ember-text-tertiary)]" strokeWidth={1.5} />
                <span className="text-[13px] text-[var(--ember-text-secondary)]">Sign Out</span>
              </button>
            </div>
          </>
        )}
      </div>
    </aside>
  );
}
