"use client";
import { useState, useRef, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { useAuthStore } from "@/store/auth";
import { useLearningProfile } from "@/store/learningProfile";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const STARTERS = [
  "Explain Python list comprehensions with examples",
  "Help me understand how neural networks work",
  "Review my code and suggest improvements",
  "What is the difference between SQL JOIN types?",
  "Explain Big O notation simply",
  "Help me debug a Python error",
];

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      onClick={() => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }}
      className="text-[10px] text-white/40 hover:text-white/70 border border-white/10 rounded px-2 py-0.5 transition-colors"
    >
      {copied ? "Copied!" : "Copy"}
    </button>
  );
}

function MessageBubble({ msg }: { msg: Message }) {
  const isUser = msg.role === "user";

  return (
    <div className={`flex gap-3 ${isUser ? "flex-row-reverse" : "flex-row"}`}>
      {/* Avatar */}
      <div className={`w-7 h-7 rounded-full shrink-0 flex items-center justify-center text-xs font-bold mt-1 ${
        isUser
          ? "bg-sky-500/20 border border-sky-500/30 text-sky-300"
          : "bg-violet-500/20 border border-violet-500/30 text-violet-300"
      }`}>
        {isUser ? "U" : "AI"}
      </div>

      {/* Bubble */}
      <div className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
        isUser
          ? "bg-sky-500/15 border border-sky-500/20 text-white rounded-tr-sm"
          : "bg-white/[0.04] border border-white/10 text-white/90 rounded-tl-sm"
      }`}>
        {isUser ? (
          <p className="whitespace-pre-wrap">{msg.content}</p>
        ) : (
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              code({ node, className, children, ...props }) {
                const isBlock = className?.includes("language-");
                const codeText = String(children).replace(/\n$/, "");
                if (isBlock) {
                  const lang = className?.replace("language-", "") ?? "";
                  return (
                    <div className="my-3 rounded-xl overflow-hidden border border-white/10">
                      <div className="flex items-center justify-between bg-white/5 px-4 py-1.5 border-b border-white/8">
                        <span className="text-[10px] text-white/40 font-mono">{lang}</span>
                        <CopyButton text={codeText} />
                      </div>
                      <pre className="overflow-x-auto p-4 bg-[#0a1628]">
                        <code className="text-xs text-emerald-300 font-mono leading-relaxed">{codeText}</code>
                      </pre>
                    </div>
                  );
                }
                return (
                  <code className="bg-white/10 text-emerald-300 rounded px-1.5 py-0.5 text-xs font-mono" {...props}>
                    {children}
                  </code>
                );
              },
              p: ({ children }) => <p className="mb-3 last:mb-0">{children}</p>,
              ul: ({ children }) => <ul className="list-disc list-inside space-y-1 mb-3 text-white/80">{children}</ul>,
              ol: ({ children }) => <ol className="list-decimal list-inside space-y-1 mb-3 text-white/80">{children}</ol>,
              li: ({ children }) => <li className="text-white/80">{children}</li>,
              strong: ({ children }) => <strong className="text-white font-semibold">{children}</strong>,
              h1: ({ children }) => <h1 className="text-lg font-bold text-white mb-2 mt-4">{children}</h1>,
              h2: ({ children }) => <h2 className="text-base font-bold text-white mb-2 mt-3">{children}</h2>,
              h3: ({ children }) => <h3 className="text-sm font-bold text-white mb-1 mt-3">{children}</h3>,
              blockquote: ({ children }) => (
                <blockquote className="border-l-2 border-sky-500/40 pl-3 my-2 text-white/60 italic">{children}</blockquote>
              ),
            }}
          >
            {msg.content}
          </ReactMarkdown>
        )}
      </div>
    </div>
  );
}

function TypingIndicator() {
  return (
    <div className="flex gap-3">
      <div className="w-7 h-7 rounded-full shrink-0 flex items-center justify-center text-xs font-bold bg-violet-500/20 border border-violet-500/30 text-violet-300">
        AI
      </div>
      <div className="bg-white/[0.04] border border-white/10 rounded-2xl rounded-tl-sm px-4 py-3">
        <div className="flex gap-1.5 items-center h-4">
          <span className="w-1.5 h-1.5 rounded-full bg-white/40 animate-bounce" style={{ animationDelay: "0ms" }} />
          <span className="w-1.5 h-1.5 rounded-full bg-white/40 animate-bounce" style={{ animationDelay: "150ms" }} />
          <span className="w-1.5 h-1.5 rounded-full bg-white/40 animate-bounce" style={{ animationDelay: "300ms" }} />
        </div>
      </div>
    </div>
  );
}

export default function TutorPage() {
  const user = useAuthStore((s) => s.user);
  const recordTutorMessage = useLearningProfile((s) => s.recordTutorMessage);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [streaming, setStreaming] = useState(false);
  const [error, setError] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, streaming]);

  async function sendMessage(content: string) {
    if (!content.trim() || streaming) return;
    setError("");

    const userMsg: Message = { role: "user", content: content.trim() };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    recordTutorMessage(content.trim());
    setInput("");
    setStreaming(true);

    if (textareaRef.current) textareaRef.current.style.height = "auto";

    try {
      const res = await fetch("/api/tutor/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: newMessages.map((m) => ({ role: m.role, content: m.content })),
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error ?? "Request failed");
      }

      const reader = res.body!.getReader();
      const decoder = new TextDecoder();
      let assistantContent = "";

      setMessages((prev) => [...prev, { role: "assistant", content: "" }]);

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        assistantContent += decoder.decode(value, { stream: true });
        setMessages((prev) => {
          const updated = [...prev];
          updated[updated.length - 1] = { role: "assistant", content: assistantContent };
          return updated;
        });
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setMessages((prev) => prev.slice(0, -1));
    } finally {
      setStreaming(false);
    }
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  }

  function handleTextareaChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
    setInput(e.target.value);
    e.target.style.height = "auto";
    e.target.style.height = Math.min(e.target.scrollHeight, 160) + "px";
  }

  const showEmpty = messages.length === 0;

  return (
    <div className="flex flex-col h-screen max-h-screen">
      {/* Header */}
      <div className="flex items-center gap-3 px-6 py-4 border-b border-white/8 bg-[#060d1a] shrink-0">
        <div className="w-9 h-9 rounded-xl bg-violet-500/20 border border-violet-500/30 flex items-center justify-center text-lg">
          🤖
        </div>
        <div>
          <h1 className="text-white font-bold text-base leading-tight">DAQS AI Tutor</h1>
          <p className="text-white/40 text-xs">Powered by Claude · Ask me anything</p>
        </div>
        {messages.length > 0 && (
          <button
            onClick={() => setMessages([])}
            className="ml-auto text-xs text-white/30 hover:text-white/60 border border-white/10 hover:border-white/20 rounded-lg px-3 py-1.5 transition-all"
          >
            New chat
          </button>
        )}
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 md:px-8 py-6 space-y-5">
        {showEmpty ? (
          <div className="flex flex-col items-center justify-center h-full text-center px-4 gap-8">
            <div>
              <div className="w-16 h-16 rounded-2xl bg-violet-500/15 border border-violet-500/25 flex items-center justify-center text-3xl mx-auto mb-4">
                🤖
              </div>
              <h2 className="text-xl font-bold text-white mb-2">Hi {user?.full_name?.split(" ")[0]}, I'm your AI Tutor</h2>
              <p className="text-white/45 text-sm max-w-md">
                I can help you with programming, data science, maths, science, and more.
                Ask me anything — I'm here to help you learn and grow.
              </p>
            </div>

            <div className="w-full max-w-xl">
              <p className="text-white/30 text-xs uppercase tracking-wider mb-3">Try asking</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {STARTERS.map((s) => (
                  <button
                    key={s}
                    onClick={() => sendMessage(s)}
                    className="text-left text-sm text-white/60 hover:text-white bg-white/[0.03] hover:bg-white/[0.07] border border-white/8 hover:border-white/15 rounded-xl px-4 py-3 transition-all"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <>
            {messages.map((msg, i) => (
              <MessageBubble key={i} msg={msg} />
            ))}
            {streaming && messages[messages.length - 1]?.role !== "assistant" && (
              <TypingIndicator />
            )}
            {error && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm rounded-xl px-4 py-3">
                {error}
              </div>
            )}
          </>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="shrink-0 px-4 md:px-8 py-4 border-t border-white/8 bg-[#060d1a]">
        <div className="max-w-3xl mx-auto">
          <div className="flex gap-3 items-end bg-white/[0.04] border border-white/12 hover:border-white/20 focus-within:border-sky-500/40 rounded-2xl px-4 py-3 transition-all">
            <textarea
              ref={textareaRef}
              value={input}
              onChange={handleTextareaChange}
              onKeyDown={handleKeyDown}
              placeholder="Ask your tutor anything… (Enter to send, Shift+Enter for new line)"
              disabled={streaming}
              rows={1}
              className="flex-1 bg-transparent text-white placeholder-white/25 text-sm resize-none focus:outline-none leading-relaxed min-h-[24px] max-h-40"
            />
            <button
              onClick={() => sendMessage(input)}
              disabled={!input.trim() || streaming}
              className="w-8 h-8 rounded-xl bg-sky-500 hover:bg-sky-400 disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center transition-all shrink-0"
            >
              <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.269 20.876L5.999 12zm0 0h7.5" />
              </svg>
            </button>
          </div>
          <p className="text-center text-white/20 text-[10px] mt-2">
            Powered by Claude · For learning and education only
          </p>
        </div>
      </div>
    </div>
  );
}
