import { useState } from "react";
import { Flame, ThumbsUp, ThumbsDown, Copy, RefreshCcw, MoreHorizontal } from "lucide-react";
import { MessageInput } from "./MessageInput";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
}

const initialMessages: Message[] = [
  { id: "1", role: "user", content: "Can you explain how React Server Components work and when I should use them?" },
  { id: "2", role: "assistant", content: "React Server Components (RSCs) are a new paradigm that allows components to render on the server without shipping their JavaScript to the client. Here are the key concepts:\n\n**Server Components** run only on the server. They can directly access databases, file systems, and other server-side resources. They send rendered HTML to the client, reducing the JavaScript bundle size.\n\n**When to use them:**\n\n1. **Data fetching** — When a component needs to fetch data from a database or API, server components can do this without exposing credentials to the client.\n\n2. **Large dependencies** — If a component uses a heavy library (like a markdown parser), it can stay on the server so the library isn't shipped to the browser.\n\n3. **Static content** — Components that don't need interactivity are great candidates.\n\n**When NOT to use them:**\n\n- Components with `useState`, `useEffect`, or other hooks\n- Components that need browser APIs\n- Components with event handlers (onClick, onChange, etc.)\n\n```tsx\n// Server Component (default)\nasync function UserProfile({ id }: { id: string }) {\n  const user = await db.users.find(id);\n  return <div>{user.name}</div>;\n}\n\n// Client Component\n'use client'\nfunction LikeButton() {\n  const [liked, setLiked] = useState(false);\n  return <button onClick={() => setLiked(true)}>Like</button>;\n}\n```\n\nThe key insight is to push interactivity to the leaves of your component tree, keeping the heavy data-fetching components on the server." },
  { id: "3", role: "user", content: "That makes sense. What about the performance implications?" },
  { id: "4", role: "assistant", content: "Great question! The performance benefits are significant:\n\n**Bundle size reduction** — Server Components eliminate JavaScript for those components entirely. In large apps, this can reduce bundle size by 30-50%.\n\n**Streaming** — RSCs support streaming HTML, so the browser can start rendering before all data is fetched. This dramatically improves Time to First Byte (TTFB).\n\n**Automatic code splitting** — Client components imported by server components are automatically code-split, so users only download what they need.\n\nHowever, there are tradeoffs:\n- Server rendering adds latency for each request\n- You need a Node.js server (no static hosting)\n- The mental model takes time to learn\n\nFor most production apps, the benefits outweigh the costs significantly." },
];

