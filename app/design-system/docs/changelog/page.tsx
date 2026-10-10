import { DsPageHeader, DsSection, PageFootNav } from "@/components/ds/kit";
import { findCategory } from "@/lib/ds/nav";

const { group, category } = findCategory("docs", "changelog");

const ENTRIES = [
  {
    date: "2026-10-02",
    title: "The agent family is the AgentWorkspace",
    body: "The old console system is removed; the AgentWorkspace, composed from Vercel AI Elements, is the whole agent family, and the registry ships it as the agent-workspace block. Navigation Menu's caret follows the open item again.",
  },
  {
    date: "2026-09-05",
    title: "Documentation and information architecture",
    body: "Root moved to the design-system landing. Added a Documentation section (Introduction, Installation, Theming, Typeset, CLI, Registry, Skills, Changelog). Typeset now renders from one shared catalog component instead of two duplicated role lists.",
  },
  {
    date: "2026-09-05",
    title: "shadcn-compatible registry",
    body: "76 registry items (1 foundation, 67 UI/hooks, 5 blocks) built and validated against the installed shadcn CLI's own schema. Install commands documented on this site are read from the generated registry, never typed by hand.",
  },
];

export default function ChangelogPage() {
  return (
    <>
      <DsPageHeader
        eyebrow={group.title}
        title={category.title}
        blurb={category.blurb}
        contents={category.contents}
      />

      <DsSection id="v0-2-0" title="0.2.0">
        <div className="divide-y divide-border overflow-hidden rounded-xl border border-border bg-card">
          {ENTRIES.map((entry) => (
            <div key={entry.title} className="px-6 py-5">
              <p className="type-number-sm text-muted-foreground">{entry.date}</p>
              <p className="type-h4 mt-1 text-foreground">{entry.title}</p>
              <p className="type-small mt-2 text-muted-foreground">{entry.body}</p>
            </div>
          ))}
        </div>
      </DsSection>

      <PageFootNav groupId="docs" slug="changelog" />
    </>
  );
}
