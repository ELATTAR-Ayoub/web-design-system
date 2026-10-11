import { SourceMeta } from "@/components/docs/component-page/sections";
import type { ComponentDocSpec } from "@/components/docs/component-page/types";
import { Code, Meta, Panel } from "@/components/ds/kit";

import { MenubarShowcase } from "./menubar-showcase";
import { meta } from "./meta";

export const spec: ComponentDocSpec = {
  name: "menubar",
  sections: [
    {
      kind: "showcase",
      id: "preview",
      title: "Preview",
      description:
        "A row of always-visible triggers, for a desktop-style command bar rather than one button's own menu. Open View and toggle a panel or pick a density — both are live state. Reach for this on the admin surface; the collector-facing product uses DropdownMenu instead.",
      render: (
        <Panel label="Admin menubar" note="Future admin surface">
          <MenubarShowcase />
        </Panel>
      ),
      source: `"use client";
const [auditLog, setAuditLog] = useState(true);
const [queueDepth, setQueueDepth] = useState(false);
const [density, setDensity] = useState("comfortable");

<Menubar>
  <MenubarMenu>
    <MenubarTrigger>Packs</MenubarTrigger>
    <MenubarContent>
      <MenubarItem>New pack<MenubarShortcut><Kbd>⌘N</Kbd></MenubarShortcut></MenubarItem>
      <MenubarSeparator />
      <MenubarItem>Publish queue</MenubarItem>
    </MenubarContent>
  </MenubarMenu>
  <MenubarMenu>
    <MenubarTrigger>View</MenubarTrigger>
    <MenubarContent>
      <MenubarLabel>Panels</MenubarLabel>
      <MenubarCheckboxItem checked={auditLog} onCheckedChange={setAuditLog}>
        Audit log
      </MenubarCheckboxItem>
      <MenubarCheckboxItem checked={queueDepth} onCheckedChange={setQueueDepth}>
        Queue depth
      </MenubarCheckboxItem>
      <MenubarSeparator />
      <MenubarLabel>Density</MenubarLabel>
      <MenubarRadioGroup value={density} onValueChange={setDensity}>
        <MenubarRadioItem value="comfortable">Comfortable</MenubarRadioItem>
        <MenubarRadioItem value="compact">Compact</MenubarRadioItem>
      </MenubarRadioGroup>
      <MenubarSeparator />
      <MenubarSub>
        <MenubarSubTrigger>Export</MenubarSubTrigger>
        <MenubarSubContent>
          <MenubarItem>Download CSV</MenubarItem>
          <MenubarItem>Download JSON</MenubarItem>
        </MenubarSubContent>
      </MenubarSub>
      <MenubarSeparator />
      <MenubarItem variant="destructive">Reset admin layout</MenubarItem>
    </MenubarContent>
  </MenubarMenu>
</Menubar>`,
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
      description: "The minimal import and call — one MenubarMenu per top-level trigger.",
      language: "tsx",
      code: `import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarTrigger,
} from "@/components/ui/menubar";

export function AdminMenubar() {
  return (
    <Menubar>
      <MenubarMenu>
        <MenubarTrigger>Packs</MenubarTrigger>
        <MenubarContent>
          <MenubarItem>New pack</MenubarItem>
          <MenubarItem>Import card set</MenubarItem>
        </MenubarContent>
      </MenubarMenu>
    </Menubar>
  );
}`,
    },
    {
      kind: "disclosure",
      id: "api",
      title: "API Reference",
      description:
        "Every part forwards to its Radix MenubarPrimitive counterpart beyond the className merge documented below.",
      blocks: [
        {
          label: "Menubar",
          body: (
            <p className="type-small text-muted-foreground">
              The root row. Holds one or more <Code>MenubarMenu</Code>, each an independent
              trigger + content pair sharing one keyboard roving group.
            </p>
          ),
        },
        {
          label: "MenubarItem",
          body: (
            <Meta
              items={[
                { k: "variant", v: '"default" | "destructive". Default: "default".' },
                { k: "inset", v: "boolean. Adds left padding to align with items that carry an indicator." },
                { k: "disabledReason", v: "Why a disabled item can't be chosen, surfaced via components/ui/disabled.tsx (aria mode — the row is a Radix role=\"menuitem\" div, not a native-disableable element): an always-on aria-describedby plus a click/tap-reachable popover beside the row. Kept in parity with ContextMenuItem and DropdownMenuItem, so all three menus behave alike." },
              ]}
            />
          ),
        },
        {
          label: "MenubarCheckboxItem / MenubarRadioItem",
          body: (
            <Meta
              items={[
                { k: "checked", v: "boolean, for MenubarCheckboxItem — controlled." },
                { k: "value", v: "string, for MenubarRadioItem — its value within the enclosing MenubarRadioGroup." },
                { k: "disabledReason", v: "Same reason surface as MenubarItem." },
              ]}
            />
          ),
        },
        {
          label: "MenubarSub",
          body: (
            <p className="type-small text-muted-foreground">
              <Code>MenubarSub</Code> + <Code>MenubarSubTrigger</Code> +{" "}
              <Code>MenubarSubContent</Code>. One nesting level only — a deeper hierarchy
              belongs in a dialog.
            </p>
          ),
        },
      ],
    },
    {
      kind: "disclosure",
      id: "accessibility",
      title: "Accessibility",
      description: "Built directly on Radix MenubarPrimitive.",
      blocks: [
        {
          body: (
            <Meta
              items={[
                { k: "Root role", v: "menubar." },
                { k: "Trigger", v: "Carries aria-haspopup and aria-expanded, reflecting the open/closed state." },
                { k: "Content role", v: 'menu. Items are role="menuitem", role="menuitemcheckbox" or role="menuitemradio" to match the item kind.' },
                { k: "Disabled items", v: "Announced but not actionable, and skipped by arrow-key navigation." },
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
      description:
        "Radix's own menu keyboard model, extended across the row: the roving group spans every trigger, not just the items inside one open menu.",
      blocks: [
        {
          body: (
            <Meta
              items={[
                { k: "Enter / Space / ↓", v: "Opens the focused trigger's menu and moves focus to its first item." },
                { k: "← / →", v: "Moves focus between top-level triggers. While a menu is open, → also closes it and opens the next trigger's menu — the one behaviour DropdownMenu and ContextMenu do not have, since they have only one trigger." },
                { k: "↑ / ↓", v: "Inside an open menu, moves focus between its items, wrapping at the ends." },
                { k: "→ / ←", v: "Inside an open menu, opens/closes a MenubarSub." },
                { k: "Enter / Space", v: "Activates the focused item, or toggles a checkbox/radio item, and closes the menu." },
                { k: "Esc", v: "Closes the open menu and returns focus to its trigger." },
                { k: "Typeahead", v: "Typing jumps to the next item whose label starts with the typed character." },
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
        "The row itself does not adapt to width — the layout around it has to.",
      blocks: [
        {
          body: (
            <p className="type-small text-muted-foreground">
              <Code>Menubar</Code> is <Code>flex items-center gap-0.5</Code> with no{" "}
              <Code>flex-wrap</Code> and no built-in horizontal scroll: at the three
              triggers in the Preview above it fits every measured width down to 375px
              (measured in a real browser: no width overflow, no 200%
              zoom overflow, no RTL overflow), but a bar with enough top-level triggers to
              exceed its container will overflow rather than wrap or scroll — the caller
              is responsible for wrapping it in its own <Code>overflow-x-auto</Code> track
              or trimming the trigger count on narrow layouts. Content, not chrome:
              <Code>MenubarContent</Code>&rsquo;s panels are portalled and Radix-positioned
              off the trigger, so they reflow with the viewport independently of the row
              that opened them.
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
