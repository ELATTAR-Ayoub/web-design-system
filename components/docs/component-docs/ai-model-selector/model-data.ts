/**
 * The models the ai-model-selector specimens list. A plain module, not the
 * "use client" specimen file, because page.tsx (a server module) reads it too —
 * a client module's non-component export reaches a server module as a
 * reference, not as the array.
 */
export const MODELS = [
  { id: "sonnet", name: "Sonnet", provider: "Anthropic", note: "Balanced" },
  { id: "haiku", name: "Haiku", provider: "Anthropic", note: "Fastest" },
  { id: "opus", name: "Opus", provider: "Anthropic", note: "Deepest" },
  { id: "gpt-mini", name: "GPT Mini", provider: "OpenAI", note: "Fast" },
  { id: "gpt-pro", name: "GPT Pro", provider: "OpenAI", note: "Deep" },
  { id: "flash", name: "Gemini Flash", provider: "Google", note: "Fast" },
];
