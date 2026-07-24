/**
 * Unified AI provider abstraction for DAQS Learn.
 * All provider calls are server-side only (API routes).
 */

import Anthropic from "@anthropic-ai/sdk";
import OpenAI from "openai";
import { GoogleGenerativeAI } from "@google/generative-ai";

// ─── Provider types ─────────────────────────────────────────────────────────

export type AIProvider = "claude" | "openai" | "deepseek" | "gemini" | "groq" | "ollama";

export interface AIModel {
  id: string;
  name: string;
  provider: AIProvider;
  contextWindow: string;
  description: string;
  badge?: string;
}

// ─── Available models catalogue (used on client for the picker UI) ───────────

export const AI_MODELS: AIModel[] = [
  // Claude
  {
    id: "claude-sonnet-4-6",
    name: "Claude Sonnet 4.6",
    provider: "claude",
    contextWindow: "200K",
    description: "Anthropic's fastest intelligence model — excellent at coding & analysis",
    badge: "Default",
  },
  {
    id: "claude-haiku-4-5-20251001",
    name: "Claude Haiku 4.5",
    provider: "claude",
    contextWindow: "200K",
    description: "Fastest Claude model — great for quick explanations",
  },
  {
    id: "claude-opus-4-8",
    name: "Claude Opus 4.8",
    provider: "claude",
    contextWindow: "200K",
    description: "Most powerful Claude — best for complex reasoning",
    badge: "Most capable",
  },
  // OpenAI
  {
    id: "gpt-4o",
    name: "GPT-4o",
    provider: "openai",
    contextWindow: "128K",
    description: "OpenAI's flagship multimodal model",
    badge: "Popular",
  },
  {
    id: "gpt-4o-mini",
    name: "GPT-4o Mini",
    provider: "openai",
    contextWindow: "128K",
    description: "Fast and cost-effective OpenAI model",
  },
  {
    id: "gpt-4-turbo",
    name: "GPT-4 Turbo",
    provider: "openai",
    contextWindow: "128K",
    description: "High-capability GPT-4 with large context",
  },
  // DeepSeek
  {
    id: "deepseek-chat",
    name: "DeepSeek V3",
    provider: "deepseek",
    contextWindow: "64K",
    description: "DeepSeek's most capable chat model — strong at coding",
    badge: "Great for code",
  },
  {
    id: "deepseek-reasoner",
    name: "DeepSeek R1",
    provider: "deepseek",
    contextWindow: "64K",
    description: "DeepSeek's reasoning model — step-by-step thinking",
    badge: "Reasoning",
  },
  // Groq (open-weight models, hosted inference)
  {
    id: "llama-3.3-70b-versatile",
    name: "Llama 3.3 70B",
    provider: "groq",
    contextWindow: "128K",
    description: "Meta's open-weight flagship model — fast, free-tier friendly",
    badge: "Free",
  },
  {
    id: "qwen/qwen3.6-27b",
    name: "Qwen 3.6 27B",
    provider: "groq",
    contextWindow: "128K",
    description: "Open-weight reasoning model — step-by-step thinking",
    badge: "Reasoning",
  },
  {
    id: "llama-3.1-8b-instant",
    name: "Llama 3.1 8B",
    provider: "groq",
    contextWindow: "128K",
    description: "Meta's lightweight open-weight model — very fast responses",
  },
  // Ollama (local dev only — requires `ollama serve` running on your own machine)
  {
    id: "deepseek-r1:latest",
    name: "DeepSeek R1 (local)",
    provider: "ollama",
    contextWindow: "32K",
    description: "Runs on your machine via Ollama — local dev only",
    badge: "Local",
  },
  {
    id: "llama3.2:latest",
    name: "Llama 3.2 (local)",
    provider: "ollama",
    contextWindow: "128K",
    description: "Runs on your machine via Ollama — local dev only",
    badge: "Local",
  },
  {
    id: "mistral:latest",
    name: "Mistral (local)",
    provider: "ollama",
    contextWindow: "32K",
    description: "Runs on your machine via Ollama — local dev only",
    badge: "Local",
  },
  {
    id: "llama2:latest",
    name: "Llama 2 (local)",
    provider: "ollama",
    contextWindow: "4K",
    description: "Runs on your machine via Ollama — local dev only",
    badge: "Local",
  },
  // Gemini
  {
    id: "gemini-2.0-flash",
    name: "Gemini 2.0 Flash",
    provider: "gemini",
    contextWindow: "1M",
    description: "Google's fastest Gemini model with massive context",
    badge: "Fastest",
  },
  {
    id: "gemini-1.5-pro",
    name: "Gemini 1.5 Pro",
    provider: "gemini",
    contextWindow: "2M",
    description: "Google's most capable model — enormous context window",
    badge: "Largest context",
  },
  {
    id: "gemini-1.5-flash",
    name: "Gemini 1.5 Flash",
    provider: "gemini",
    contextWindow: "1M",
    description: "Fast and efficient Gemini model",
  },
];

