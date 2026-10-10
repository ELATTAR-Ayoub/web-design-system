/**
 * Authored documentation page for `navigation-menu`.
 *
 * Replaces the generated baseline. Migrated from the old `base/navigation`
 * category page (`app/design-system/components/base/navigation/page.tsx`, since deleted).
 * Every specimen renders the real `NavigationMenu` composition from
 * `components/ui/navigation-menu.tsx` — nothing here is a styled div.
 *
 * Reach for it when a top-bar item needs more than a link — a set of
 * destinations with descriptions. A plain top-nav row (Button + Avatar + a
 * blue active rule, not a registry item) is still right when every item is a
 * single destination.
 */

import { Flame, Gavel, Layers, TrendingUp } from "lucide-react";

import { SourceMeta } from "@/components/docs/component-page/sections";
import type { ComponentDocSpec } from "@/components/docs/component-page/types";
import { Code, Meta, Panel } from "@/components/ds/kit";

import { Icon } from "@/components/ui/icon";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuIndicator,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";

import { meta } from "./meta";

const PACK_LINKS = [
  { title: "Eclipse Vault", blurb: "Sealed series with a published rarity table." },
  { title: "Origin Pulse", blurb: "The first print run, capped at 5,000 packs." },
  { title: "Nightfall", blurb: "Graded pulls only. Every card ships slabbed." },
  { title: "Draft Bundle", blurb: "Six packs at a set price, opened together." },
];

const MARKET_LINKS = [
  { title: "Browse all", icon: Layers, active: true },
  { title: "Trending", icon: TrendingUp, active: false },
  { title: "Ending soon", icon: Gavel, active: false },
  { title: "Hot right now", icon: Flame, active: false },
];

