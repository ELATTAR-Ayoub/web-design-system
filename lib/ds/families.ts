import type { DocFamily } from "@/lib/ds/platform-contract";

export const FAMILY_LABEL: Record<DocFamily, string> = {
  components: "Components",
  effects: "Effects",
  agent: "Agent",
  charts: "Charts",
};

export const FAMILY_EYEBROW: Record<DocFamily, string> = {
  components: "COMPONENTS",
  effects: "COMPONENTS / EFFECTS",
  agent: "COMPONENTS / AGENT",
  charts: "COMPONENTS / CHARTS",
};

export const FAMILY_ORDER: readonly DocFamily[] = [
  "components",
  "effects",
  "agent",
  "charts",
];

export const FAMILY_LANDING: Partial<
  Record<DocFamily, { slug: string; title: string; blurb: string }>
> = {
  agent: {
    slug: "agent",
    title: "Agent overview",
    blurb:
      "Why the agent workspace is its own family, the four seams a caller supplies, and the rules that govern a component answering to something outside the product.",
  },
  charts: {
    slug: "charts",
    title: "Charts overview",
    blurb:
      "Every chart family on recharts, drawn with the five chart tokens, and the one place in this system where motion is resolved from tokens at runtime rather than applied as a class.",
  },
};
