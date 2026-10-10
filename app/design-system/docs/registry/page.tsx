import {
  Code,
  CommandBlock,
  DsPageHeader,
  DsSection,
  Meta,
  Note,
  PageFootNav,
} from "@/components/ds/kit";
import { commandFor, readRegistryIndex } from "@/lib/ds/registry";
import { findCategory } from "@/lib/ds/nav";

const { group, category } = findCategory("docs", "registry");

export default function RegistryPage() {
  const index = readRegistryIndex();
  const items = index?.items ?? [];
  const byType = {
    style: items.filter((i) => i.type === "registry:style"),
    ui: items.filter((i) => i.type === "registry:ui"),
    hook: items.filter((i) => i.type === "registry:hook"),
    block: items.filter((i) => i.type === "registry:block"),
  };

  return (
    <>
      <DsPageHeader
        eyebrow={group.title}
        title={category.title}
        blurb={category.blurb}
        contents={category.contents}
      />

      <Note tone="action" title="Source of truth">
        Every command on this page is read at build time from{" "}
        <Code>public/r/commands.json</Code> and{" "}
        <Code>public/r/index.json</Code> — the files{" "}
        <Code>scripts/build-registry.mjs</Code> generates. None are typed by
        hand.
      </Note>

      <Note tone="action" title="Production base URL">
        The host baked into every command above comes from one place:{" "}
        <Code>REGISTRY_URL</Code>, read by{" "}
        <Code>scripts/build-registry.mjs</Code> and defaulting to{" "}
        <Code>http://127.0.0.1:3200/r</Code> for local development. To publish
        for production, set <Code>REGISTRY_URL</Code> to the deployed origin,
        run <Code>npm run registry:build</Code>, and deploy the regenerated{" "}
        <Code>public/r</Code> directory — no code changes required.
      </Note>

      <DsSection id="namespaces" title="Namespaces">
        <Meta
          items={[
            { k: "@elattar", v: "Foundation and UI items. Declared in components.json under registries." },
            { k: "@elattar-blocks", v: "Multi-file blocks. Declared separately because blocks build to a nested blocks/ path." },
          ]}
        />
      </DsSection>

      <DsSection
        id="foundation"
        title="Foundation"
        description={`${byType.style.length} item — the tokens, typeset, motion and utility stylesheets every other item depends on.`}
      >
        <CommandBlock command={commandFor("source-foundation")} />
      </DsSection>

      <DsSection
        id="ui-items"
        title="UI items"
        description={`${byType.ui.length} components, plus ${byType.hook.length} standalone hooks. Every one declares the foundation as a registry dependency, so installing it pulls the foundation in automatically.`}
      >
        <div className="grid gap-2 sm:grid-cols-2">
          {byType.ui.slice(0, 8).map((item) => (
            <div key={item.name} className="rounded-lg border border-border bg-card px-4 py-3">
              <p className="type-small text-foreground">{item.title}</p>
              <Code>{commandFor(item.name)}</Code>
            </div>
          ))}
        </div>
        <p className="type-small mt-3 text-muted-foreground">
          {byType.ui.length} items total. See{" "}
          <Code>public/r/index.json</Code> for the full list, or run{" "}
          <Code>npx shadcn search @elattar</Code>.
        </p>
      </DsSection>

      <DsSection
        id="blocks"
        title="Blocks"
        description={`${byType.block.length} multi-file blocks — a whole console, a whole page shell — not single components.`}
      >
        <div className="grid gap-2 sm:grid-cols-2">
          {byType.block.map((item) => (
            <div key={item.name} className="rounded-lg border border-border bg-card px-4 py-3">
              <p className="type-small text-foreground">{item.title}</p>
              <Code>{commandFor(item.name)}</Code>
            </div>
          ))}
        </div>
      </DsSection>

      <PageFootNav groupId="docs" slug="registry" />
    </>
  );
}
