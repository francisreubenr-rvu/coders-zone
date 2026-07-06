// Provider-agnostic text generation for the Solver and explanations.
// Picks whichever free/paid key is configured, so users can run the AI features
// for free via Google Gemini (no credit card), via Anthropic Claude, or fully
// offline against a local Ollama model (no key, no network call at all).
import Anthropic from "@anthropic-ai/sdk";

export type Provider = "local" | "gemini" | "anthropic" | null;

const OLLAMA_URL = process.env.OLLAMA_URL || "http://localhost:11434";

/** Which AI provider is available, in preference order (explicit local choice first, then free, then paid). */
export function aiProvider(): Provider {
  if (process.env.LOCAL_MODEL) return "local";
  if (process.env.GEMINI_API_KEY) return "gemini";
  if (process.env.ANTHROPIC_API_KEY) return "anthropic";
  return null;
}

export function aiConfigured(): boolean {
  return aiProvider() !== null;
}

/** Generate plain text from a prompt using the configured provider. */
export async function generateText(prompt: string, maxTokens = 2000): Promise<string> {
  const provider = aiProvider();
  if (provider === "local") return local(prompt, maxTokens);
  if (provider === "gemini") return gemini(prompt, maxTokens);
  if (provider === "anthropic") return anthropic(prompt, maxTokens);
  throw new Error("No AI provider configured");
}

/** Ollama's native /api/chat endpoint — defaults to Phi-4-mini, a small model that runs comfortably on a laptop. */
async function local(prompt: string, maxTokens: number): Promise<string> {
  const model = process.env.LOCAL_MODEL || "phi4-mini";
  const res = await fetch(`${OLLAMA_URL}/api/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model,
      messages: [{ role: "user", content: prompt }],
      stream: false,
      options: { num_predict: maxTokens, temperature: 0.3 },
    }),
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`Local model error ${res.status}: ${(await res.text()).slice(0, 200)}`);
  const data = await res.json();
  const text = data?.message?.content ?? "";
  if (!text) throw new Error("Local model returned no text");
  return text as string;
}

async function gemini(prompt: string, maxTokens: number): Promise<string> {
  const model = process.env.GEMINI_MODEL || "gemini-2.0-flash";
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${process.env.GEMINI_API_KEY}`;
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: { maxOutputTokens: maxTokens, temperature: 0.3 },
    }),
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`Gemini error ${res.status}: ${(await res.text()).slice(0, 200)}`);
  const data = await res.json();
  const text = data?.candidates?.[0]?.content?.parts?.map((p: { text?: string }) => p.text || "").join("") ?? "";
  if (!text) throw new Error("Gemini returned no text");
  return text as string;
}

async function anthropic(prompt: string, maxTokens: number): Promise<string> {
  const client = new Anthropic();
  const model = process.env.ANTHROPIC_MODEL || "claude-opus-4-8";
  const msg = await client.messages.create({
    model,
    max_tokens: maxTokens,
    messages: [{ role: "user", content: prompt }],
  });
  return msg.content
    .filter((b): b is Anthropic.TextBlock => b.type === "text")
    .map((b) => b.text)
    .join("");
}

/** Strip markdown code fences and parse a JSON object from an AI reply. */
export function parseJsonReply(text: string): Record<string, unknown> | null {
  const cleaned = text.trim().replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/, "");
  try {
    return JSON.parse(cleaned);
  } catch {
    // Try to find the first {...} block.
    const m = cleaned.match(/\{[\s\S]*\}/);
    if (m) {
      try { return JSON.parse(m[0]); } catch { return null; }
    }
    return null;
  }
}
