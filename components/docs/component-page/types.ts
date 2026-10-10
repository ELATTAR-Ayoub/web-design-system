import { orderSections } from "@/lib/ds/docs/section-order";
import type { ReactNode } from "react";

type SectionBase = {
  readonly id: string;
  readonly title: string;
  readonly description?: string;
};

export type ShowcaseSection = SectionBase & {
  readonly kind: "showcase";
  readonly render: ReactNode;
  readonly source?: string;
  readonly label?: string;
  readonly flush?: boolean;
  readonly wide?: boolean;
};

export type EffectSection = SectionBase & {
  readonly kind: "effect";
  readonly render: ReactNode;
  readonly source?: string;
  readonly label?: string;
  readonly appliedAs?: string;
};

export type InstallSection = SectionBase & {
  readonly kind: "install";
  readonly notes?: ReactNode;
};

export type SnippetSection = SectionBase & {
  readonly kind: "snippet";
  readonly code: string;
  readonly language?: "tsx" | "ts" | "css" | "bash" | "json";
};

export type DisclosureBlock = {
  readonly label?: string;
  readonly body: ReactNode;
  readonly anchor?: string;
};

export type DisclosureSection = SectionBase & {
  readonly kind: "disclosure";
  readonly blocks: readonly DisclosureBlock[];
};

export type DocSection =
  | ShowcaseSection
  | EffectSection
  | InstallSection
  | SnippetSection
  | DisclosureSection;

export type ComponentDocSpec = {
  readonly name: string;
  readonly sections: readonly DocSection[];
  readonly omitted?: Readonly<Record<string, string>>;
  readonly wide?: boolean;
};

export type TocEntry = {
  readonly id: string;
  readonly title: string;
  readonly children?: readonly TocEntry[];
};

export function tocFor(spec: ComponentDocSpec): TocEntry[] {
  return orderSections(spec.sections).map((section) => {
    const children =
      section.kind === "disclosure"
        ? section.blocks
            .filter((block) => block.anchor && block.label)
            .map((block) => ({ id: block.anchor!, title: block.label! }))
        : [];
    return children.length
      ? { id: section.id, title: section.title, children }
      : { id: section.id, title: section.title };
  });
}

export function anchorsFor(spec: ComponentDocSpec): string[] {
  return tocFor(spec).flatMap((entry) => [
    entry.id,
    ...(entry.children ?? []).map((child) => child.id),
  ]);
}
