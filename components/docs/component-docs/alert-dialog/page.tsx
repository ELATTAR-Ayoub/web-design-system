/**
 * Authored documentation page for `alert-dialog`.
 *
 * Replaces the generated baseline. Migrated from the old `base/dialogs`
 * category page (`app/design-system/components/base/dialogs/page.tsx`, since deleted), which
 * held every overlay's real documentation on one page. Every specimen below
 * renders the real `AlertDialog` from `components/ui/alert-dialog.tsx` —
 * nothing here is a styled div.
 *
 * "Danger Zone" is not a separate registry item: it is a composition built on
 * AlertDialog, documented here as an example
 * (`components/ds/danger-zone-demo.tsx`) rather than a component of its own —
 * see the Examples section below.
 */

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";

import { DangerZone } from "@/components/ds/danger-zone-demo";
import { SourceMeta } from "@/components/docs/component-page/sections";
import type { ComponentDocSpec } from "@/components/docs/component-page/types";
import { Code, Meta, Note, Panel, Row } from "@/components/ds/kit";

import { meta } from "./meta";

export const spec: ComponentDocSpec = {
  name: "alert-dialog",
  sections: [
    {
      kind: "showcase",
      id: "preview",
      title: "Preview",
      description:
        "For an action that cannot be undone. Deliberately harder to dismiss than a Dialog: clicking the overlay does nothing, there is no corner close button, and the confirming button states the consequence rather than saying \"Confirm\".",
      render: (
        <Row>
      {/* NO `defaultOpen` HERE, and that is the decision. An alert dialog is
          modal by construction — Radix hard-sets `modal: true` after the
          prop spread, so it cannot be opened non-modally — and a documentation
          page that opens one on load puts `pointer-events: none` on the whole
          body. Measured: the article could not be scrolled, the rail could not
          be clicked, and every section below Preview was unreachable. A
          specimen must not take the page hostage to show itself. The trigger
          below opens the real component, which is the behaviour this section
          is for. */}
          {/* The trigger in the row it acts on, not floating in space: a
              reader sees what is at stake before the dialog restates it. */}
          <div className="flex w-full max-w-md items-center justify-between gap-4 rounded-lg border border-border bg-card px-4 py-3">
            <div className="min-w-0">
              <p className="type-body truncate text-foreground">Eclipse Vault — 12 cards</p>
              <p className="type-small text-muted-foreground">Estimated $2,481.00 at today&rsquo;s floor</p>
            </div>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive">Sell All Cards</Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Sell all 12 cards for $2,481.00?</AlertDialogTitle>
                <AlertDialogDescription>
                  Every card in this pull will be sold back at its current listed
                  value and removed from your Stash. This cannot be undone, and the
                  cards cannot be bought back.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Keep my cards</AlertDialogCancel>
                <AlertDialogAction>Sell all for $2,481.00</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
          </div>
        </Row>
      ),
      source: `<AlertDialog>
  <AlertDialogTrigger asChild>
    <Button variant="destructive">Sell All Cards</Button>
  </AlertDialogTrigger>
  <AlertDialogContent>
    <AlertDialogHeader>
      <AlertDialogTitle>Sell all 12 cards for $2,481.00?</AlertDialogTitle>
      <AlertDialogDescription>
        Every card in this pull will be sold back at its current listed value
        and removed from your Stash. This cannot be undone.
      </AlertDialogDescription>
    </AlertDialogHeader>
    <AlertDialogFooter>
      <AlertDialogCancel>Keep my cards</AlertDialogCancel>
      <AlertDialogAction>Sell all for $2,481.00</AlertDialogAction>
    </AlertDialogFooter>
  </AlertDialogContent>
</AlertDialog>`,
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
        "Write the consequence into the confirming button, including the amount — the user should be able to read only the button and still know exactly what happens. Phrase Cancel as the safe choice too, not just \"Cancel\".",
      language: "tsx",
      code: `import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";

export function CloseAccount() {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="outline">Close account</Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Close your account?</AlertDialogTitle>
          <AlertDialogDescription>
            Your Stash and pull history will be permanently deleted.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction>Close my account</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}`,
    },
    {
      kind: "showcase",
      id: "sizes",
      title: "Sizes",
      description:
        "default and sm both cap at max-w-xs below the sm breakpoint; sm keeps that cap at desktop width too, and stacks its two footer buttons into a grid instead of a row — for a panel with two long consequences that both need to stay fully readable.",
      label: "default vs. sm",
      render: (
        <div className="space-y-6">
          <Row align="start">
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="outline">Close account (default)</Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Close your account?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Your remaining balance of $1,204.80 will be returned to your
                    payment method. Your Stash and pull history will be
                    permanently deleted.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction>Close my account</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>

            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="outline" size="sm">
                  Clipped label (sm)
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent size="sm">
                <AlertDialogHeader>
                  <AlertDialogTitle>Settle and close?</AlertDialogTitle>
                  <AlertDialogDescription>
                    A narrow alert dialog with two long consequences. Both
                    buttons ellipsise, so both reach their full wording from a
                    tooltip on hover and on keyboard focus.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Keep my account open for now</AlertDialogCancel>
                  <AlertDialogAction>
                    Settle $412.00 and close the account ending 4417
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </Row>

          <Note tone="action" title="The tooltip is for a label that is clipped">
            <Code>AlertDialogAction</Code> and <Code>AlertDialogCancel</Code>{" "}
            truncate rather than widen their panel, so the full wording must
            stay reachable from a tooltip on hover <em>and</em> on keyboard
            focus. That tooltip attaches{" "}
            <strong className="text-foreground">only when the label is
            actually clipped</strong> — measured via a{" "}
            <Code>scrollWidth &gt; clientWidth</Code> check on the
            button&rsquo;s own label element, re-run on resize. Radix focuses
            Cancel automatically when an alert dialog opens, so attaching the
            tooltip unconditionally meant a tooltip repeating the
            button&rsquo;s own words appeared before the user did anything,
            and swallowed the first Escape.
            <br />
            <br />
            Pass a <Code>tooltip</Code> prop explicitly and it{" "}
            <strong className="text-foreground">always</strong> shows,
            clipped or not — an explicit prop says something the button does
            not, so it is the caller&rsquo;s decision rather than a
            measurement. Where a tooltip is showing, the first Escape
            dismisses it and the second answers the dialog: the topmost layer
            takes the key, which is correct.
          </Note>
        </div>
      ),
      source: `<AlertDialogContent size="sm">
  <AlertDialogFooter>
    <AlertDialogCancel>Keep my account open for now</AlertDialogCancel>
    <AlertDialogAction>
      Settle $412.00 and close the account ending 4417
    </AlertDialogAction>
  </AlertDialogFooter>
</AlertDialogContent>`,
    },
    {
      kind: "showcase",
      id: "examples",
      title: "Examples",
      description:
        "Danger Zone — where an Alert Dialog actually lives. A settings page collects its irreversible actions into one bordered region, apart from everything reversible above it, so nothing destructive is ever the next control after a text field. This is a composition built on AlertDialog (components/ds/danger-zone-demo.tsx), not a separate registry item.",
      label: "Settings · Account",
      render: (
        <div className="space-y-6">
          <Panel label="Settings · Account">
            <div className="mx-auto max-w-2xl space-y-8">
              <div>
                <p className="type-h4 text-foreground">Account</p>
                <p className="type-small mt-1 text-muted-foreground">
                  Workspace name, members and billing. Changes here save as you type.
                </p>
              </div>
              <DangerZone />
            </div>
            <p className="type-small mt-6 text-muted-foreground">
              The region is <strong className="text-foreground">bordered, not
              filled</strong>. A red block beside three neutral settings blocks
              reads as an error that has already happened; the hairline and the
              heading say &ldquo;careful&rdquo;, and the tint is spent on the
              button, which is the thing that acts. Confirm it and the button
              spins, a success toast fires, and the row itself changes — because
              a toast is gone in four seconds and the page must still show what
              happened.
            </p>
          </Panel>

          <Panel label="The states that only exist on a bad day">
            <div className="grid gap-6 lg:grid-cols-2">
              <div>
                <p className="type-small mb-3 text-muted-foreground">
                  Unavailable · with the reason
                </p>
                <DangerZone unavailableReason="Settle your $412.00 balance first." />
              </div>
              <div>
                <p className="type-small mb-3 text-muted-foreground">
                  Loading · same footprint
                </p>
                <DangerZone loading />
              </div>
              <div className="lg:col-span-2">
                <p className="type-small mb-3 text-muted-foreground">
                  Rest · for comparison
                </p>
                <DangerZone />
              </div>
            </div>
            <Note tone="error" title="The failure path is a real, injectable seam" className="mt-6">
              <p>
                <Code>DangerZone</Code> takes an <Code>onDelete: () =&gt;
                Promise&lt;void&gt;</Code> prop precisely so its error state is
                reachable with the real component instead of only described in
                prose — reject the promise and the toast, the inline alert and
                the return to rest all happen for real. A destructive button
                whose only tested path is success is the one that ships
                broken.
              </p>
              <p className="mt-3">
                That specimen is not rendered live on this page: an event
                handler is a function, and a function prop cannot cross the
                Server Component boundary this documentation page renders
                from into a Client Component instance — passing one here
                crashes the production build with &ldquo;Event handlers cannot
                be passed to Client Component props&rdquo;. The pattern below
                is exactly what was exercised (and is exercised in this
                system&rsquo;s own component tests) to reach that state:
              </p>
              <pre className="type-code mt-3 overflow-x-auto rounded-lg border border-border bg-card p-4 text-muted-foreground">
{`<DangerZone
  onDelete={() =>
    Promise.reject(new Error("The billing service is offline."))
  }
/>`}
              </pre>
            </Note>
          </Panel>

          <Meta
            items={[
              {
                k: "DangerZone.onDelete",
                v: "() => Promise<void>. The injectable effect. Defaults to a call that resolves, so the happy path needs no wiring; reject it to reach the error state.",
              },
              {
                k: "DangerZone.unavailableReason",
                v: "A sentence. Present = the action is disabled and this says why. The control is exempt from contrast (WCAG 1.4.3); the sentence beside it is not.",
              },
              {
                k: "DangerZone.loading",
                v: "Renders the same row with its content replaced, so the footprint cannot drift.",
              },
              {
                k: "DangerZone states",
                v: "rest · hover / focus / pressed (Button's own) · loading · success · error · disabled. No empty state: a danger zone with no actions is not rendered at all.",
              },
            ]}
          />
        </div>
      ),
      source: `// DangerZone (components/ds/danger-zone-demo.tsx) composes AlertDialog
// exactly like this for its confirming action:
<AlertDialog>
  <AlertDialogTrigger asChild>
    <Button variant="destructive" loading={status === "deleting"}>
      Delete account
    </Button>
  </AlertDialogTrigger>
  <AlertDialogContent>
    <AlertDialogHeader>
      <AlertDialogTitle>Delete your account?</AlertDialogTitle>
      <AlertDialogDescription>
        Your workspace, its 14 members and all 2,480 files are removed
        immediately. Support cannot restore them, and the workspace name
        becomes available to anyone.
      </AlertDialogDescription>
    </AlertDialogHeader>
    <AlertDialogFooter>
      <AlertDialogCancel>Keep my account</AlertDialogCancel>
      <AlertDialogAction onClick={runDelete}>
        Delete my account and all files
      </AlertDialogAction>
    </AlertDialogFooter>
  </AlertDialogContent>
</AlertDialog>`,
    },
    {
      kind: "disclosure",
      id: "api",
      title: "API Reference",
      description:
        "Built on Radix AlertDialogPrimitive. AlertDialogAction and AlertDialogCancel wrap Button asChild rather than forwarding to it directly — see why below.",
      blocks: [
        {
          label: "AlertDialog / AlertDialogTrigger / AlertDialogPortal / AlertDialogOverlay",
          body: (
            <Meta
              items={[
                {
                  k: "AlertDialog",
                  v: "Forwards every prop to Radix AlertDialogPrimitive.Root, with modal forced to true (unlike Dialog, this cannot be made non-modal).",
                },
                {
                  k: "AlertDialogTrigger",
                  v: "Radix AlertDialogPrimitive.Trigger. Pass asChild to make an existing element (typically a Button) the trigger.",
                },
                {
                  k: "AlertDialogPortal / AlertDialogOverlay",
                  v: "Rendered internally by AlertDialogContent; exported for a consumer composing a non-standard layout.",
                },
              ]}
            />
          ),
        },
        {
          label: "AlertDialogContent",
          body: (
            <Meta
              items={[
                {
                  k: "size",
                  v: "\"default\" · \"sm\". Default: \"default\". Both cap at max-w-xs below sm; default grows to sm:max-w-sm, sm stays at max-w-xs and grids its footer into two columns instead of a row.",
                },
                {
                  k: "...props",
                  v: "Every Radix AlertDialogPrimitive.Content prop except onPointerDownOutside and onInteractOutside, which the primitive itself overrides to preventDefault — see Accessibility.",
                },
              ]}
            />
          ),
        },
        {
          label: "AlertDialogHeader / AlertDialogFooter / AlertDialogMedia",
          body: (
            <Meta
              items={[
                {
                  k: "AlertDialogHeader",
                  v: "React.ComponentProps<\"div\">. Deliberately unbanded, unlike DialogHeader — see the note below.",
                },
                {
                  k: "AlertDialogFooter",
                  v: "React.ComponentProps<\"div\">. The one banded zone: a muted, bordered strip holding Cancel and Action.",
                },
                {
                  k: "AlertDialogMedia",
                  v: "React.ComponentProps<\"div\">. A small icon slot beside the title/description, for a glyph rather than a full media lead.",
                },
              ]}
            />
          ),
        },
        {
          label: "AlertDialogTitle / AlertDialogDescription",
          body: (
            <Meta
              items={[
                {
                  k: "AlertDialogTitle",
                  v: "Radix AlertDialogPrimitive.Title. Required — it is what the dialog's accessible name is built from.",
                },
                {
                  k: "AlertDialogDescription",
                  v: "Radix AlertDialogPrimitive.Description. Supplies aria-describedby when present.",
                },
              ]}
            />
          ),
        },
        {
          label: "AlertDialogAction",
          body: (
            <Meta
              items={[
                {
                  k: "variant",
                  v: "Button variant. Default: \"destructive\" — that is what an alert dialog is for. Pass explicitly for the rare irreversible-but-not-destructive case.",
                },
                { k: "size", v: "Button size. Default: \"default\"." },
                {
                  k: "loading",
                  v: "boolean. Default: false. Declared here rather than inherited from Button: this component is a Button asChild, and asChild is exactly the mode where Button hands the job to the child (no spinner, disabled left undefined) because it cannot know what the Slot renders. loading here draws the spinner, sets aria-busy, and disables the real Radix Action so a second press cannot get through while a request is in flight.",
                },
                {
                  k: "tooltip",
                  v: "ReactNode. An explicit label that always shows on hover/focus, truncated or not. Omit it to fall back to the automatic clipped-label tooltip described above.",
                },
                {
                  k: "...props",
                  v: "Forwarded to Radix AlertDialogPrimitive.Action (rendered as DialogPrimitive.Close underneath — clicking it closes the dialog).",
                },
              ]}
            />
          ),
        },
        {
          label: "AlertDialogCancel",
          body: (
            <Meta
              items={[
                { k: "variant", v: "Button variant. Default: \"outline\"." },
                { k: "size", v: "Button size. Default: \"default\"." },
                {
                  k: "tooltip",
                  v: "ReactNode. Same explicit-vs-automatic behaviour as AlertDialogAction's tooltip prop.",
                },
                {
                  k: "...props",
                  v: "Forwarded to Radix AlertDialogPrimitive.Cancel — this is the button Radix focuses automatically when the dialog opens.",
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
        "Built on Radix AlertDialogPrimitive, layered on Radix Dialog — with the outside-dismiss behaviour deliberately removed.",
      blocks: [
        {
          body: (
            <Meta
              items={[
                {
                  k: "Role",
                  v: "role=\"alertdialog\" (not \"dialog\") with aria-modal=\"true\" — the primitive sets this directly on AlertDialogPrimitive.Content, which is what tells assistive tech this dialog demands a response rather than being dismissible incidentally.",
                },
                {
                  k: "Accessible name / description",
                  v: "aria-labelledby and aria-describedby, wired automatically to AlertDialogTitle and AlertDialogDescription the same way Dialog wires its own. AlertDialogTitle is required for the same reason.",
                },
                {
                  k: "Focus on open",
                  v: "AlertDialogContent overrides onOpenAutoFocus to move focus to AlertDialogCancel specifically, not just \"the first focusable element\" — the safe action is what should be easiest to reach immediately after the dialog appears.",
                },
                {
                  k: "Outside dismissal is disabled",
                  v: "AlertDialogContent overrides both onPointerDownOutside and onInteractOutside to event.preventDefault(), read directly from @radix-ui/react-alert-dialog. Clicking the overlay or anywhere outside the panel does nothing — only AlertDialogCancel or AlertDialogAction dismiss it.",
                },
                {
                  k: "Focus trap and return",
                  v: "Inherited from the underlying Dialog primitive: Tab is trapped inside the content while open, and focus returns to the trigger on close.",
                },
                {
                  k: "Background inertness",
                  v: "The rest of the page is marked inert while the alert dialog is open, same as Dialog.",
                },
                {
                  k: "AlertDialogAction loading",
                  v: "Sets aria-busy=\"true\" and a real disabled on the underlying element while pending, so the one destructive action in the system that most needs to resist a double-fire cannot be pressed twice.",
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
                {
                  k: "On open",
                  v: "Focus moves to AlertDialogCancel automatically, not the panel or the first field.",
                },
                {
                  k: "Tab / Shift+Tab",
                  v: "Cycles among the dialog's own focusable elements only — it does not reach the page behind it.",
                },
                {
                  k: "Escape",
                  v: "Not overridden by AlertDialogContent, so it falls through to the same Dialog-primitive default as a plain Dialog: it closes the alert dialog. Where a clipped-label tooltip is currently open on the focused button, the first Escape closes that tooltip only (it is the topmost layer); a second Escape then closes the alert dialog.",
                },
                {
                  k: "Click outside / on the overlay",
                  v: "No effect — deliberately, unlike Dialog. See Accessibility.",
                },
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
        "AlertDialogContent is the one component on this page with real breakpoint behaviour — it caps its own width and grows only from the sm breakpoint, and its footer changes from a grid to a row at the same point.",
      blocks: [
        {
          body: (
            <Meta
              items={[
                {
                  k: "Below sm (< 640px)",
                  v: "Both size=\"default\" and size=\"sm\" are capped at max-w-xs — a narrow phone viewport never sees a wider panel than that, which is why the dialog measured no overflow at 375px.",
                },
                {
                  k: "From sm and up",
                  v: "size=\"default\" grows to sm:max-w-sm; size=\"sm\" stays pinned to max-w-xs — the deliberate difference the Sizes section above documents, for a panel with two long consequences that both need to stay fully readable.",
                },
                {
                  k: "Footer",
                  v: "flex-col-reverse by default (Cancel below Action, so the safe choice is reachable by thumb first on a narrow viewport), switching to sm:flex-row sm:justify-end from 640px. size=\"sm\" overrides this at every width with a two-column grid instead, so its two long labels never queue vertically.",
                },
                {
                  k: "Header alignment",
                  v: "Centered and stacked (place-items-center, text-center) below the sm breakpoint for the default size; from sm it left-aligns (sm:...:place-items-start sm:...:text-left) — a dialog this narrow reads better centered, and one with room reads better left-aligned like the rest of the page.",
                },
                {
                  k: "Clipped-label tooltip",
                  v: "AlertDialogAction/Cancel measure their own scrollWidth vs clientWidth on resize, so the tooltip that surfaces a truncated label attaches or detaches as the viewport (and therefore the button's rendered width) changes — see the Sizes note above.",
                },
                {
                  k: "Measured",
                  v: "No overflow at 375, 768, 1440 or 1920px, no overflow under 200% text zoom, and no overflow under RTL.",
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
