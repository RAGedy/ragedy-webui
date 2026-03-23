import { useState } from "react";
import { Users, BarChart3, Award, Code, Settings, Shield } from "lucide-react";

const tabs = [
  { id: "users", label: "Users", icon: Users },
  { id: "analytics", label: "Analytics", icon: BarChart3 },
  { id: "evaluations", label: "Evaluations", icon: Award },
  { id: "functions", label: "Functions", icon: Code },
  { id: "settings", label: "Settings", icon: Settings },
];

const mockUsers = [
  { id: "1", name: "Admin User", email: "admin@ember.ai", role: "Admin", status: "Active" },
  { id: "2", name: "Jane Smith", email: "jane@ember.ai", role: "User", status: "Active" },
  { id: "3", name: "Bob Wilson", email: "bob@ember.ai", role: "User", status: "Inactive" },
  { id: "4", name: "Alice Chen", email: "alice@ember.ai", role: "User", status: "Active" },
  { id: "5", name: "Mike Johnson", email: "mike@ember.ai", role: "Moderator", status: "Active" },
];

export function AdminPage() {
  const [activeTab, setActiveTab] = useState("users");

  return (
    <div className="flex-1 flex flex-col min-h-0 overflow-y-auto ember-scrollbar">
      {/* Banner */}
      <div className="shrink-0 px-6 py-4" style={{ background: "var(--ember-shadow)" }}>
        <div className="flex items-center gap-3">
          <Shield size={24} className="text-[var(--ember-flame)]" strokeWidth={1.5} />
          <h2 className="text-[var(--ember-text-primary)]" style={{ fontFamily: "'Archivo', sans-serif", fontSize: 20 }}>Admin Panel</h2>
        </div>
        <div className="mt-2 h-[2px]" style={{ background: "linear-gradient(to right, var(--ember-core), var(--ember-glow), var(--ember-flare))" }} />
      </div>

      {/* Tab strip */}
      <div className="shrink-0 flex gap-0 px-6 border-b border-[rgba(69,69,69,0.4)]" style={{ background: "var(--ember-shadow)" }}>
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
        <div className="max-w-[1000px] mx-auto">
          {activeTab === "users" && (
            <div className="rounded-xl overflow-hidden" style={{ border: "1px solid var(--ember-cinder)" }}>
              <table className="w-full">
                <thead>
                  <tr style={{ background: "var(--ember-shadow)" }}>
                    {["Name", "Email", "Role", "Status"].map(h => (
                      <th key={h} className="text-left px-4 py-3 text-[11px] uppercase tracking-wider text-[var(--ember-text-tertiary)]" style={{ fontWeight: 500 }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {mockUsers.map((user, i) => (
                    <tr
                      key={user.id}
                      className="hover:bg-[var(--ember-ash)] transition-colors cursor-pointer"
                      style={{ background: i % 2 === 0 ? "var(--ember-graphite)" : "var(--ember-stone)" }}
                    >
                      <td className="px-4 py-3 text-[14px] text-[var(--ember-text-primary)]">{user.name}</td>
                      <td className="px-4 py-3 text-[14px] text-[var(--ember-text-secondary)]">{user.email}</td>
                      <td className="px-4 py-3">
                        <span
                          className="text-[11px] px-2 py-0.5 rounded"
                          style={{
                            background: user.role === "Admin" ? "rgba(255,77,0,0.15)" : "var(--ember-stone)",
                            color: user.role === "Admin" ? "var(--ember-flame)" : "var(--ember-text-secondary)",
                            fontWeight: 500,
                          }}
                        >
                          {user.role}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-[13px]" style={{ color: user.status === "Active" ? "var(--ember-success)" : "var(--ember-text-tertiary)" }}>
                          {user.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          {activeTab !== "users" && (
            <div className="flex flex-col items-center justify-center py-20">
              <p className="text-[var(--ember-text-tertiary)] text-[14px]">{activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} content</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