export const spec: ComponentDocSpec = {
  name: "navigation-menu",
  sections: [
    {
      kind: "showcase",
      id: "preview",
      title: "Preview",
      description:
        "With a viewport — one shared panel that resizes between triggers, and a caret that slides beneath whichever trigger is open. Open Packs, then Marketplace, and watch it travel. This is the default.",
      render: (
        <Panel label="With a viewport" flush>
          <div className="flex min-h-64 items-start justify-center px-5 pt-5 pb-40">
            <NavigationMenu>
              <NavigationMenuList>
                <NavigationMenuItem>
                  <NavigationMenuTrigger>Packs</NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="grid w-full gap-1 md:w-140 md:grid-cols-2">
                      {PACK_LINKS.map((l) => (
                        <li key={l.title}>
                          <NavigationMenuLink asChild>
                            <a href="#preview" className="flex-col items-start">
                              <span className="type-nav text-foreground">{l.title}</span>
                              <span className="type-small text-muted-foreground">{l.blurb}</span>
                            </a>
                          </NavigationMenuLink>
                        </li>
                      ))}
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>

                <NavigationMenuItem>
                  <NavigationMenuTrigger>Marketplace</NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="grid w-full gap-1 md:w-80">
                      {MARKET_LINKS.map((l) => (
                        <li key={l.title}>
                          <NavigationMenuLink asChild active={l.active}>
                            <a href="#preview">
                              <Icon icon={l.icon} size="sm" tone="subtle" />
                              {l.title}
                            </a>
                          </NavigationMenuLink>
                        </li>
                      ))}
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>

                <NavigationMenuItem>
                  <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
                    <a href="#preview">Leaderboard</a>
                  </NavigationMenuLink>
                </NavigationMenuItem>
                <NavigationMenuIndicator />
              </NavigationMenuList>
            </NavigationMenu>
          </div>
        </Panel>
      ),
      source: `<NavigationMenu>
  <NavigationMenuList>
    <NavigationMenuItem>
      <NavigationMenuTrigger>Packs</NavigationMenuTrigger>
      <NavigationMenuContent>
        <ul className="grid gap-1 md:grid-cols-2">
          <li>
            <NavigationMenuLink asChild>
              <a href="/packs/eclipse-vault">Eclipse Vault</a>
            </NavigationMenuLink>
          </li>
        </ul>
      </NavigationMenuContent>
    </NavigationMenuItem>
    <NavigationMenuItem>
      <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
        <a href="/leaderboard">Leaderboard</a>
      </NavigationMenuLink>
    </NavigationMenuItem>
    <NavigationMenuIndicator />
  </NavigationMenuList>
</NavigationMenu>`,
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
      description: "The minimal import and call.",
      language: "tsx",
      code: `import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";

export function TopNav() {
  return (
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuTrigger>Packs</NavigationMenuTrigger>
          <NavigationMenuContent>
            <NavigationMenuLink href="/packs/eclipse-vault">
              Eclipse Vault
            </NavigationMenuLink>
          </NavigationMenuContent>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
}`,
    },
    {
      kind: "showcase",
      id: "variants",
      title: "Variants",
      description:
        "Without a viewport, each item owns its own panel instead of sharing one resizing surface — right when the panels are very different sizes. The indicator is the caret naming the open trigger, and it is not an active-page marker; that stays aria-current plus a blue rule per RULES §3.",
      label: "viewport={false}, and the indicator",
      render: (
        <div className="space-y-6">
          <Panel label="Without a viewport — each item owns its panel" note="viewport={false}" flush>
            <div className="flex min-h-56 items-start justify-center px-5 pt-5 pb-32">
              <NavigationMenu viewport={false}>
                <NavigationMenuList>
                  <NavigationMenuItem>
                    <NavigationMenuTrigger>Stash</NavigationMenuTrigger>
                    <NavigationMenuContent>
                      <ul className="grid w-full gap-1 md:w-72">
                        {MARKET_LINKS.slice(0, 3).map((l) => (
                          <li key={l.title}>
                            <NavigationMenuLink asChild>
                              <a href="#variants">
                                <Icon icon={l.icon} size="sm" tone="subtle" />
                                {l.title}
                              </a>
                            </NavigationMenuLink>
                          </li>
                        ))}
                      </ul>
                    </NavigationMenuContent>
                  </NavigationMenuItem>
                </NavigationMenuList>
              </NavigationMenu>
            </div>
          </Panel>

          <Panel label="Indicator — the caret that names the open trigger" flush>
            <div className="flex min-h-56 items-start justify-center px-5 pt-5 pb-32">
              <NavigationMenu>
                <NavigationMenuList>
                  {["Packs", "Marketplace"].map((t) => (
                    <NavigationMenuItem key={t}>
                      <NavigationMenuTrigger>{t}</NavigationMenuTrigger>
                      <NavigationMenuContent>
                        <ul className="grid w-full gap-1 md:w-72">
                          {["Balance", "Transactions", "Withdraw"].map((l) => (
                            <li key={l}>
                              <NavigationMenuLink asChild>
                                <a href="#variants">{l}</a>
                              </NavigationMenuLink>
                            </li>
                          ))}
                        </ul>
                      </NavigationMenuContent>
                    </NavigationMenuItem>
                  ))}
                  <NavigationMenuIndicator />
                </NavigationMenuList>
              </NavigationMenu>
            </div>
          </Panel>
        </div>
      ),
      source: `<NavigationMenu viewport={false}>{/* each item's panel carries its own popover surface */}</NavigationMenu>

<NavigationMenu>
  <NavigationMenuList>
    {/* items */}
    <NavigationMenuIndicator />
  </NavigationMenuList>
</NavigationMenu>`,
    },
    {
      kind: "disclosure",
      id: "api",
      title: "API Reference",
      blocks: [
        {
          label: "NavigationMenu",
          body: (
            <Meta
              items={[
                {
                  k: "viewport",
                  v: "boolean. Default: true — one shared panel that resizes between triggers. false gives each item its own panel, which is right when the panels are very different sizes.",
                },
                { k: "...props", v: "Every Radix NavigationMenuPrimitive.Root prop, forwarded directly." },
              ]}
            />
          ),
        },
        {
          label: "NavigationMenuLink",
          body: (
            <Meta
              items={[
                {
                  k: "active",
                  v: 'boolean. Marks the current destination. Radix writes data-active="" (an empty string, not the literal "true"), so style it with the data-active: Tailwind variant — data-[active=true] matches nothing.',
                },
                { k: "asChild", v: "boolean. Renders the single child via Radix Slot — the usual way to pair it with next/link's Link or a plain <a>." },
              ]}
            />
          ),
        },
        {
          label: "navigationMenuTriggerStyle()",
          body: (
            <p className="type-small text-muted-foreground">
              The 40px pill class-variance-authority function, for a{" "}
              <Code>NavigationMenuLink</Code> that is a plain link rather than a trigger with
              a panel — pass it to the link&rsquo;s <Code>className</Code> so both sit level in the
              row (see Leaderboard in the Preview above).
            </p>
          ),
        },
        {
          label: "NavigationMenuIndicator",
          body: (
            <p className="type-small text-muted-foreground">
              The caret pointing at the open trigger. Optional, and it is{" "}
              <strong>not</strong> an active-page marker — RULES §3 reserves that role for{" "}
              <Code>aria-current</Code> plus a blue rule, since navigation items never glow.
            </p>
          ),
        },
      ],
    },
    {
      kind: "disclosure",
      id: "accessibility",
      title: "Accessibility",
      description: "Built directly on Radix NavigationMenuPrimitive.",
      blocks: [
        {
          body: (
            <Meta
              items={[
                { k: "Trigger", v: "aria-expanded reflects the panel's open state." },
                { k: "Active destination", v: 'NavigationMenuLink active sets data-active="" — read with the data-active: variant, not data-[active=true].' },
                { k: "aria-current on the actual current page", v: 'The trigger/link pattern here marks a destination as active within the panel; the top-nav pattern this composes into still needs aria-current="page" set by hand on whichever item is the current page — the blue underline alone is not announced.' },
              ]}
            />
          ),
        },
      ],
    },
    {
      kind: "disclosure",
      id: "keyboard",
      title: "Keyboard",
      description: "NavigationMenu has its own keyboard model, distinct from the roving-tabindex menus.",
      blocks: [
        {
          body: (
            <Meta
              items={[
                { k: "← / →", v: "Moves focus between top-level triggers." },
                { k: "Enter / Space", v: "Opens the focused trigger's panel." },
                { k: "↓", v: "Opens the focused trigger's panel and moves focus into it." },
                { k: "Tab", v: "Walks the links inside an open panel in document order." },
                { k: "Esc", v: "Closes the open panel and returns focus to its trigger." },
              ]}
            />
          ),
        },
      ],
    },
    {
      kind: "disclosure",
      id: "responsive",
      title: "Responsive",
      description:
        "The viewport that hosts a shared panel has a hard width stop, and re-centres itself at narrow widths.",
      blocks: [
        {
          body: (
            <p className="type-small text-muted-foreground">
              The shared viewport is sized by its content, so a panel whose grid names a
              fixed width can overflow a narrow screen — <Code>max-w-[calc(100vw-2rem)]</Code>{" "}
              is the hard stop that prevents it, and the call site&rsquo;s own grid (
              <Code>md:w-140 md:grid-cols-2</Code> in the Preview above) is responsive on top
              of that so there is nothing left to clip. Below <Code>lg</Code> the viewport
              wrapper spans the screen and centres on it rather than on the (often narrower,
              off-centre) menu row — without that, a capped panel centred on its row could
              still start off-screen. The <Code>viewport={false}</Code> branch — each item&rsquo;s
              own panel — carries the identical cap, since it has no shared viewport to
              inherit it from.
            </p>
          ),
        },
      ],
    },
    {
      kind: "disclosure",
      id: "source",
      title: "Source",
      blocks: [{ body: <SourceMeta sourcePath={meta.sourcePath} exports={meta.exports} /> }],
    },
  ],
};
