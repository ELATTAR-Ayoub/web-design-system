import { SourceMeta } from "@/components/docs/component-page/sections";
import type { ComponentDocSpec } from "@/components/docs/component-page/types";
import { Code, Meta, Panel, Row } from "@/components/ds/kit";

import {
  Avatar,
  AvatarBadge,
  AvatarFallback,
  AvatarGroup,
  AvatarGroupCount,
} from "@/components/ui/avatar";

import { InviteAvatarShowcase } from "./avatar-showcase";

import { meta } from "./meta";

export const spec: ComponentDocSpec = {
  name: "avatar",
  sections: [
    {
      kind: "showcase",
      id: "preview",
      title: "Preview",
      description:
        "Initials are the fallback — never a generic silhouette — shown here with a status badge and a stacking group that grows when the reader presses \"Invite\". AvatarImage's load lifecycle is covered under States.",
      render: <InviteAvatarShowcase />,
      source: `const [invited, setInvited] = useState(["VW", "EM", "TC"]);

function invite() {
  setInvited((prev) => [...prev, nextInitials(prev.length)]);
}

<Avatar size="lg">
  <AvatarFallback>VW</AvatarFallback>
  <AvatarBadge className="bg-value" />
</Avatar>

<AvatarGroup>
  {invited.map((initials) => (
    <Avatar key={initials} size="sm"><AvatarFallback>{initials}</AvatarFallback></Avatar>
  ))}
  <AvatarGroupCount>+248</AvatarGroupCount>
</AvatarGroup>

<Button variant="outline" onClick={invite}>Invite</Button>`,
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
      description: "AvatarImage paired with AvatarFallback so a failed or slow load never leaves a blank circle.",
      language: "tsx",
      code: `import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export function Collector() {
  return (
    <Avatar>
      <AvatarImage src="/collectors/voidwing.jpg" alt="" />
      <AvatarFallback>VW</AvatarFallback>
    </Avatar>
  );
}`,
    },
    {
      kind: "showcase",
      id: "sizes",
      title: "Sizes",
      description:
        "Three sizes via the size prop — default (32px), sm (24px) and lg (40px). AvatarFallback's type scales with it: the base and sm sizes use text-sm, and lg steps up to the shared body role via a group-data selector so a caller never has to restate the size on the fallback separately.",
      label: "size",
      render: (
        <Row align="end">
          <div className="flex flex-col items-center gap-2">
            <Avatar size="sm">
              <AvatarFallback>VW</AvatarFallback>
            </Avatar>
            <span className="type-small text-muted-foreground">sm</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <Avatar size="default">
              <AvatarFallback>VW</AvatarFallback>
            </Avatar>
            <span className="type-small text-muted-foreground">default</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <Avatar size="lg">
              <AvatarFallback>VW</AvatarFallback>
            </Avatar>
            <span className="type-small text-muted-foreground">lg</span>
          </div>
        </Row>
      ),
      source: `<Avatar size="sm"><AvatarFallback>VW</AvatarFallback></Avatar>
<Avatar size="default"><AvatarFallback>VW</AvatarFallback></Avatar>
<Avatar size="lg"><AvatarFallback>VW</AvatarFallback></Avatar>`,
    },
    {
      kind: "showcase",
      id: "examples",
      title: "Examples",
      description:
        "A status badge pinned to the corner, a leaderboard ring, and a stacking group with an overflow count — the collector compositions this component actually serves.",
      label: "Common compositions",
      render: (
        <div className="space-y-6">
          <Panel label="With a status badge">
            <Row>
              <Avatar size="lg">
                <AvatarFallback>VW</AvatarFallback>
                <AvatarBadge className="bg-value" />
              </Avatar>
            </Row>
            <p className="type-small mt-5 text-muted-foreground">
              AvatarBadge is a plain absolutely-positioned span — it carries no
              meaning of its own. Its size tracks the avatar&rsquo;s size via
              the same group-data selector as the fallback.
            </p>
          </Panel>

          <Panel label="Leaderboard leader" className="mt-4">
            <Row>
              <Avatar size="lg" className="ring-2 ring-value">
                <AvatarFallback className="bg-value/12 text-value-ink">#1</AvatarFallback>
              </Avatar>
            </Row>
            <p className="type-small mt-5 text-muted-foreground">
              The lime ring marks the leaderboard leader — one of lime&rsquo;s
              permitted jobs. This is a call-site className extension, not a
              variant on the component.
            </p>
          </Panel>

          <Panel label="Group — who opened this pack" className="mt-4">
            <AvatarGroup>
              {["VW", "EM", "TC", "SW"].map((i) => (
                <Avatar key={i} size="sm">
                  <AvatarFallback>{i}</AvatarFallback>
                </Avatar>
              ))}
              <AvatarGroupCount>+248</AvatarGroupCount>
            </AvatarGroup>
          </Panel>
        </div>
      ),
      source: `<Avatar size="lg">
  <AvatarFallback>VW</AvatarFallback>
  <AvatarBadge className="bg-value" />
</Avatar>

<AvatarGroup>
  <Avatar size="sm"><AvatarFallback>VW</AvatarFallback></Avatar>
  <Avatar size="sm"><AvatarFallback>EM</AvatarFallback></Avatar>
  <AvatarGroupCount>+248</AvatarGroupCount>
</AvatarGroup>`,
    },
    {
      kind: "disclosure",
      id: "api",
      title: "API Reference",
      description: "Radix's Avatar.Root, Avatar.Image and Avatar.Fallback underlie the first three; every other prop is forwarded.",
      blocks: [
        {
          label: "Avatar",
          body: (
            <Meta
              items={[
                { k: "size", v: '"default" | "sm" | "lg". Default: "default" (32px). Sets data-size, which AvatarFallback, AvatarBadge and AvatarGroupCount all key their own sizing to.' },
                { k: "...props", v: "Every other Radix Avatar.Root prop (onLoadingStatusChange, delayMs on children, etc.), forwarded directly." },
              ]}
            />
          ),
        },
        {
          label: "AvatarImage",
          body: (
            <p className="type-small text-muted-foreground">
              Radix <Code>Avatar.Image</Code>. Renders only after the image
              has loaded — never over a loading or broken image — at which
              point <Code>AvatarFallback</Code> stops rendering. Forwards
              every native <Code>{"<img>"}</Code> prop, including{" "}
              <Code>src</Code> and <Code>alt</Code>.
            </p>
          ),
        },
        {
          label: "AvatarFallback",
          body: (
            <p className="type-small text-muted-foreground">
              Radix <Code>Avatar.Fallback</Code>, styled as centred initials
              on a muted circle. Accepts an optional{" "}
              <Code>delayMs</Code> (inherited from Radix) to avoid a flash of
              fallback on a fast connection.
            </p>
          ),
        },
        {
          label: "AvatarBadge",
          body: (
            <p className="type-small text-muted-foreground">
              A plain <Code>{"<span>"}</Code>, absolutely positioned at the
              avatar&rsquo;s bottom-right corner. Carries no colour of its own
              — pass a background utility (<Code>bg-value</Code>,{" "}
              <Code>bg-success</Code>) at the call site for what it means.
            </p>
          ),
        },
        {
          label: "AvatarGroup / AvatarGroupCount",
          body: (
            <Meta
              items={[
                { k: "AvatarGroup", v: "A flex row with negative spacing (-space-x-2) so avatars overlap, and a ring-2 ring-background forced onto every Avatar child so the overlap reads as stacked circles rather than clipped ones." },
                { k: "AvatarGroupCount", v: "A same-sized circle for the remainder — \"+248\" — tracking the group's size via the same group-data selector as AvatarFallback." },
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
        "Avatar is a static display element, not a control — most interaction states are N/A. What it does have is a real two-step image lifecycle: loading/failed shows the fallback, loaded shows the image.",
      blocks: [
        {
          body: (
            <Meta
              items={[
                { k: "rest (image loaded)", v: "AvatarImage renders; AvatarFallback is unmounted." },
                { k: "loading / error (no image, or failed)", v: "AvatarFallback renders — shown live in every specimen on this page, since none pass a resolving src." },
                { k: "hover / focus-visible / pressed", v: "N/A — Avatar renders no interactive element of its own. A clickable avatar is a caller wrapping it in a button or link, which owns those states itself." },
                { k: "success", v: "N/A — there is no action to succeed at." },
                { k: "disabled", v: "N/A — Avatar has no disabled prop." },
                { k: "empty", v: "N/A — Avatar always renders either the image or the fallback; there is no third, contentless state." },
              ]}
            />
          ),
        },
      ],
    },
    {
      kind: "disclosure",
      id: "accessibility",
      title: "Accessibility",
      blocks: [
        {
          body: (
            <Meta
              items={[
                { k: "Role", v: "None implicit — Avatar renders a plain <span> (via Radix Avatar.Root). It is decorative chrome unless a caller adds semantics." },
                { k: "AvatarImage alt", v: "Pass alt on AvatarImage as you would any <img> — empty alt=\"\" when the adjacent name already identifies the person, a real description when it does not." },
                { k: "Fallback timing", v: "Radix's Avatar.Fallback only renders after the image fails or times out (or immediately if there is no AvatarImage), so the initials never flash over a loading image." },
                { k: "Interactive avatars", v: "Wrapping an Avatar in a link or button (a profile row, a leaderboard entry) makes that wrapper responsible for its own accessible name and focus handling — Avatar contributes no role or label toward it." },
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
        "Avatar is never independently focusable, so it has no keyboard behaviour of its own.",
      blocks: [
        {
          body: (
            <p className="type-small text-muted-foreground">
              N/A. When an avatar is made interactive by wrapping it in a
              button or link, standard Tab / Enter / Space behaviour comes
              from that wrapper, not from Avatar.
            </p>
          ),
        },
      ],
    },
    {
      kind: "disclosure",
      id: "responsive",
      title: "Responsive",
      description:
        "Avatar has no breakpoint classes at all — size is a caller-chosen prop (default/sm/lg), fixed in pixels, and does not change on its own as the viewport narrows.",
      blocks: [
        {
          body: (
            <Meta
              items={[
                {
                  k: "Fixed pixel sizes",
                  v: "size-8 (32px) by default, data-[size=lg]:size-10 (40px), data-[size=sm]:size-6 (24px) — none of these are viewport-keyed; a card that wants a smaller avatar on mobile passes size=\"sm\" explicitly rather than relying on a responsive default.",
                },
                {
                  k: "AvatarGroup",
                  v: "A flex row with negative spacing (-space-x-2); it does not wrap to a second row at a narrow width, so a long group is expected to be capped with AvatarGroupCount (the \"+248\" overflow chip) rather than left to reflow.",
                },
                {
                  k: "Zoom and RTL",
                  v: "AvatarFallback's initials are centred text inside a fixed circle, and the group's overlap direction (-space-x-2) follows logical, not physical, spacing — measured with no overflow at 200% text zoom or under RTL.",
                },
                {
                  k: "Measured",
                  v: "No overflow at 375, 768, 1440 or 1920px — expected for a component with a fixed pixel footprint and no fluid dimension of its own.",
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
