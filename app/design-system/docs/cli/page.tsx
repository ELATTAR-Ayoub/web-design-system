import Link from "next/link";

import {
  Code,
  CommandBlock,
  DsPageHeader,
  DsSection,
  Meta,
  Note,
  PageFootNav,
} from "@/components/ds/kit";
import { findCategory } from "@/lib/ds/nav";
import { commandFor } from "@/lib/ds/registry";

const { group, category } = findCategory("docs", "cli");

export default function CliPage() {
  const button = commandFor("button");
  const buttonDiff = `${button} --diff`;

  return (
    <>
      <DsPageHeader
        eyebrow={group.title}
        title={category.title}
        blurb={category.blurb}
        contents={category.contents}
      />

      <Note tone="action" title="One CLI">
        This system adds no JavaScript CLI of its own. Every command below is
        the standard <Code>shadcn</Code> CLI pointed at this registry —
        confirmed against <Code>npx shadcn --help</Code>, not written from
        memory.
      </Note>

      <DsSection id="init" title="init">
        <p className="type-small mb-3 text-muted-foreground">
          Creates <Code>components.json</Code> in a consumer project.
        </p>
        <CommandBlock command="npx shadcn@latest init" />
      </DsSection>

      <DsSection id="add" title="add">
        <p className="type-small mb-3 text-muted-foreground">
          Installs one or more registry items. Accepts an item name, a{" "}
          <Code>@registry/item</Code> reference, or a raw URL — see the{" "}
          <Link href="/design-system/docs/registry" className="text-action-ink underline underline-offset-2">
            Registry
          </Link>{" "}
          page for the exact command per item.
        </p>
        <CommandBlock command={button} />
      </DsSection>

      <DsSection id="diff" title="diff">
        <p className="type-small mb-3 text-muted-foreground">
          Deprecated upstream in favour of re-running <Code>add</Code> with{" "}
          <Code>--diff</Code>.
        </p>
        <CommandBlock command={buttonDiff} />
      </DsSection>

      <DsSection id="search" title="search / list">
        <p className="type-small mb-3 text-muted-foreground">
          Lists everything a registry serves.
        </p>
        <CommandBlock command="npx shadcn@latest search @elattar" />
      </DsSection>

      <Meta
        className="mt-6"
        items={[
          {
            k: "Non-interactive flags",
            v: "-y skips prompts, -o overwrites existing files, --dry-run previews without writing.",
          },
        ]}
      />

      <PageFootNav groupId="docs" slug="cli" />
    </>
  );
}
