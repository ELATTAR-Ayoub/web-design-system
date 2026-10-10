import { PackageOpen, Truck } from "lucide-react";

import { SourceMeta } from "@/components/docs/component-page/sections";
import type { ComponentDocSpec } from "@/components/docs/component-page/types";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogMedia,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Icon } from "@/components/ui/icon";
import { Input } from "@/components/ui/input";
import { Code, Meta, Note, Row } from "@/components/ds/kit";

import { meta } from "./meta";

export const spec: ComponentDocSpec = {
  name: "dialog",
  sections: [
    {
      kind: "showcase",
      id: "preview",
      title: "Preview",
      description:
        "A modal confirmation. Press Open Pack to see the real overlay — dismissed by Cancel, the ✕, Escape, or a click outside — then reopen it from the trigger as many times as you like.",
      render: (
        <div className="space-y-6">
          <Row>
            {/* NO `defaultOpen`. Measured on this page with it: the body
                took `pointer-events: none`, so the article could not be
                scrolled and no other section was reachable. `modal={false}`
                does not rescue it either — `DialogContent` always renders
                `DialogOverlay`, which is a fixed, full-viewport scrim whether
                the dialog traps focus or not. The trigger below opens the real
                component, which is what this section is for; a specimen must
                not take the page hostage to show itself. */}
            <Dialog>
              <DialogTrigger asChild>
                <Button>
                  <Icon icon={PackageOpen} size="sm" tone="inherit" />
                  Open Pack
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Confirm your purchase</DialogTitle>
                  <DialogDescription>
                    You are about to open 3 packs of Eclipse Vault. This cannot be reversed
                    once the cards are revealed.
                  </DialogDescription>
                </DialogHeader>
                <dl className="my-2 divide-y divide-border rounded-lg border border-border bg-background">
                  <div className="flex justify-between px-4 py-3">
                    <dt className="type-small text-muted-foreground">3 × Eclipse Vault</dt>
                    <dd className="type-number-base text-foreground">$144.00</dd>
                  </div>
                  <div className="flex justify-between px-4 py-3">
                    <dt className="type-small text-muted-foreground">Total</dt>
                    <dd className="type-number-md text-value-ink">$144.00</dd>
                  </div>
                </dl>
                <DialogFooter>
                  <DialogClose asChild>
                    <Button variant="ghost">Cancel</Button>
                  </DialogClose>
                  <Button variant="premium">Confirm &amp; Open</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </Row>
          <Note tone="action" title="Three zones, not one card">
            A muted header band (title, description, close), the lit body
            you are deciding on, and a muted footer band for the CTAs. A
            dialog is a container for a task, and the banding is what makes
            that structure readable at a glance. Escape and clicking the
            overlay both close it here, because nothing in a plain Dialog is
            destructive — an irreversible decision belongs to{" "}
            <Code>alert-dialog</Code> instead, which removes both of those
            exits. Press <Code>Open Pack</Code> above to see it: the
            specimen starts closed on purpose, because a modal opened on page
            load puts <Code>pointer-events: none</Code> on the body and takes
            the rest of this page with it.
          </Note>
        </div>
      ),
      source: `<Dialog>
  <DialogTrigger asChild>
    <Button>Open Pack</Button>
  </DialogTrigger>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Confirm your purchase</DialogTitle>
      <DialogDescription>
        You are about to open 3 packs of Eclipse Vault. This cannot be reversed
        once the cards are revealed.
      </DialogDescription>
    </DialogHeader>
    <DialogFooter>
      <DialogClose asChild>
        <Button variant="ghost">Cancel</Button>
      </DialogClose>
      <Button variant="premium">Confirm & Open</Button>
    </DialogFooter>
  </DialogContent>
</Dialog>`,
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
      description: "The minimal import and call — a header, a body, and a footer.",
      language: "tsx",
      code: `import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export function ConfirmDialog() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Open</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Are you sure?</DialogTitle>
          <DialogDescription>This action can be undone later.</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="ghost">Cancel</Button>
          </DialogClose>
          <Button>Confirm</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}`,
    },
    {
      kind: "showcase",
      id: "variants",
      title: "Variants",
      description:
        "default is the standard header/body/footer composition. media adds a full-bleed visual lead via DialogMedia and hides the corner close button behind the image instead of the header band — for announcements and promotions, not confirmations.",
      label: "default vs. media",
      render: (
        <Row>
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline">Form dialog (default)</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Request shipment</DialogTitle>
                <DialogDescription>
                  Physical cards ship from our vault once a request is approved.
                </DialogDescription>
              </DialogHeader>
              <FieldGroup>
                <Field>
                  <FieldLabel htmlFor="dlg-ship-name">Full name</FieldLabel>
                  <Input id="dlg-ship-name" placeholder="As it appears on ID" />
                </Field>
              </FieldGroup>
              <DialogFooter>
                <DialogClose asChild>
                  <Button variant="ghost">Cancel</Button>
                </DialogClose>
                <Button>
                  <Icon icon={Truck} size="sm" tone="inherit" />
                  Request Shipment
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <Dialog>
            <DialogTrigger asChild>
              <Button variant="secondary">Media dialog</Button>
            </DialogTrigger>
            <DialogContent variant="media">
              <DialogMedia className="flex items-center justify-center bg-muted">
                <span className="type-small text-muted-foreground">Visual lead</span>
              </DialogMedia>
              <DialogHeader>
                <DialogTitle>Your order has shipped</DialogTitle>
                <DialogDescription>
                  It&rsquo;s on its way and should arrive by Thursday.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <DialogClose asChild>
                  <Button variant="ghost">Not now</Button>
                </DialogClose>
                <Button variant="default">Track order</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </Row>
      ),
      source: `<DialogContent>{/* default — standard header/body/footer */}</DialogContent>

<DialogContent variant="media">
  <DialogMedia>{/* full-bleed image or video */}</DialogMedia>
  <DialogHeader>…</DialogHeader>
  <DialogFooter>…</DialogFooter>
</DialogContent>`,
    },
    {
      kind: "disclosure",
      id: "api",
      title: "API Reference",
      blocks: [
        {
          label: "Dialog / DialogTrigger / DialogPortal / DialogClose",
          body: (
            <Meta
              items={[
                {
                  k: "Dialog",
                  v: "Forwards every prop straight to Radix DialogPrimitive.Root — open, onOpenChange, defaultOpen, modal. Renders no DOM of its own.",
                },
                {
                  k: "DialogTrigger",
                  v: "Radix DialogPrimitive.Trigger. Pass asChild to make an existing element (typically a Button) the trigger instead of wrapping it.",
                },
                {
                  k: "DialogClose",
                  v: "Radix DialogPrimitive.Close. asChild lets any element (Button variant=\"ghost\", for instance) dismiss the dialog on click.",
                },
                {
                  k: "DialogPortal",
                  v: "Radix DialogPrimitive.Portal. Used internally by DialogContent; exported for a consumer composing a non-standard layout.",
                },
              ]}
            />
          ),
        },
        {
          label: "DialogContent",
          body: (
            <Meta
              items={[
                {
                  k: "variant",
                  v: "\"default\" · \"media\". Default: \"default\". \"media\" removes body padding and header/footer bands' rounding so DialogMedia can bleed to the edge.",
                },
                {
                  k: "showCloseButton",
                  v: "boolean. Default: true. Hides the absolutely-positioned ✕ in the top-right corner when false — used when DialogFooter's own showCloseButton covers dismissal instead.",
                },
                {
                  k: "...props",
                  v: "Every Radix DialogPrimitive.Content prop (onOpenAutoFocus, onEscapeKeyDown, onPointerDownOutside, forceMount, etc.), forwarded directly.",
                },
              ]}
            />
          ),
        },
        {
          label: "DialogHeader / DialogFooter / DialogMedia",
          body: (
            <Meta
              items={[
                {
                  k: "DialogHeader",
                  v: "React.ComponentProps<\"div\">. The title/description band; bleeds to the content's edges and reserves space for the corner close button via a group-data hook.",
                },
                {
                  k: "DialogFooter",
                  v: "React.ComponentProps<\"div\"> & { showCloseButton?: boolean }. showCloseButton (default false) appends a Button variant=\"outline\" wrapped in DialogClose after the footer's own children.",
                },
                {
                  k: "DialogMedia",
                  v: "React.ComponentProps<\"div\">. A fixed aspect-video, overflow-hidden slot for an image or video — an anatomy slot of variant=\"media\", not a separate component.",
                },
              ]}
            />
          ),
        },
        {
          label: "DialogTitle / DialogDescription / DialogOverlay",
          body: (
            <Meta
              items={[
                {
                  k: "DialogTitle",
                  v: "Radix DialogPrimitive.Title. Required for every dialog — it is what the dialog's accessible name is built from. Rendering DialogContent without one produces a Radix console warning about a missing accessible name.",
                },
                {
                  k: "DialogDescription",
                  v: "Radix DialogPrimitive.Description. Optional, but supplies the dialog's aria-describedby when present.",
                },
                {
                  k: "DialogOverlay",
                  v: "Radix DialogPrimitive.Overlay. Rendered internally by DialogContent; exported for a consumer that needs to reference or restyle it directly.",
                },
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
      description:
        "Built on Radix DialogPrimitive, which supplies the modal semantics: a focus trap, restored focus on close, and the ARIA relationships between trigger, title and description.",
      blocks: [
        {
          body: (
            <Meta
              items={[
                { k: "Role", v: "role=\"dialog\" (Radix default) with aria-modal=\"true\"." },
                {
                  k: "Accessible name",
                  v: "aria-labelledby, pointed automatically at DialogTitle's generated id. DialogTitle is required for this reason — its absence leaves the dialog unnamed.",
                },
                {
                  k: "Accessible description",
                  v: "aria-describedby, pointed at DialogDescription's id when one is present.",
                },
                {
                  k: "Focus management",
                  v: "On open, focus moves into the content (the first focusable element, or the content itself). Focus is trapped inside the dialog while open — Tab cannot reach the page behind it — and returns to the trigger on close.",
                },
                {
                  k: "Dismissal",
                  v: "Escape, a click on the overlay, and a click outside the content all close the dialog by default, in addition to any explicit DialogClose control.",
                },
                {
                  k: "Background inertness",
                  v: "The rest of the page is marked inert to assistive tech while the dialog is open, so a screen reader user cannot accidentally navigate into content behind the overlay.",
                },
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
      blocks: [
        {
          body: (
            <Meta
              items={[
                { k: "Enter / Space", v: "Activates the trigger, opening the dialog." },
                { k: "Tab / Shift+Tab", v: "Cycles focus among the dialog's own focusable elements only; it cannot escape to the page behind it while open." },
                { k: "Escape", v: "Closes the dialog and returns focus to the trigger." },
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
        "DialogContent's width genuinely changes by viewport rather than just reflowing its content.",
      blocks: [
        {
          body: (
            <Meta
              items={[
                {
                  k: "Below the sm breakpoint (768px)",
                  v: "max-w-[calc(100%-2rem)] — the dialog fills the viewport minus a 1rem margin on each side, so it never touches the screen edge on a phone.",
                },
                {
                  k: "sm and above",
                  v: "Capped at sm:max-w-sm (default variant) or sm:max-w-md (media variant) and centred, rather than continuing to grow with the viewport.",
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