export const PROVIDER_META: Record<AIProvider, { label: string; icon: string; color: string; bgColor: string; borderColor: string }> = {
  claude:   { label: "Claude",   icon: "🟠", color: "text-orange-400",  bgColor: "bg-orange-500/10",  borderColor: "border-orange-500/30"  },
  openai:   { label: "OpenAI",   icon: "⚫", color: "text-white/80",    bgColor: "bg-white/8",         borderColor: "border-white/20"       },
  deepseek: { label: "DeepSeek", icon: "🔵", color: "text-sky-400",     bgColor: "bg-sky-500/10",     borderColor: "border-sky-500/30"     },
  gemini:   { label: "Gemini",   icon: "🔷", color: "text-blue-400",    bgColor: "bg-blue-500/10",    borderColor: "border-blue-500/30"    },
  groq:     { label: "Groq",     icon: "⚡", color: "text-purple-400",  bgColor: "bg-purple-500/10",  borderColor: "border-purple-500/30"  },
  ollama:   { label: "Ollama",   icon: "🦙", color: "text-emerald-400", bgColor: "bg-emerald-500/10", borderColor: "border-emerald-500/30" },
};

export function getModelsByProvider(provider: AIProvider): AIModel[] {
  return AI_MODELS.filter((m) => m.provider === provider);
}

export function getModel(modelId: string): AIModel | undefined {
  return AI_MODELS.find((m) => m.id === modelId);
}

export const DEFAULT_MODEL_ID = "claude-sonnet-4-6";

// ─── Server-side: streaming chat ─────────────────────────────────────────────
// Returns a ReadableStream of text chunks

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

/** Send a safe error string into the stream instead of crashing the readable stream. */
function streamError(controller: ReadableStreamDefaultController<Uint8Array>, encoder: TextEncoder, err: unknown) {
  const msg = err instanceof Error ? err.message : String(err);
  controller.enqueue(encoder.encode(`\n\n⚠️ **AI provider error:** ${msg}\n\nPlease check your API key or try a different model.`));
  controller.close();
}

/**
 * Reasoning models (e.g. DeepSeek R1) emit their raw chain-of-thought inline
 * as <think>...</think> before the real answer. Strips it from a token
 * stream without ever holding more than a few bytes across chunk
 * boundaries, so a tag split across two chunks still gets caught.
 */
class ThinkTagFilter {
  private inThink = false;
  private buffer = "";
  private static readonly OPEN = "<think>";
  private static readonly CLOSE = "</think>";

  feed(chunk: string): string {
    this.buffer += chunk;
    let out = "";
    for (;;) {
      const tag = this.inThink ? ThinkTagFilter.CLOSE : ThinkTagFilter.OPEN;
      const idx = this.buffer.indexOf(tag);
      if (idx === -1) {
        const keep = Math.min(this.buffer.length, tag.length - 1);
        if (!this.inThink) out += this.buffer.slice(0, this.buffer.length - keep);
        this.buffer = this.buffer.slice(this.buffer.length - keep);
        return out;
      }
      if (!this.inThink) out += this.buffer.slice(0, idx);
      this.buffer = this.buffer.slice(idx + tag.length);
      this.inThink = !this.inThink;
    }
  }

  /** Call once the source stream ends — flushes any trailing non-think text. */
  flush(): string {
    return this.inThink ? "" : this.buffer;
  }
}

/** Groq model ids that emit a <think> reasoning trace by default. */
const GROQ_REASONING_MODEL_IDS = new Set(["qwen/qwen3.6-27b"]);
function isGroqReasoningModel(modelId: string): boolean {
  return GROQ_REASONING_MODEL_IDS.has(modelId);
}

