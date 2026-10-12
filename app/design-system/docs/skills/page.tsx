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

      <DsSection id="elattar-uiux-design" title="elattar-uiux-design">
        <p className="type-body text-muted-foreground">
          <Code>plugins/elattar-uiux-design/</Code> is a Claude plugin: the
          skill an AI agent follows to design and build UI with this system,
          its own checks, four slash commands and an after-edit hook. Install
          it with <Code>/plugin marketplace add ELATTAR-Ayoub/web-design-system</Code>{" "}
          then <Code>/plugin install elattar-uiux-design@elattar</Code>.
        </p>
      </DsSection>

      <DsSection id="what-it-checks" title="What it checks">
        <Meta
          items={[
            { k: "Design rules", v: "Seven foundations, six secondary rules, content, accessibility and twenty UX rules, each with a check or a screenshot question." },
            { k: "Token layer", v: "No hardcoded colour, type, spacing, radius, motion or shadow; component-owned values only after asking." },
            { k: "Components", v: "Only real variants, sizes and props — flagged after every edit; no hand-made or page-wide overridden controls." },
            { k: "In the browser", v: "Contrast as rendered, keyboard and screen reader, motion continuity, layout shift, navigation reach, runtime errors." },
          ]}
        />
      </DsSection>

      <Note tone="action" title="Where to read it">
        Start at <Code>plugins/elattar-uiux-design/README.md</Code>; the skill
        itself is <Code>skills/elattar-uiux-design/SKILL.md</Code> inside it.
      </Note>

      <PageFootNav groupId="docs" slug="skills" />
    </>
  );
}
