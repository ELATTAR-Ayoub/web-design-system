import { Code, DsPageHeader, DsSection, Meta, Note, PageFootNav } from "@/components/ds/kit";
import { findCategory } from "@/lib/ds/nav";

const { group, category } = findCategory("docs", "skills");

export default function SkillsPage() {
  return (
    <>
      <DsPageHeader
        eyebrow={group.title}
        title={category.title}
        blurb={category.blurb}
        contents={category.contents}
      />

      <DsSection id="elattar-building-ui" title="elattar-building-ui">
        <p className="type-body text-muted-foreground">
          <Code>.claude/skills/elattar-building-ui/</Code> is the workflow an
          AI agent follows to build or change UI in this system: read the
          governing files, inventory existing components before adding a new
          one, ask only for decisions that change the result, build on the
          token layer, draw the complete state model, document before
          verifying, then run <Code>npm run verify</Code> and complete the
          checks a green build cannot prove on its own.
        </p>
      </DsSection>

      <DsSection id="what-it-checks" title="What it checks">
        <Meta
          items={[
            { k: "Token layer", v: "No hardcoded colour, size, spacing, radius, duration or shadow outside styles/*.css." },
            { k: "State model", v: "rest · hover · focus-visible · pressed · loading · success · error · disabled · empty, or an explicit N/A with a reason." },
            { k: "Documentation", v: "lib/ds/nav.ts updated, every state on a live specimen, DsPageHeader fed from findCategory()." },
            { k: "Verification", v: "npm run verify, plus both themes, both viewport ends, keyboard, reduced motion and measured contrast — checks scripts cannot perform." },
          ]}
        />
      </DsSection>

      <Note tone="action" title="Where to read it">
        Start at <Code>AGENTS.md</Code>, which routes to the skill. The skill
        itself routes to <Code>RULES.md</Code> and
        <Code> .claude/skills/elattar-building-ui/references/</Code> for the
        component contracts, state inventory and known traps.
      </Note>

      <PageFootNav groupId="docs" slug="skills" />
    </>
  );
}