export async function streamChat(
  provider: AIProvider,
  modelId: string,
  systemPrompt: string,
  messages: ChatMessage[]
): Promise<ReadableStream<Uint8Array>> {
  const encoder = new TextEncoder();

  if (provider === "claude") {
    const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
    return new ReadableStream({
      async start(controller) {
        try {
          const stream = await client.messages.stream({
            model: modelId,
            max_tokens: 16000,
            system: systemPrompt,
            messages,
          });
          for await (const chunk of stream) {
            if (chunk.type === "content_block_delta" && chunk.delta.type === "text_delta") {
              controller.enqueue(encoder.encode(chunk.delta.text));
            }
          }
          controller.close();
        } catch (err) {
          streamError(controller, encoder, err);
        }
      },
    });
  }

  if (provider === "openai") {
    const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    return new ReadableStream({
      async start(controller) {
        try {
          const stream = await client.chat.completions.create({
            model: modelId,
            max_tokens: 8192,
            stream: true,
            messages: [
              { role: "system", content: systemPrompt },
              ...messages,
            ],
          });
          for await (const chunk of stream) {
            const text = chunk.choices[0]?.delta?.content;
            if (text) controller.enqueue(encoder.encode(text));
          }
          controller.close();
        } catch (err) {
          streamError(controller, encoder, err);
        }
      },
    });
  }

  if (provider === "deepseek") {
    const client = new OpenAI({
      apiKey: process.env.DEEPSEEK_API_KEY,
      baseURL: "https://api.deepseek.com",
    });
    return new ReadableStream({
      async start(controller) {
        try {
          const stream = await client.chat.completions.create({
            model: modelId,
            max_tokens: 8192,
            stream: true,
            messages: [
              { role: "system", content: systemPrompt },
              ...messages,
            ],
          });
          for await (const chunk of stream) {
            const text = chunk.choices[0]?.delta?.content;
            if (text) controller.enqueue(encoder.encode(text));
          }
          controller.close();
        } catch (err) {
          streamError(controller, encoder, err);
        }
      },
    });
  }

  if (provider === "groq") {
    const client = new OpenAI({
      apiKey: process.env.GROQ_API_KEY,
      baseURL: "https://api.groq.com/openai/v1",
    });
    // Groq's own flag to suppress a reasoning model's <think> trace server-side —
    // no vendor field for it in the SDK's request types, so cast the extra param.
    const extra = isGroqReasoningModel(modelId) ? { reasoning_format: "hidden" } : {};
    return new ReadableStream({
      async start(controller) {
        try {
          const stream = await client.chat.completions.create({
            model: modelId,
            // Groq's rate limiter reserves this whole budget against TPM up front,
            // not just what's actually generated — keep it close to real usage
            // (~600-2500 tokens for a Tutor response) instead of the 8192 other
            // providers use, or every request eats ~3x more quota than it needs.
            max_tokens: 3000,
            stream: true,
            messages: [
              { role: "system", content: systemPrompt },
              ...messages,
            ],
            ...extra,
          } as OpenAI.Chat.ChatCompletionCreateParamsStreaming);
          for await (const chunk of stream) {
            const text = chunk.choices[0]?.delta?.content;
            if (text) controller.enqueue(encoder.encode(text));
          }
          controller.close();
        } catch (err) {
          streamError(controller, encoder, err);
        }
      },
    });
  }

  if (provider === "ollama") {
    const client = new OpenAI({
      apiKey: "ollama", // unused, but required by the SDK constructor
      baseURL: `${process.env.OLLAMA_BASE_URL ?? "http://localhost:11434"}/v1`,
    });
    return new ReadableStream({
      async start(controller) {
        const thinkFilter = new ThinkTagFilter();
        try {
          const stream = await client.chat.completions.create({
            model: modelId,
            max_tokens: 8192,
            stream: true,
            messages: [
              { role: "system", content: systemPrompt },
              ...messages,
            ],
          });
          for await (const chunk of stream) {
            const text = chunk.choices[0]?.delta?.content;
            if (text) {
              const visible = thinkFilter.feed(text);
              if (visible) controller.enqueue(encoder.encode(visible));
            }
          }
          const tail = thinkFilter.flush();
          if (tail) controller.enqueue(encoder.encode(tail));
          controller.close();
        } catch (err) {
          streamError(controller, encoder, err);
        }
      },
    });
  }

  if (provider === "gemini") {
    // Try primary key, fall back to secondary if quota/rate-limit hit
    const geminiKeys = [process.env.GEMINI_API_KEY, process.env.GEMINI_API_KEY_2].filter(Boolean) as string[];

    return new ReadableStream({
      async start(controller) {
        // Build strictly-alternating Gemini history once (shared across retries)
        const priorMessages = messages.slice(0, -1);
        const lastMessage = messages[messages.length - 1];
        const history: { role: "user" | "model"; parts: { text: string }[] }[] = [];
        let expectRole: "user" | "model" = "user";
        for (const m of priorMessages) {
          const geminiRole = m.role === "assistant" ? "model" : "user";
          if (geminiRole === expectRole) {
            history.push({ role: geminiRole, parts: [{ text: m.content }] });
            expectRole = expectRole === "user" ? "model" : "user";
          }
        }

        let lastErr: unknown;
        for (const key of geminiKeys) {
          try {
            const genAI = new GoogleGenerativeAI(key);
            const geminiModel = genAI.getGenerativeModel({ model: modelId, systemInstruction: systemPrompt });
            const chat = geminiModel.startChat({ history });
            const result = await chat.sendMessageStream(lastMessage?.content ?? "");
            for await (const chunk of result.stream) {
              const text = chunk.text();
              if (text) controller.enqueue(encoder.encode(text));
            }
            controller.close();
            return;
          } catch (err) {
            lastErr = err;
            // continue to next key
          }
        }
        streamError(controller, encoder, lastErr);
      },
    });
  }

  throw new Error(`Unsupported provider: ${provider}`);
}

