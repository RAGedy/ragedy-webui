import { AlertTriangle } from "lucide-react";
import { useNavigate } from "react-router";

export function ErrorPage() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen flex flex-col items-center justify-center" style={{ background: "var(--ember-void)" }}>
      <AlertTriangle size={64} className="text-[var(--ember-error)]" strokeWidth={1.5} />
      <h1 className="mt-6 text-[var(--ember-text-primary)]" style={{ fontFamily: "'Archivo', sans-serif" }}>Connection Error</h1>
      <p className="mt-3 text-[var(--ember-text-secondary)]" style={{ fontSize: 15 }}>
        Unable to connect to the backend server. Please try again.
      </p>
      <button
        onClick={() => navigate("/")}
        className="mt-6 px-6 py-2.5 rounded-lg text-[14px] text-[var(--ember-text-primary)] transition-colors hover:bg-[var(--ember-ash)]"
        style={{ background: "var(--ember-stone)", fontWeight: 500 }}
      >
        Retry
      </button>
    </div>
  );
}
