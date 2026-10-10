import {
  Code,
  CommandBlock,
  DsPageHeader,
  DsSection,
  Meta,
  Note,
  PageFootNav,
} from "@/components/ds/kit";
import { commandFor } from "@/lib/ds/registry";
import { findCategory } from "@/lib/ds/nav";

const { group, category } = findCategory("docs", "installation");

export default function InstallationPage() {
  const foundation = commandFor("source-foundation");
  const button = commandFor("button");

  return (
    <>
      <DsPageHeader
        eyebrow={group.title}
        title={category.title}
        blurb={category.blurb}
        contents={category.contents}
      />

      <DsSection id="requirements" title="Requirements">
        <Meta
          items={[
            { k: "Framework", v: "Next.js (App Router) with Tailwind CSS v4." },
            { k: "CLI", v: "The standard shadcn CLI — this repository adds no second CLI." },
            { k: "Registry", v: "This system's items are served under the @elattar and @elattar-blocks namespaces, declared in the consumer's components.json after init." },
          ]}
        />
      </DsSection>

      <DsSection
        id="init"
        title="Initialize"
        description="Standard shadcn init. This step creates components.json and does not touch this system's tokens."
      >
        <CommandBlock command="npx shadcn@latest init" />
      </DsSection>

      <DsSection
        id="foundation"
        title="Install the foundation"
        description="Every other item declares this as a registry dependency, so installing anything else pulls it in automatically. Install it explicitly first if you want to inspect it before adding a component."
      >
        <CommandBlock command={foundation} />
        <p className="type-small mt-4 text-muted-foreground">
          Installs <Code>styles/tokens.css</Code>, <Code>styles/typeset.css</Code>,{" "}
          <Code>styles/motion.css</Code>, <Code>styles/utilities.css</Code>,{" "}
          <Code>app/globals.css</Code>, <Code>lib/utils.ts</Code> and{" "}
          <Code>components/ui/icon.tsx</Code> / <Code>icon-swap.tsx</Code>.
        </p>
      </DsSection>

      <DsSection
        id="first-component"
        title="Add a first component"
        description="Any base item works the same way. registryDependencies resolve the foundation automatically."
      >
        <CommandBlock command={button} />
      </DsSection>

      <Note tone="action" title="One manual step">
        The variable Inter font file cannot be delivered through a registry
        item&apos;s JSON content field (binary content cannot round-trip as a
        JSON string). Copy <Code>public/fonts/inter-variable.woff2</Code> from
        this repository into the consumer manually — documented on the
        foundation item itself. Geist Mono needs no manual step; it ships as
        the{" "}
        <Code>geist</Code> npm package.
      </Note>

      <PageFootNav groupId="docs" slug="installation" />
    </>
  );
}