// ─── Server-side: single completion (non-streaming) ──────────────────────────

export async function complete(
  provider: AIProvider,
  modelId: string,
  prompt: string,
  maxTokens = 1024
): Promise<string> {
  if (provider === "claude") {
    const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
    const response = await client.messages.create({
      model: modelId,
      max_tokens: maxTokens,
      messages: [{ role: "user", content: prompt }],
    });
    return (response.content[0] as { text: string }).text;
  }

  if (provider === "openai") {
    const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    const response = await client.chat.completions.create({
      model: modelId,
      max_tokens: maxTokens,
      messages: [{ role: "user", content: prompt }],
    });
    return response.choices[0]?.message?.content ?? "";
  }

  if (provider === "deepseek") {
    const client = new OpenAI({
      apiKey: process.env.DEEPSEEK_API_KEY,
      baseURL: "https://api.deepseek.com",
    });
    const response = await client.chat.completions.create({
      model: modelId,
      max_tokens: maxTokens,
      messages: [{ role: "user", content: prompt }],
    });
    return response.choices[0]?.message?.content ?? "";
  }

  if (provider === "gemini") {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY ?? "");
    const model = genAI.getGenerativeModel({ model: modelId });
    const result = await model.generateContent(prompt);
    return result.response.text();
  }

  if (provider === "groq") {
    const client = new OpenAI({
      apiKey: process.env.GROQ_API_KEY,
      baseURL: "https://api.groq.com/openai/v1",
    });
    const extra = isGroqReasoningModel(modelId) ? { reasoning_format: "hidden" } : {};
    const response = await client.chat.completions.create({
      model: modelId,
      max_tokens: maxTokens,
      messages: [{ role: "user", content: prompt }],
      ...extra,
    } as OpenAI.Chat.ChatCompletionCreateParamsNonStreaming);
    return response.choices[0]?.message?.content ?? "";
  }

  if (provider === "ollama") {
    const client = new OpenAI({
      apiKey: "ollama",
      baseURL: `${process.env.OLLAMA_BASE_URL ?? "http://localhost:11434"}/v1`,
    });
    const response = await client.chat.completions.create({
      model: modelId,
      max_tokens: maxTokens,
      messages: [{ role: "user", content: prompt }],
    });
    const content = response.choices[0]?.message?.content ?? "";
    return content.replace(/<think>[\s\S]*?<\/think>/g, "").trim();
  }

  throw new Error(`Unsupported provider: ${provider}`);
}

// ─── Key validation helpers (server-side) ────────────────────────────────────

export function hasProviderKey(provider: AIProvider): boolean {
  switch (provider) {
    case "claude":   return !!process.env.ANTHROPIC_API_KEY;
    case "openai":   return !!process.env.OPENAI_API_KEY;
    case "deepseek": return !!process.env.DEEPSEEK_API_KEY;
    case "gemini":   return !!(process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY_2);
    case "groq":     return !!process.env.GROQ_API_KEY;
    case "ollama":   return true; // no key needed — connectivity failure surfaces as a normal stream error
  }
}
