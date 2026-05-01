"use client";

/**
 * CapitalOS Intelligence page.
 *
 * AI-powered financial analysis chat interface.
 * Uses native fetch + streaming for maximum compatibility.
 */
import { useState, useRef, useEffect, useCallback, type FormEvent } from "react";
import { Brain, Send, Sparkles, User, RefreshCw, Lightbulb } from "lucide-react";
import { CapitalOSHeader } from "@/components/prototypes/capital-os/layout/CapitalOSHeader";

interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
}

const SUGGESTED_PROMPTS = [
  "Analyze my current net worth composition and suggest optimization strategies",
  "What's my financial runway at current burn rate? How can I extend it?",
  "Compare my asset allocation against best practices for someone in my situation",
  "Which of my goals are at risk of not being met on time?",
  "What patterns do you see in my liabilities? How should I prioritize payoff?",
  "Project my net worth in 12 months under conservative assumptions",
];

export default function IntelligencePage() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const sendMessage = useCallback(
    async (userContent: string) => {
      if (!userContent.trim() || isLoading) return;

      const userMsg: ChatMessage = {
        id: `user-${Date.now()}`,
        role: "user",
        content: userContent,
      };

      const updatedMessages = [...messages, userMsg];
      setMessages(updatedMessages);
      setInput("");
      setIsLoading(true);

      const assistantId = `assistant-${Date.now()}`;
      setMessages((prev) => [
        ...prev,
        { id: assistantId, role: "assistant", content: "" },
      ]);

      try {
        const res = await fetch("/api/capital-os/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            messages: updatedMessages.map((m) => ({
              role: m.role,
              content: m.content,
            })),
          }),
        });

        if (!res.ok) {
          const error = await res.text();
          setMessages((prev) =>
            prev.map((m) =>
              m.id === assistantId
                ? { ...m, content: `Error: ${error || res.statusText}` }
                : m,
            ),
          );
          return;
        }

        const reader = res.body?.getReader();
        const decoder = new TextDecoder();
        let content = "";

        if (reader) {
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            content += decoder.decode(value, { stream: true });
            setMessages((prev) =>
              prev.map((m) =>
                m.id === assistantId ? { ...m, content } : m,
              ),
            );
          }
        }
      } catch (err) {
        setMessages((prev) =>
          prev.map((m) =>
            m.id === assistantId
              ? { ...m, content: `Error: ${err instanceof Error ? err.message : "Unknown error"}` }
              : m,
          ),
        );
      } finally {
        setIsLoading(false);
      }
    },
    [messages, isLoading],
  );

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    sendMessage(input);
  };

  return (
    <div className="flex h-screen flex-col">
      <CapitalOSHeader title="Intelligence" subtitle="AI-powered financial analysis and strategic insights" />

      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Message area */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-6 sm:px-6">
          {messages.length === 0 ? (
            <div className="mx-auto flex max-w-2xl flex-col items-center gap-8 pt-12">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl" style={{ background: "var(--cos-accent-muted)", color: "var(--cos-accent)" }}>
                <Brain className="h-8 w-8" />
              </div>
              <div className="text-center">
                <h2 id="intelligence-title" className="mb-2 text-xl font-bold">Capital Intelligence</h2>
                <p className="text-sm" style={{ color: "var(--cos-text-2)" }}>
                  Ask anything about your financial data. I have full context of your accounts, liabilities, and goals.
                </p>
              </div>
              <div className="grid w-full gap-3 sm:grid-cols-2">
                {SUGGESTED_PROMPTS.map((prompt, i) => (
                  <button
                    key={i}
                    id={`suggested-prompt-${i}`}
                    onClick={() => sendMessage(prompt)}
                    className="rounded-xl border p-3 text-left text-xs leading-relaxed transition-all hover:translate-y-[-1px]"
                    style={{ background: "var(--cos-surface)", borderColor: "var(--cos-border-subtle)", color: "var(--cos-text-2)" }}
                  >
                    <Lightbulb className="mb-1.5 h-3.5 w-3.5" style={{ color: "var(--cos-accent)" }} />
                    {prompt}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="mx-auto max-w-3xl space-y-6">
              {messages.map((msg) => (
                <div key={msg.id} id={`msg-${msg.id}`} className={`flex gap-3 ${msg.role === "user" ? "justify-end" : ""}`}>
                  {msg.role === "assistant" && (
                    <div className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg" style={{ background: "var(--cos-accent-muted)", color: "var(--cos-accent)" }}>
                      <Sparkles className="h-4 w-4" />
                    </div>
                  )}
                  <div
                    className="max-w-[85%] rounded-xl px-4 py-3 text-sm leading-relaxed"
                    style={{
                      background: msg.role === "user" ? "var(--cos-accent)" : "var(--cos-surface)",
                      color: msg.role === "user" ? "#fff" : "var(--cos-text)",
                      border: msg.role === "assistant" ? "1px solid var(--cos-border-subtle)" : undefined,
                    }}
                  >
                    {msg.role === "assistant" ? (
                      <div className="prose prose-invert prose-sm max-w-none" style={{ color: "var(--cos-text)" }}>
                        {msg.content.split("\n").map((line: string, i: number) => (
                          <p key={i} className={line === "" ? "h-2" : "mb-1"}>
                            {line.startsWith("- ") ? (
                              <span>
                                <span style={{ color: "var(--cos-accent)" }}>•</span> {line.slice(2)}
                              </span>
                            ) : line.startsWith("**") ? (
                              <strong>{line.replace(/\*\*/g, "")}</strong>
                            ) : (
                              line
                            )}
                          </p>
                        ))}
                      </div>
                    ) : (
                      msg.content
                    )}
                  </div>
                  {msg.role === "user" && (
                    <div className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg" style={{ background: "var(--cos-surface-2)", color: "var(--cos-text-2)" }}>
                      <User className="h-4 w-4" />
                    </div>
                  )}
                </div>
              ))}
              {isLoading && messages[messages.length - 1]?.content === "" && (
                <div className="flex gap-3">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg" style={{ background: "var(--cos-accent-muted)", color: "var(--cos-accent)" }}>
                    <RefreshCw className="h-4 w-4 animate-spin" />
                  </div>
                  <div className="rounded-xl border px-4 py-3 text-sm" style={{ background: "var(--cos-surface)", borderColor: "var(--cos-border-subtle)", color: "var(--cos-text-2)" }}>
                    Analyzing your financial data...
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Input area */}
        <div className="border-t px-4 py-4 sm:px-6" style={{ borderColor: "var(--cos-border-subtle)", background: "var(--cos-surface)" }}>
          <form onSubmit={handleSubmit} className="mx-auto flex max-w-3xl gap-3">
            <input
              id="intelligence-input"
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about your finances..."
              className="flex-1 rounded-xl border px-4 py-3 text-sm outline-none transition-colors focus:border-[var(--cos-accent)]"
              style={{ background: "var(--cos-bg)", borderColor: "var(--cos-border)", color: "var(--cos-text)" }}
              disabled={isLoading}
            />
            <button
              id="intelligence-submit"
              type="submit"
              disabled={isLoading || !input.trim()}
              className="flex h-[46px] w-[46px] shrink-0 items-center justify-center rounded-xl transition-all disabled:opacity-30"
              style={{ background: "var(--cos-accent)", color: "#fff" }}
            >
              <Send className="h-4 w-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
