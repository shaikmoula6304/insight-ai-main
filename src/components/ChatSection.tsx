import { useState, useRef, useEffect, useCallback, FormEvent } from "react";
import { motion } from "framer-motion";
import { Send, Loader2 } from "lucide-react";
import { ChatMessage } from "@/types";
import MessageBubble from "./MessageBubble";
import TypingIndicator from "./TypingIndicator";
import ResumePanel from "./ResumePanel";

// ── Backend URL — reads from frontend .env ───────────────────
// Make sure frontend .env has:  VITE_BACKEND_URL=http://localhost:3001
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
const CHAT_URL = `${BACKEND_URL}/functions/v1/chat`;

// ── Debug: logs URL on app load so you can verify in console ─
console.log("[Chat] Backend URL:", CHAT_URL);
console.log("[Chat] Secret key set:", !!import.meta.env.VITE_API_SECRET_KEY);

const ChatSection = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null); // ← shows error in UI
  const scrollRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = useCallback(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading, scrollToBottom]);

  const sendMessage = async (content: string) => {
    if (!content.trim() || loading) return;

    setError(null); // clear previous error

    const userMsg: ChatMessage = {
      id: crypto.randomUUID(),
      role: "user",
      content: content.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    const apiMessages = [...messages, userMsg].map((m) => ({
      role: m.role,
      content: m.content,
    }));

    let assistantSoFar = "";

    const upsertAssistant = (nextChunk: string) => {
      assistantSoFar += nextChunk;
      const content = assistantSoFar;
      setMessages((prev) => {
        const last = prev[prev.length - 1];
        if (last?.role === "assistant") {
          return prev.map((m, i) =>
            i === prev.length - 1 ? { ...m, content } : m
          );
        }
        return [
          ...prev,
          {
            id: crypto.randomUUID(),
            role: "assistant" as const,
            content,
            timestamp: new Date(),
          },
        ];
      });
    };

    try {
      // ── Sanity check: warn if env vars missing ─────────────
      if (!BACKEND_URL) {
        throw new Error("VITE_BACKEND_URL is not set in your frontend .env file");
      }
      if (!import.meta.env.VITE_API_SECRET_KEY) {
        throw new Error("VITE_API_SECRET_KEY is not set in your frontend .env file");
      }

      console.log("[Chat] Sending to:", CHAT_URL);

      const resp = await fetch(CHAT_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${import.meta.env.VITE_API_SECRET_KEY}`,
        },
        body: JSON.stringify({ messages: apiMessages }),
      });

      // ── Log exact status so we can debug ──────────────────
      console.log("[Chat] Response status:", resp.status, resp.statusText);

      if (!resp.ok) {
        // Read the error body to show exact reason
        const errText = await resp.text().catch(() => "");
        let errMessage = `Server returned ${resp.status}`;
        try {
          const errJson = JSON.parse(errText);
          errMessage = errJson.error || errMessage;
        } catch {
          if (errText) errMessage = errText;
        }
        console.error("[Chat] Error response body:", errText);
        throw new Error(errMessage);
      }

      if (!resp.body) {
        throw new Error("Response body is null — streaming not supported");
      }

      // ── Stream reading ─────────────────────────────────────
      const reader = resp.body.getReader();
      const decoder = new TextDecoder();
      let textBuffer = "";
      let streamDone = false;

      while (!streamDone) {
        const { done, value } = await reader.read();
        if (done) break;
        textBuffer += decoder.decode(value, { stream: true });

        let newlineIndex: number;
        while ((newlineIndex = textBuffer.indexOf("\n")) !== -1) {
          let line = textBuffer.slice(0, newlineIndex);
          textBuffer = textBuffer.slice(newlineIndex + 1);

          if (line.endsWith("\r")) line = line.slice(0, -1);
          if (line.startsWith(":") || line.trim() === "") continue;
          if (!line.startsWith("data: ")) continue;

          const jsonStr = line.slice(6).trim();
          if (jsonStr === "[DONE]") {
            streamDone = true;
            break;
          }

          try {
            const parsed = JSON.parse(jsonStr);
            // ── Handle OpenRouter error inside stream ────────
            if (parsed.error) {
              console.error("[Chat] Stream error from OpenRouter:", parsed.error);
              throw new Error(parsed.error.message || "OpenRouter error");
            }
            const c = parsed.choices?.[0]?.delta?.content as string | undefined;
            if (c) upsertAssistant(c);
          } catch (parseErr) {
            // If it's our thrown error, re-throw it
            if (parseErr instanceof Error && parseErr.message !== "Unexpected token") {
              throw parseErr;
            }
            textBuffer = line + "\n" + textBuffer;
            break;
          }
        }
      }

      // ── Flush remaining buffer ─────────────────────────────
      if (textBuffer.trim()) {
        for (let raw of textBuffer.split("\n")) {
          if (!raw) continue;
          if (raw.endsWith("\r")) raw = raw.slice(0, -1);
          if (raw.startsWith(":") || raw.trim() === "") continue;
          if (!raw.startsWith("data: ")) continue;
          const jsonStr = raw.slice(6).trim();
          if (jsonStr === "[DONE]") continue;
          try {
            const parsed = JSON.parse(jsonStr);
            const c = parsed.choices?.[0]?.delta?.content as string | undefined;
            if (c) upsertAssistant(c);
          } catch {
            /* ignore */
          }
        }
      }
    } catch (e) {
      const errMsg = e instanceof Error ? e.message : "Unknown error";
      console.error("[Chat] Error:", errMsg);
      setError(errMsg); // ← shows exact error in UI

      const errorMsg: ChatMessage = {
        id: crypto.randomUUID(),
        role: "assistant",
        content: `❌ Error: ${errMsg}. Please check the browser console for details.`,
        timestamp: new Date(),
      };
      setMessages((prev) => {
        const last = prev[prev.length - 1];
        if (last?.role === "assistant") return prev;
        return [...prev, errorMsg];
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    sendMessage(input);
  };

  return (
    <section id="chat" className="py-24 relative">
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-[600px] h-[600px] rounded-full gradient-bg opacity-[0.04] blur-3xl" />
      </div>

      <div className="container mx-auto px-6 relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            AI <span className="gradient-text">Resume Chat</span>
          </h2>
          <p className="text-muted-foreground max-w-lg mx-auto">
            Ask anything about my experience, skills, or projects. Powered by AI.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-[1fr_340px] gap-6 max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="glass-card glow flex flex-col"
            style={{ minHeight: "500px" }}
          >
            {/* ── Error banner ── */}
            {error && (
              <div className="mx-4 mt-4 px-4 py-2 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-xs">
                ⚠️ {error}
              </div>
            )}

            <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-4">
              {messages.length === 0 && (
                <div className="h-full flex items-center justify-center">
                  <p className="text-muted-foreground text-sm">
                    Ask anything about my experience.
                  </p>
                </div>
              )}
              {messages.map((msg) => (
                <MessageBubble key={msg.id} message={msg} />
              ))}
              {loading && <TypingIndicator />}
            </div>

            <form onSubmit={handleSubmit} className="p-4 border-t border-border">
              <div className="flex items-center gap-3">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask about my experience..."
                  disabled={loading}
                  aria-label="Chat message input"
                  className="flex-1 bg-secondary rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground border border-border focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-50 transition-all"
                />
                <button
                  type="submit"
                  disabled={!input.trim() || loading}
                  aria-label="Send message"
                  className="p-3 rounded-xl gradient-bg text-primary-foreground disabled:opacity-40 hover:opacity-90 transition-opacity"
                >
                  {loading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Send className="w-4 h-4" />
                  )}
                </button>
              </div>
            </form>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="hidden lg:block"
          >
            <ResumePanel onPromptClick={(p) => sendMessage(p)} />
          </motion.div>

          <details className="lg:hidden">
            <summary className="text-sm font-medium text-muted-foreground cursor-pointer hover:text-foreground transition-colors mb-3">
              Resume Intelligence Panel
            </summary>
            <ResumePanel onPromptClick={(p) => sendMessage(p)} />
          </details>
        </div>
      </div>
    </section>
  );
};

export default ChatSection;