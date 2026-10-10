import { PackageOpen, Search } from "lucide-react";

import { SourceMeta } from "@/components/docs/component-page/sections";
import type { ComponentDocSpec } from "@/components/docs/component-page/types";

import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { Meta, Note, Panel, Row } from "@/components/ds/kit";

import { meta } from "./meta";

export const spec: ComponentDocSpec = {
  name: "empty",
  omitted: {
    keyboard: "Empty itself holds no focusable element and defines no keyboard behaviour — any affordance it composes (a Button in EmptyContent) has its own keyboard behaviour, documented on that component's own page.",
    responsive: "Empty is a flex column at every breakpoint, constrained only by EmptyHeader's and EmptyContent's max-w-sm — there is no breakpoint-specific rule in empty.tsx to document separately from that fixed constraint, and nothing here reflows, scrolls or mirrors differently across widths.",
  },
  sections: [
    {
      kind: "showcase",
      id: "preview",
      title: "Preview",
      description:
        "An empty state must explain why it is empty and give one clear way out. A blank panel with 'No results' is an unfinished screen.",
      render: (
        <Row className="w-full">
          <Empty className="w-full">
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <Icon icon={PackageOpen} size="xl" tone="action" />
              </EmptyMedia>
              <EmptyTitle>Your Stash is empty</EmptyTitle>
              <EmptyDescription>
                Cards land here the moment a pack finishes opening. Open your
                first pack to start a collection.
              </EmptyDescription>
            </EmptyHeader>
            <EmptyContent>
              <Button>Browse Packs</Button>
            </EmptyContent>
          </Empty>
        </Row>
      ),
      source: `<Empty>
  <EmptyHeader>
    <EmptyMedia variant="icon">
      <Icon icon={PackageOpen} size="xl" tone="action" />
    </EmptyMedia>
    <EmptyTitle>Your Stash is empty</EmptyTitle>
    <EmptyDescription>
      Cards land here the moment a pack finishes opening. Open your first pack to start a collection.
    </EmptyDescription>
  </EmptyHeader>
  <EmptyContent>
    <Button>Browse Packs</Button>
  </EmptyContent>
</Empty>`,
    },
    {
      kind: "install",
      id: "installation",
      title: "Installation",
    },
    {
      kind: "snippet",
      id: "usage",
      title: "Usage",
      description: "Compose only the parts a given empty state needs.",
      language: "tsx",
      code: `import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { PackageOpen } from "lucide-react";

export function EmptyStash() {
  return (
    <Empty>
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <Icon icon={PackageOpen} size="xl" tone="action" />
        </EmptyMedia>
        <EmptyTitle>Your Stash is empty</EmptyTitle>
        <EmptyDescription>
          Cards land here the moment a pack finishes opening. Open your first
          pack to start a collection.
        </EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <Button>Browse Packs</Button>
      </EmptyContent>
    </Empty>
  );
}`,
    },
    {
      kind: "showcase",
      id: "examples",
      title: "Examples",
      description:
        "Same component, completely different copy and action — the first is empty because the user is new, the second because their filters are too narrow. Brand-specific empty states belong to the product that needs them, not to the chassis.",
      label: "First-time user vs. narrowed filters",
      render: (
        <div className="grid gap-4 lg:grid-cols-2">
          <Panel label="Empty Stash — first-time user">
            <Empty>
              <EmptyHeader>
                <EmptyMedia variant="icon">
                  <Icon icon={PackageOpen} size="xl" tone="action" />
                </EmptyMedia>
                <EmptyTitle>Your Stash is empty</EmptyTitle>
                <EmptyDescription>
                  Cards land here the moment a pack finishes opening. Open
                  your first pack to start a collection.
                </EmptyDescription>
              </EmptyHeader>
              <EmptyContent>
                <Button>Browse Packs</Button>
              </EmptyContent>
            </Empty>
          </Panel>

          <Panel label="No search results — filters too narrow">
            <Empty>
              <EmptyHeader>
                <EmptyMedia variant="icon">
                  <Icon icon={Search} size="xl" tone="subtle" />
                </EmptyMedia>
                <EmptyTitle>No packs match those filters</EmptyTitle>
                <EmptyDescription>
                  Nothing between $0 and $10 has a legendary floor. Widening
                  the price range will help.
                </EmptyDescription>
              </EmptyHeader>
              <EmptyContent>
                <Button variant="outline">Reset filters</Button>
              </EmptyContent>
            </Empty>
          </Panel>
        </div>
      ),
      source: `<Empty>
  <EmptyHeader>
    <EmptyMedia variant="icon">
      <Icon icon={Search} size="xl" tone="subtle" />
    </EmptyMedia>
    <EmptyTitle>No packs match those filters</EmptyTitle>
    <EmptyDescription>
      Nothing between $0 and $10 has a legendary floor. Widening the price range will help.
    </EmptyDescription>
  </EmptyHeader>
  <EmptyContent>
    <Button variant="outline">Reset filters</Button>
  </EmptyContent>
</Empty>`,
    },
    {
      kind: "disclosure",
      id: "api",
      title: "API Reference",
      description: "Empty, EmptyHeader, EmptyMedia, EmptyTitle, EmptyDescription, EmptyContent.",
      blocks: [
        {
          label: "Empty",
          body: (
            <p className="type-small text-muted-foreground">
              React.ComponentProps&lt;&quot;div&quot;&gt;. No required props.
              The outer dashed-border frame — flex column, centred content,
              text-balance.
            </p>
          ),
        },
        {
          label: "EmptyHeader",
          body: (
            <p className="type-small text-muted-foreground">
              React.ComponentProps&lt;&quot;div&quot;&gt;. No required props.
              Groups EmptyMedia, EmptyTitle and EmptyDescription with a
              max-w-sm constraint so the copy does not stretch full width.
            </p>
          ),
        },
        {
          label: "EmptyMedia",
          body: (
            <Meta
              items={[
                {
                  k: "variant",
                  v: '"default" · "icon". Default: "default". "icon" adds an 8-unit muted rounded square behind the glyph (matching the Icon size="xl" specimens above); "default" is transparent, for a larger illustration.',
                },
              ]}
            />
          ),
        },
        {
          label: "EmptyTitle / EmptyDescription / EmptyContent",
          body: (
            <Meta
              items={[
                {
                  k: "EmptyTitle",
                  v: "React.ComponentProps<\"div\">. The bold headline naming what's missing.",
                },
                {
                  k: "EmptyDescription",
                  v: "React.ComponentProps<\"p\">. The supporting sentence explaining why it's empty.",
                },
                {
                  k: "EmptyContent",
                  v: "React.ComponentProps<\"div\">. Holds the one primary way forward — typically a single Button.",
                },
              ]}
            />
          ),
        },
      ],
    },
    {
      kind: "disclosure",
      id: "states",
      title: "States",
      description:
        "Empty is not a control and has no async lifecycle of its own — it is the static content a page shows once loading has finished and there is genuinely nothing to display. The interaction and async states below are N/A for that reason.",
      blocks: [
        {
          body: (
            <Meta
              items={[
                { k: "rest / empty", v: "The only state Empty ever renders — there is no other shape for it to take." },
                { k: "hover · focus-visible · pressed · disabled", v: "N/A — Empty itself is not interactive; any affordance it carries (a Button in EmptyContent) has its own states, audited on the Button page." },
                { k: "loading", v: "N/A — Empty is what a screen shows after loading finishes with nothing to show, not a loading indicator itself. Use Skeleton while content is still arriving." },
                { k: "success", v: "N/A — Empty has no completion of its own to signal." },
              ]}
            />
          ),
        },
        {
          body: (
            <Note tone="error" title="An unfinished screen">
              A blank panel with &ldquo;No results&rdquo; and nothing else is
              an unfinished screen, not a valid empty state. Every Empty needs
              a reason (EmptyDescription) and exactly one primary way forward
              (EmptyContent) — never zero, and rarely more than one.
            </Note>
          ),
        },
      ],
    },
    {
      kind: "disclosure",
      id: "accessibility",
      title: "Accessibility",
      description:
        "Empty renders plain, unstyled-for-a11y <div>/<p> markup — it carries no role or live region of its own, because it is static content rather than an async state announcement.",
      blocks: [
        {
          body: (
            <Meta
              items={[
                {
                  k: "Role",
                  v: "None — Empty, EmptyHeader, EmptyMedia and EmptyContent are all plain <div>s; EmptyDescription is a <p>. No ARIA role or live region is set anywhere in empty.tsx.",
                },
                {
                  k: "Announcing the transition into empty",
                  v: "If Empty replaces content that was just loading, pair it with your own aria-busy or live region upstream — Empty itself does not announce that a transition happened, only render the resulting static content.",
                },
                {
                  k: "Accessible name",
                  v: "EmptyTitle's text content names the state to a sighted or screen-reader user alike; there is no separate accessible-name mechanism to configure.",
                },
              ]}
            />
          ),
        },
      ],
    },
    {
      kind: "disclosure",
      id: "source",
      title: "Source",
      blocks: [
        { body: <SourceMeta sourcePath={meta.sourcePath} exports={meta.exports} /> },
      ],
    },
  ],
};
