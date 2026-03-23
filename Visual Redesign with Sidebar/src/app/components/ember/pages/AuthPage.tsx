import { useState } from "react";
import { Flame } from "lucide-react";

export function AuthPage() {
  const [tab, setTab] = useState<"signin" | "signup">("signin");

  return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: "var(--ember-void)" }}>
      <div
        className="w-[480px] max-w-[95vw] rounded-2xl p-8"
        style={{
          background: "var(--ember-shadow)",
          boxShadow: "0 24px 64px rgba(0,0,0,0.8)",
        }}
      >
        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <Flame
            size={48}
            className="text-[var(--ember-flame)]"
            style={{ filter: "drop-shadow(0 0 20px rgba(255,77,0,0.6))" }}
            strokeWidth={1.5}
          />
          <span
            className="mt-3 text-[var(--ember-text-primary)]"
            style={{ fontFamily: "'Archivo', sans-serif", fontSize: 32, fontWeight: 700, letterSpacing: -0.5 }}
          >
            Ember
          </span>
        </div>

        {/* Tabs */}
        <div className="flex gap-0 mb-6 rounded-lg overflow-hidden" style={{ background: "var(--ember-void)" }}>
          {(["signin", "signup"] as const).map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className="flex-1 py-2.5 text-center text-[14px] transition-colors relative"
              style={{
                color: tab === t ? "var(--ember-text-primary)" : "var(--ember-text-tertiary)",
                fontWeight: 500,
              }}
            >
              {t === "signin" ? "Sign In" : "Sign Up"}
              {tab === t && (
                <div className="absolute bottom-0 left-0 right-0 h-[2px]" style={{ background: "var(--ember-flame)" }} />
              )}
            </button>
          ))}
        </div>

        {/* Form */}
        <div className="space-y-4">
          {tab === "signup" && (
            <div>
              <label className="block mb-1.5 text-[13px] text-[var(--ember-text-secondary)]" style={{ fontWeight: 500 }}>Name</label>
              <input
                type="text"
                placeholder="Your name"
                className="w-full h-11 px-3 rounded-md outline-none text-[var(--ember-text-primary)] placeholder:text-[var(--ember-text-tertiary)] transition-all focus:ring-1 focus:ring-[rgba(255,77,0,0.6)]"
                style={{ background: "var(--ember-stone)", border: "1px solid var(--ember-cinder)", fontSize: 14 }}
              />
            </div>
          )}
          <div>
            <label className="block mb-1.5 text-[13px] text-[var(--ember-text-secondary)]" style={{ fontWeight: 500 }}>Email</label>
            <input
              type="email"
              placeholder="you@example.com"
              className="w-full h-11 px-3 rounded-md outline-none text-[var(--ember-text-primary)] placeholder:text-[var(--ember-text-tertiary)] transition-all focus:ring-1 focus:ring-[rgba(255,77,0,0.6)]"
              style={{ background: "var(--ember-stone)", border: "1px solid var(--ember-cinder)", fontSize: 14 }}
            />
          </div>
          <div>
            <label className="block mb-1.5 text-[13px] text-[var(--ember-text-secondary)]" style={{ fontWeight: 500 }}>Password</label>
            <input
              type="password"
              placeholder="••••••••"
              className="w-full h-11 px-3 rounded-md outline-none text-[var(--ember-text-primary)] placeholder:text-[var(--ember-text-tertiary)] transition-all focus:ring-1 focus:ring-[rgba(255,77,0,0.6)]"
              style={{ background: "var(--ember-stone)", border: "1px solid var(--ember-cinder)", fontSize: 14 }}
            />
          </div>
          <button
            className="w-full h-11 rounded-md text-white text-[14px] ember-glow transition-colors"
            style={{ background: "var(--ember-flame)", fontWeight: 600 }}
          >
            {tab === "signin" ? "Sign In" : "Create Account"}
          </button>
          <p className="text-center text-[12px] text-[var(--ember-text-tertiary)]">
            or continue with LDAP
          </p>
        </div>
      </div>
    </div>
  );
}