export function ChatView({ chatId }: { chatId?: string }) {
  const [messages, setMessages] = useState<Message[]>(chatId ? initialMessages : []);

  const handleSend = (text: string) => {
    const userMsg: Message = { id: Date.now().toString(), role: "user", content: text };
    setMessages(prev => [...prev, userMsg]);
    setTimeout(() => {
      const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: "I'll think about that and get back to you with a detailed response. This is a simulated reply in the Ember UI demo."
      };
      setMessages(prev => [...prev, aiMsg]);
    }, 800);
  };

  if (messages.length === 0) {
    return (
      <div className="flex-1 flex flex-col">
        <div className="flex-1 flex flex-col items-center justify-center px-6">
          <Flame
            size={64}
            className="text-[var(--ember-flame)]"
            style={{ animation: "ember-logo-pulse 5s ease-in-out infinite alternate" }}
            strokeWidth={1.5}
          />
          <h2 className="mt-6 text-[var(--ember-text-primary)]" style={{ fontFamily: "'Archivo', sans-serif", fontSize: 24, fontWeight: 600 }}>
            What can I help with today?
          </h2>
          <div className="grid grid-cols-2 gap-3 mt-8 max-w-[480px] w-full">
            {[
              "Explain quantum computing in simple terms",
              "Write a Python script to analyze data",
              "Help me plan a trip to Japan",
              "Design a REST API for a todo app",
            ].map((suggestion, i) => (
              <button
                key={i}
                onClick={() => handleSend(suggestion)}
                className="text-left px-4 py-3 rounded-xl transition-all hover:border-[rgba(255,77,0,0.4)] hover:bg-[var(--ember-ash)]"
                style={{
                  background: "var(--ember-stone)",
                  border: "1px solid var(--ember-cinder)",
                  fontSize: 13,
                  color: "var(--ember-text-secondary)",
                  lineHeight: 1.5,
                }}
              >
                {suggestion}
              </button>
            ))}
          </div>
        </div>
        <MessageInput onSend={handleSend} />
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col min-h-0">
      <div className="flex-1 overflow-y-auto ember-scrollbar px-6 pt-8 pb-4">
        <div className="max-w-[760px] mx-auto space-y-6">
          {messages.map(msg => (
            msg.role === "user" ? (
              <div key={msg.id} className="flex justify-end">
                <div
                  className="max-w-[80%] px-4 py-3"
                  style={{
                    background: "var(--ember-stone)",
                    borderRadius: "16px 16px 4px 16px",
                    fontSize: 15,
                    lineHeight: 1.6,
                    color: "var(--ember-text-primary)",
                    boxShadow: "inset -2px 0 0 rgba(255,77,0,0.2)",
                  }}
                >
                  {msg.content}
                </div>
              </div>
            ) : (
              <div key={msg.id} className="flex gap-3 group">
                <div
                  className="w-7 h-7 rounded-full flex items-center justify-center shrink-0 mt-1"
                  style={{ background: "var(--ember-stone)" }}
                >
                  <Flame size={14} className="text-[var(--ember-flame)]" strokeWidth={1.5} />
                </div>
                <div className="flex-1 min-w-0">
                  <div
                    className="whitespace-pre-wrap"
                    style={{ fontSize: 15, lineHeight: 1.7, color: "var(--ember-text-primary)" }}
                  >
                    {msg.content.split("```").map((part, i) => {
                      if (i % 2 === 1) {
                        const lines = part.split("\n");
                        const lang = lines[0];
                        const code = lines.slice(1).join("\n");
                        return (
                          <div key={i} className="my-3 rounded-lg overflow-hidden" style={{ border: "1px solid var(--ember-cinder)" }}>
                            <div
                              className="flex items-center justify-between px-3 py-1.5"
                              style={{ background: "var(--ember-shadow)", fontSize: 11, color: "var(--ember-text-tertiary)" }}
                            >
                              <span>{lang}</span>
                              <button className="hover:text-[var(--ember-text-primary)] transition-colors">
                                <Copy size={12} strokeWidth={1.5} />
                              </button>
                            </div>
                            <pre
                              className="p-3 overflow-x-auto"
                              style={{ background: "var(--ember-void)", fontSize: 14, lineHeight: 1.6, color: "var(--ember-text-primary)" }}
                            >
                              <code>{code}</code>
                            </pre>
                          </div>
                        );
                      }
                      // Simple markdown-like bold
                      return (
                        <span key={i}>
                          {part.split("**").map((segment, j) =>
                            j % 2 === 1
                              ? <strong key={j} style={{ fontWeight: 600, color: "var(--ember-text-primary)" }}>{segment}</strong>
                              : <span key={j}>{segment}</span>
                          )}
                        </span>
                      );
                    })}
                  </div>
                  {/* Actions */}
                  <div className="flex items-center gap-1 mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="flex items-center gap-0.5 rounded-full px-1.5 py-1" style={{ background: "var(--ember-shadow)" }}>
                      {[ThumbsUp, ThumbsDown, Copy, RefreshCcw, MoreHorizontal].map((Icon, i) => (
                        <button key={i} className="w-6 h-6 flex items-center justify-center rounded hover:bg-[var(--ember-ash)] transition-colors">
                          <Icon size={14} className="text-[var(--ember-text-tertiary)] hover:text-[var(--ember-text-primary)]" strokeWidth={1.5} />
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )
          ))}
        </div>
      </div>
      <MessageInput onSend={handleSend} />
    </div>
  );
}
