import { useState } from "react";
import { Plus, FileText } from "lucide-react";

const mockNotes = [
  { id: "1", title: "Meeting Notes - Q1 Review", content: "Discussed quarterly goals and performance metrics...", updated: "2h ago" },
  { id: "2", title: "Architecture Decision Record", content: "Moving to microservices architecture for the payment system...", updated: "1d ago" },
  { id: "3", title: "Research: LLM Fine-tuning", content: "Notes on parameter-efficient fine-tuning approaches...", updated: "3d ago" },
];

export function NotesPage() {
  const [selectedNote, setSelectedNote] = useState<string | null>(null);
  const note = mockNotes.find(n => n.id === selectedNote);

  return (
    <div className="flex-1 flex min-h-0">
      {/* Notes list */}
      <div
        className="w-[280px] shrink-0 flex flex-col h-full border-r"
        style={{ background: "var(--ember-shadow)", borderColor: "rgba(69,69,69,0.4)" }}
      >
        <div className="flex items-center justify-between px-4 py-3 border-b" style={{ borderColor: "rgba(69,69,69,0.4)" }}>
          <span className="text-[14px] text-[var(--ember-text-primary)]" style={{ fontWeight: 600 }}>Notes</span>
          <button
            className="w-7 h-7 rounded-md flex items-center justify-center hover:bg-[var(--ember-ash)] transition-colors"
            aria-label="New note"
          >
            <Plus size={16} className="text-[var(--ember-flame)]" strokeWidth={1.5} />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto ember-scrollbar-hidden">
          {mockNotes.map(n => (
            <button
              key={n.id}
              onClick={() => setSelectedNote(n.id)}
              className="w-full text-left px-4 py-3 transition-colors hover:bg-[var(--ember-ash)]"
              style={{
                background: selectedNote === n.id ? "var(--ember-stone)" : undefined,
                borderLeft: selectedNote === n.id ? "2px solid var(--ember-flame)" : "2px solid transparent",
              }}
            >
              <div className="text-[13px] text-[var(--ember-text-primary)] truncate" style={{ fontWeight: 500 }}>{n.title}</div>
              <div className="text-[12px] text-[var(--ember-text-tertiary)] mt-0.5">{n.updated}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Editor */}
      <div className="flex-1 flex flex-col p-8">
        {note ? (
          <div className="max-w-[700px] mx-auto w-full">
            <input
              defaultValue={note.title}
              className="w-full bg-transparent outline-none text-[var(--ember-text-primary)] mb-4"
              style={{ fontFamily: "'Archivo', sans-serif", fontSize: 24, fontWeight: 600 }}
            />
            <textarea
              defaultValue={note.content}
              className="w-full flex-1 bg-transparent outline-none text-[var(--ember-text-primary)] resize-none"
              style={{ fontSize: 15, lineHeight: 1.8, minHeight: 400 }}
            />
          </div>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center">
            <FileText size={48} className="text-[var(--ember-text-tertiary)]" style={{ opacity: 0.3 }} strokeWidth={1.5} />
            <p className="text-[14px] text-[var(--ember-text-tertiary)] mt-3">Select a note or create a new one</p>
          </div>
        )}
      </div>
    </div>
  );
}
