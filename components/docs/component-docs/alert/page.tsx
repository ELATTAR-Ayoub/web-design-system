import {
  AlertTriangle,
  CheckCircle2,
  Hourglass,
  Info,
  XCircle,
} from "lucide-react";

import { SourceMeta } from "@/components/docs/component-page/sections";
import type { ComponentDocSpec } from "@/components/docs/component-page/types";

import {
  Alert,
  AlertAction,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { Code, Meta, Note, StateCell, StateGrid } from "@/components/ds/kit";

import { meta } from "./meta";

export const spec: ComponentDocSpec = {
  name: "alert",
  sections: [
    {
      kind: "showcase",
      id: "preview",
      title: "Preview",
      description:
        "All five tones together — default, success, info, destructive, warning. Only the icon and the bloom behind it change between them; full copy and the action slot are shown in Variants below.",
      render: (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <Alert className="text-left">
            <Icon icon={Info} size="sm" tone="inherit" />
            <AlertTitle>Provably fair</AlertTitle>
          </Alert>
          <Alert variant="success" className="text-left">
            <Icon icon={CheckCircle2} size="sm" tone="inherit" />
            <AlertTitle>Deposit cleared</AlertTitle>
          </Alert>
          <Alert variant="info" className="text-left">
            <Icon icon={Hourglass} size="sm" tone="inherit" />
            <AlertTitle>Under review</AlertTitle>
          </Alert>
          <Alert variant="destructive" className="text-left">
            <Icon icon={XCircle} size="sm" tone="inherit" />
            <AlertTitle>Payment failed</AlertTitle>
          </Alert>
          <Alert variant="warning" className="text-left">
            <Icon icon={AlertTriangle} size="sm" tone="inherit" />
            <AlertTitle>Limit approaching</AlertTitle>
          </Alert>
        </div>
      ),
      source: `<Alert>
  <Icon icon={Info} size="sm" tone="inherit" />
  <AlertTitle>Provably fair</AlertTitle>
</Alert>
<Alert variant="success">
  <Icon icon={CheckCircle2} size="sm" tone="inherit" />
  <AlertTitle>Deposit cleared</AlertTitle>
</Alert>
<Alert variant="info">
  <Icon icon={Hourglass} size="sm" tone="inherit" />
  <AlertTitle>Under review</AlertTitle>
</Alert>
<Alert variant="destructive">
  <Icon icon={XCircle} size="sm" tone="inherit" />
  <AlertTitle>Payment failed</AlertTitle>
</Alert>
<Alert variant="warning">
  <Icon icon={AlertTriangle} size="sm" tone="inherit" />
  <AlertTitle>Limit approaching</AlertTitle>
</Alert>`,
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
      description:
        "The pattern every other feedback component follows: import from components/ui, pass real content, let the tokens carry the tone.",
      language: "tsx",
      code: `import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Icon } from "@/components/ui/icon";
import { CheckCircle2 } from "lucide-react";

export function DepositCleared() {
  return (
    <Alert variant="success">
      <Icon icon={CheckCircle2} size="md" tone="inherit" />
      <AlertTitle>Deposit cleared</AlertTitle>
      <AlertDescription>
        $250.00 was added to your available balance.
      </AlertDescription>
    </Alert>
  );
}`,
    },
    {
      kind: "showcase",
      id: "variants",
      title: "Variants",
      description:
        "Five variants. Stock shadcn only ships default and destructive, so success, warning and info were added to cover the states the brief requires. Every variant shares the same background, border and text colour — only the icon and the bloom behind it change, three declarations. Stock shadcn tints the whole card and recolours the copy; five tinted cards on one page read as a traffic light rather than as one component, and body text is the least legible place to spend a hue.",
      label: "All five variants",
      render: (
        <div className="space-y-4">
          <Alert>
            <Icon icon={Info} size="md" tone="inherit" />
            <AlertTitle>Provably fair</AlertTitle>
            <AlertDescription>
              Every pack roll is seeded and verifiable. The seed for this pack
              is published after opening.
            </AlertDescription>
          </Alert>

          <Alert variant="success">
            <Icon icon={CheckCircle2} size="md" tone="inherit" />
            <AlertTitle>Deposit cleared</AlertTitle>
            <AlertDescription>
              $250.00 was added to your available balance.
            </AlertDescription>
          </Alert>

          {/* `info`, not `warning`, and the glyph is why. An Hourglass over
              "under review" reads as *pending*, which is information, not a
              caution — a variant that disagrees with its own icon is the
              tone said two different ways. The caution example is the
              purchase limit below, which is exactly what RULES §5 reserves
              `warning` for: approaching a limit worth knowing about. */}
          <Alert variant="info">
            <Icon icon={Hourglass} size="md" tone="inherit" />
            <AlertTitle>Withdrawal under review</AlertTitle>
            <AlertDescription>
              Withdrawals over $1,000 are reviewed manually and usually clear
              within one business day.
            </AlertDescription>
            <AlertAction>
              <Button variant="secondary" size="sm">
                Details
              </Button>
            </AlertAction>
          </Alert>

          <Alert variant="destructive">
            <Icon icon={XCircle} size="md" tone="inherit" />
            <AlertTitle>Payment failed</AlertTitle>
            <AlertDescription>
              Your card was declined. No packs were opened and nothing was
              charged.
            </AlertDescription>
            <AlertAction>
              <Button variant="secondary" size="sm">
                Retry
              </Button>
            </AlertAction>
          </Alert>

          <Alert variant="warning">
            <Icon icon={AlertTriangle} size="md" tone="inherit" />
            <AlertTitle>Purchase limit approaching</AlertTitle>
            <AlertDescription>
              You have used $840 of your $1,000 weekly limit. Limits are set
              in Preferences and exist to help you stay in control.
            </AlertDescription>
          </Alert>
        </div>
      ),
      source: `<Alert>
  <Icon icon={Info} size="md" tone="inherit" />
  <AlertTitle>Provably fair</AlertTitle>
  <AlertDescription>
    Every pack roll is seeded and verifiable.
  </AlertDescription>
</Alert>

<Alert variant="success">…</Alert>
<Alert variant="info">
  …
  <AlertAction>
    <Button variant="secondary" size="sm">Details</Button>
  </AlertAction>
</Alert>
<Alert variant="destructive">…</Alert>
<Alert variant="warning">…</Alert>`,
    },
    {
      kind: "disclosure",
      id: "api",
      title: "API Reference",
      description: "Alert, AlertTitle, AlertDescription and AlertAction.",
      blocks: [
        {
          label: "Alert",
          body: (
            <Meta
              items={[
                {
                  k: "variant",
                  v: '"default" · "destructive" · "success" · "warning" · "info". Default: "default".',
                },
                {
                  k: "role",
                  v: 'Not a settable prop with a default value — computed from variant (see Accessibility) and always present. Pass your own role in the spread to override it; the explicit prop wins.',
                },
                {
                  k: "...props",
                  v: "Every other native <div> attribute, forwarded directly. children are composed from AlertTitle / AlertDescription / AlertAction.",
                },
              ]}
            />
          ),
        },
        {
          label: "AlertTitle / AlertDescription",
          body: (
            <Meta
              items={[
                {
                  k: "(both)",
                  v: "React.ComponentProps<\"div\">. AlertTitle is the bold first line; AlertDescription is the supporting sentence and sits at text-balance (md:text-pretty above 768px).",
                },
              ]}
            />
          ),
        },
        {
          label: "AlertAction",
          body: (
            <Meta
              items={[
                {
                  k: "(all)",
                  v: "React.ComponentProps<\"div\">. Absolutely positioned top-right slot for a single small action — a Button, typically size=\"sm\". No required props.",
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
        "Alert is not a control — it reports, it is not operated — so this section reads as the meanings the component can carry rather than interaction states.",
      blocks: [
        {
          body: (
            <StateGrid cols={5}>
              <StateCell label="rest / default" note="A condition worth explaining">
                <Alert className="max-w-40 text-left">
                  <Icon icon={Info} size="sm" tone="inherit" />
                  <AlertTitle>Provably fair</AlertTitle>
                </Alert>
              </StateCell>
              <StateCell label="success">
                <Alert variant="success" className="max-w-40 text-left">
                  <Icon icon={CheckCircle2} size="sm" tone="inherit" />
                  <AlertTitle>Deposit cleared</AlertTitle>
                </Alert>
              </StateCell>
              <StateCell label="info" note="Pending, not a caution">
                <Alert variant="info" className="max-w-40 text-left">
                  <Icon icon={Hourglass} size="sm" tone="inherit" />
                  <AlertTitle>Under review</AlertTitle>
                </Alert>
              </StateCell>
              <StateCell label="error" note="destructive">
                <Alert variant="destructive" className="max-w-40 text-left">
                  <Icon icon={XCircle} size="sm" tone="inherit" />
                  <AlertTitle>Payment failed</AlertTitle>
                </Alert>
              </StateCell>
              <StateCell label="warning">
                <Alert variant="warning" className="max-w-40 text-left">
                  <Icon icon={AlertTriangle} size="sm" tone="inherit" />
                  <AlertTitle>Limit approaching</AlertTitle>
                </Alert>
              </StateCell>
            </StateGrid>
          ),
        },
        {
          body: (
            <Note tone="action" title="Reading the N/A rows">
              <p>
                <strong>hover</strong>, <strong>focus-visible</strong>,{" "}
                <strong>pressed</strong> and <strong>disabled</strong> are{" "}
                <Code>N/A</Code>: Alert is not a control, it is a region that
                reports. The one exception is the action it can carry, and
                that is a <Code>Button</Code>, audited on its own page.
              </p>
              <p className="mt-2">
                <strong>loading</strong> is N/A for the same reason a Button
                has none of its own: an Alert is synchronous content, not an
                async request. <strong>empty</strong> is N/A because an Alert
                either renders its title/description or does not render at
                all.
              </p>
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
        "role is chosen from the variant in alert.tsx, so a page carrying several alerts does not interrupt the reader for news that was not urgent.",
      blocks: [
        {
          body: (
            <Meta
              items={[
                {
                  k: "Role",
                  v: 'destructive and warning render role="alert" — an ASSERTIVE live region that interrupts whatever the screen reader is saying. default, info and success render role="status" — announced at the next pause. Pass your own role prop to override either.',
                },
                {
                  k: "Accessible name",
                  v: "AlertTitle's text content, read as part of the live region's announcement.",
                },
                {
                  k: "Colour is not the only signal",
                  v: "Every variant shares one background, border and text colour; only the icon and the bloom behind it change. That keeps the words at full contrast and puts the tone in a channel a screen reader and a colour-blind reader both get — the glyph — rather than in the least legible place to spend a hue.",
                },
              ]}
            />
          ),
        },
        {
          body: (
            <Note tone="error" title="The role follows the tone">
              Stock shadcn writes <Code>role=&quot;alert&quot;</Code> on
              every variant. Five variants on one page would interrupt the
              reader five times for three pieces of news that were not
              urgent — so only <Code>destructive</Code> and{" "}
              <Code>warning</Code> keep <Code>alert</Code>;{" "}
              <Code>default</Code>, <Code>info</Code> and{" "}
              <Code>success</Code> are <Code>role=&quot;status&quot;</Code>.
            </Note>
          ),
        },
      ],
    },
    {
      kind: "disclosure",
      id: "keyboard",
      title: "Keyboard",
      description:
        "Alert itself places nothing in the tab sequence — it reports, it does not receive focus. The one exception is whatever AlertAction wraps, which keeps that element's own native keyboard contract.",
      blocks: [
        {
          body: (
            <Meta
              items={[
                { k: "The alert region", v: "No keyboard behaviour of its own. A role=\"alert\" or role=\"status\" region is announced to a screen reader wherever the user's focus already is — it is not something Tab visits." },
                { k: "AlertAction", v: "Renders a Button (see the Variants specimen's \"Details\"/\"Retry\" actions), so Tab moves focus to it in document order and Space / Enter activates it exactly as documented on the Button page." },
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
        "Alert is a fluid block, not a fixed card — its width, wrapping and column count all follow the parent it is placed in rather than the viewport directly.",
      blocks: [
        {
          body: (
            <Meta
              items={[
                {
                  k: "Layout",
                  v: "A two-column grid (has-[>svg]:grid-cols-[auto_1fr]) that appears the moment an icon is present, regardless of container width — it is not a breakpoint-driven reflow, so a narrow Alert and a wide one both keep the icon in its own column rather than stacking it above the text.",
                },
                {
                  k: "Description wrapping",
                  v: "AlertDescription is text-balance by default and switches to text-pretty from the md breakpoint (768px) up — a deliberate difference: balance evens out short, narrow lines, and pretty avoids an orphan word on a long one, which only starts to matter once a line has room to run long.",
                },
                {
                  k: "AlertAction",
                  v: "Absolutely positioned into the top-right corner (has-data-[slot=alert-action]:pr-20 reserves the room on the title/description column) rather than reflowing into the grid at any width, so it never collides with wrapped description text even in the Preview grid's narrowest cards.",
                },
                {
                  k: "Measured",
                  v: "No overflow at 375, 768, 1440 or 1920px, under 200% text zoom, or under RTL — consistent with a component with no fixed width and no viewport-keyed classes of its own.",
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
