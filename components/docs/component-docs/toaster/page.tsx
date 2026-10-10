import { SourceMeta } from "@/components/docs/component-page/sections";
import type { ComponentDocSpec } from "@/components/docs/component-page/types";

import { Code, Meta, Note, StateCell, StateGrid } from "@/components/ds/kit";
import { ToastPreview, ToastPreviewStack } from "@/components/ds/toast-preview";

import { ToasterShowcase } from "./toaster-showcase";
import { meta } from "./meta";

export const spec: ComponentDocSpec = {
  name: "toaster",
  omitted: {
    sizes:
      "A toast has no size prop or size ladder — one footprint, sized by its content. Documenting a Sizes section would either invent a prop that doesn't exist or repeat the Variants section under a different heading.",
    responsive:
      "This app's root layout mounts <Toaster position=\"top-center\" /> with no mobileOffset override, so the position is uniform across breakpoints. sonner does expose a mobileOffset prop for a viewport-specific override, but it is not set anywhere in this repository, and documenting a behaviour this project does not configure would be inventing one.",
  },
  sections: [
    {
      kind: "showcase",
      id: "preview",
      title: "Preview",
      description:
        "Transient confirmation of something the user just did. Press a button and a real toast fires — the genuine .cn-toast markup, in the corner sonner actually puts it, gone in four seconds. \"Withdraw\" runs toast.promise, which owns its own type transition: loading first, then success once the (simulated) request settles.",
      label: "Fire a real toast",
      render: <ToasterShowcase />,
      source: `toast.success("Sold 3 cards for $2,481.00", {
  description: "Credited to your available balance.",
});

toast("Added to favourites");

toast.warning("Only 12 packs left in this print run");

toast.error("Could not reach the vault", {
  description: "Nothing was charged. Try again in a moment.",
  action: { label: "Retry", onClick: () => reconnect() },
});

toast.promise(requestWithdrawal(), {
  loading: "Requesting withdrawal…",
  success: "Withdrawal requested",
  error: "Request failed",
});`,
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
        "Mount <Toaster /> once, in the root layout — position and theme are configured there, so no screen can move them. Fire a toast from anywhere else by calling toast(), imported directly from sonner.",
      language: "tsx",
      code: `// app/layout.tsx — mounted once
import { Toaster } from "@/components/ui/toaster";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        {children}
        <Toaster position="bottom-right" />
      </body>
    </html>
  );
}

// anywhere else — fire one
import { toast } from "sonner";

function onSell() {
  toast.success("Sold 3 cards for $2,481.00", {
    description: "Credited to your available balance.",
  });
}`,
    },
    {
      kind: "showcase",
      id: "variants",
      title: "Variants",
      description:
        "Five types. Each sets two hues on the bloom and nothing else — bloom-cosmic is shared with Alert, two layers drifting at different speeds (a deep field over 18s, a brighter near field over 11s) so the surface reads as two distances instead of one flat wash. It is CSS rather than a ShaderSurface because sonner builds the live toast and offers nowhere to mount a canvas, and a 160×72 zone renders at 80×36 — too few pixels for a noise field.",
      label: "All five types",
      render: (
        <ToastPreviewStack>
          <ToastPreview type="default" title="Added to favourites" />
          <ToastPreview
            type="success"
            title="Sold 3 cards for $2,481.00"
            description="Credited to your available balance."
          />
          <ToastPreview
            type="error"
            title="Could not reach the vault"
            description="Nothing was charged. Try again in a moment."
            action="Retry"
          />
          <ToastPreview type="warning" title="Only 12 packs left in this print run" />
          <ToastPreview
            type="loading"
            title="Requesting withdrawal…"
            description="This usually takes a few seconds."
          />
        </ToastPreviewStack>
      ),
      source: `<ToastPreview type="default" title="Added to favourites" />
<ToastPreview type="success" title="Sold 3 cards for $2,481.00" description="Credited to your available balance." />
<ToastPreview type="error" title="Could not reach the vault" description="Nothing was charged. Try again in a moment." action="Retry" />
<ToastPreview type="warning" title="Only 12 packs left in this print run" />
<ToastPreview type="loading" title="Requesting withdrawal…" description="This usually takes a few seconds." />`,
    },
    {
      kind: "showcase",
      id: "examples",
      title: "Examples",
      description:
        "The five call shapes that produce the specimens above, plus toast.promise — the one call that owns its own type transition as the promise settles.",
      label: "Every call shape",
      render: (
        <div className="space-y-4">
          <ToastPreviewStack>
            <ToastPreview
              type="loading"
              title="Requesting withdrawal…"
              description="This usually takes a few seconds."
            />
          </ToastPreviewStack>
          <p className="type-small text-muted-foreground">
            <code className="type-code">toast.promise</code> shows this loading
            toast immediately, then swaps its type and text for the resolved
            state — success or error — once the promise settles. It is one
            toast changing shape, not two toasts.
          </p>
        </div>
      ),
      source: `toast("Added to favourites");

toast.success("Sold 3 cards for $2,481.00", {
  description: "Credited to your available balance.",
});

toast.error("Could not reach the vault", {
  description: "Nothing was charged. Try again in a moment.",
  action: { label: "Retry", onClick: () => retry() },
});

toast.warning("Only 12 packs left in this print run");

toast.promise(requestWithdrawal(), {
  loading: "Requesting withdrawal…",
  success: "Withdrawal requested",
  error: "Request failed",
});`,
    },
    {
      kind: "disclosure",
      id: "api",
      title: "API Reference",
      description:
        "Toaster wraps sonner's own Toaster and forwards every prop; toast() is sonner's own function, re-exported by no one — it is imported straight from the sonner package. Read from components/ui/toaster.tsx and the sonner package's own type declarations.",
      blocks: [
        {
          label: "Toaster (components/ui/toaster.tsx)",
          body: (
            <Meta
              items={[
                {
                  k: "theme",
                  v: "Not exposed as a caller prop in this file — Toaster reads next-themes' resolvedTheme itself and passes the concrete \"light\" or \"dark\" to sonner, so a caller cannot pass \"system\" and get a mismatched sonner palette.",
                },
                {
                  k: "icons",
                  v: "Not overridable per call site here — set once from TOAST_ICONS (success, info, warning, error, loading), so the live toaster and the ToastPreview specimens on this page cannot drift apart.",
                },
                {
                  k: "toastOptions.classNames.toast",
                  v: '"cn-toast bloom-cosmic", fixed — every visual rule lives in the .cn-toast block in globals.css.',
                },
                {
                  k: "...props (ToasterProps, forwarded to sonner)",
                  v: "position (default \"bottom-right\" in this app's root layout), duration, expand, gap, visibleToasts, closeButton, richColors, invert, offset, mobileOffset, hotkey (default [\"altKey\",\"KeyT\"]), swipeDirections, dir, containerAriaLabel (default \"Notifications\"), className, style. Every one of these is sonner's own prop, forwarded unmodified.",
                },
              ]}
            />
          ),
        },
        {
          label: "toast() (from \"sonner\")",
          body: (
            <Meta
              items={[
                {
                  k: "toast(message, data?)",
                  v: "Default/neutral toast. message: ReactNode. data: ExternalToast — description, action, cancel, duration, icon, id, onDismiss, onAutoClose, and more.",
                },
                {
                  k: "toast.success / .info / .warning / .error / .message",
                  v: "Same signature as toast(), typed to the matching TOAST_ICONS glyph.",
                },
                {
                  k: "toast.loading(message, data?)",
                  v: "Shows the loading type and spinner icon. Used directly, or as the opening state of toast.promise.",
                },
                {
                  k: "toast.promise(promise, { loading, success, error, description?, finally? })",
                  v: "Shows loading immediately, then re-renders the same toast as success or error once the promise settles. success and error may be a string or a function of the resolved/rejected value.",
                },
                {
                  k: "toast.custom(jsx, data?)",
                  v: "Renders caller-supplied JSX instead of the built-in title/description layout.",
                },
                {
                  k: "toast.dismiss(id?)",
                  v: "Dismisses one toast by id, or every toast when called with no argument.",
                },
              ]}
            />
          ),
        },
        {
          label: "TOAST_ICONS / ToastType",
          body: (
            <p className="type-small text-muted-foreground">
              <Code>TOAST_ICONS</Code> maps <Code>success · info · warning ·
              error · loading</Code> to their Lucide glyph, exported so{" "}
              <Code>ToastPreview</Code> on this page cannot show a different
              icon than the live toaster does. <Code>ToastType</Code> is that
              key set, plus <Code>&quot;default&quot;</Code> for the icon-less
              neutral toast.
            </p>
          ),
        },
      ],
    },
    {
      kind: "disclosure",
      id: "states",
      title: "States",
      description:
        "A toast is not a control, and its five types are meanings rather than interaction states — the same reasoning as Alert's variants.",
      blocks: [
        {
          body: (
            <StateGrid cols={5}>
              <StateCell label="default" note="Neutral confirmation">
                <ToastPreviewStack>
                  <ToastPreview type="default" title="Added to favourites" />
                </ToastPreviewStack>
              </StateCell>
              <StateCell label="success">
                <ToastPreviewStack>
                  <ToastPreview type="success" title="Sold 3 cards for $2,481.00" />
                </ToastPreviewStack>
              </StateCell>
              <StateCell label="warning">
                <ToastPreviewStack>
                  <ToastPreview type="warning" title="Only 12 packs left" />
                </ToastPreviewStack>
              </StateCell>
              <StateCell label="error" note="destructive">
                <ToastPreviewStack>
                  <ToastPreview type="error" title="Could not reach the vault" />
                </ToastPreviewStack>
              </StateCell>
              <StateCell label="loading">
                <ToastPreviewStack>
                  <ToastPreview type="loading" title="Requesting withdrawal…" />
                </ToastPreviewStack>
              </StateCell>
            </StateGrid>
          ),
        },
        {
          body: (
            <Note tone="action" title="Reading the rest of the state model">
              <p>
                <strong>hover</strong> expands the stack (sonner&rsquo;s{" "}
                <Code>expand</Code> behaviour) rather than the toast itself
                changing appearance. <strong>focus-visible</strong> and{" "}
                <strong>pressed</strong> apply only to the action button a
                toast can carry — a real <Code>Button</Code>-shaped element,
                audited on its own page. <strong>disabled</strong> is N/A: a
                toast is not a control that can be turned off, only dismissed.
              </p>
              <p className="mt-2">
                <strong>empty</strong> is N/A the same way it is for Alert: a
                toast either has a title (and optional description) or it was
                never fired.
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
        "The live-region behaviour is sonner's own and is not reimplemented in this repository — documented here from sonner's own source rather than assumed.",
      blocks: [
        {
          body: (
            <Meta
              items={[
                {
                  k: "Live region",
                  v: 'The toast list container carries aria-live="polite" and an accessible name from containerAriaLabel (default "Notifications") combined with the active hotkey label — announced at the next pause, not interrupting.',
                },
                {
                  k: "Per-toast focus",
                  v: "Each toast is tabIndex={0}, so it can be reached and dismissed by keyboard once the list has focus.",
                },
                {
                  k: "Dismissal",
                  v: "A close button (when closeButton is set) or the toast's own action button is a real <button>; swipe-to-dismiss is a pointer/touch gesture with no keyboard equivalent beyond Escape (see Keyboard).",
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
      description:
        "Read from sonner's own source (node_modules/sonner) rather than assumed from its behaviour.",
      blocks: [
        {
          body: (
            <Meta
              items={[
                {
                  k: "Alt+T",
                  v: "sonner's default hotkey (configurable via the hotkey prop) — moves focus into the toast list.",
                },
                {
                  k: "Tab / Shift+Tab",
                  v: "Once the list has focus, moves between toasts and any action/close buttons they carry.",
                },
                {
                  k: "Escape",
                  v: "Blurs the toast list when focus is inside it or on the list itself, returning focus to what the user was doing before.",
                },
                {
                  k: "Enter / Space",
                  v: "Activates a focused action or close button (native <button> behaviour) — no custom handling.",
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
