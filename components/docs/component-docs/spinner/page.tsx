import { SourceMeta } from "@/components/docs/component-page/sections";
import type { ComponentDocSpec } from "@/components/docs/component-page/types";

import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { Code, Meta, Note, Row, StateCell, StateGrid } from "@/components/ds/kit";

import { SpinnerShowcase } from "./spinner-showcase";
import { meta } from "./meta";

export const spec: ComponentDocSpec = {
  name: "spinner",
  omitted: {
    keyboard:
      "Spinner is not focusable and not a control; there is no keyboard behaviour to document.",
    responsive:
      "Spinner has no breakpoint-specific rule in spinner.tsx — it is exactly the size its className gives it at every viewport.",
  },
  sections: [
    {
      kind: "showcase",
      id: "preview",
      title: "Preview",
      description:
        "\"Something is happening, and I cannot tell you how far through.\" Press Request to start a real, unknown-length wait — the spinner and its label appear for as long as the request actually takes, then resolve. Reach for Skeleton instead when the shape of the arriving content is known, and Progress when the total is known.",
      label: "A real pending request",
      render: <SpinnerShowcase />,
      source: `const [status, setStatus] = useState<"idle" | "pending" | "done">("idle");

function requestWithdrawal() {
  setStatus("pending");
  requestWithdrawalFromServer().then(() => setStatus("done"));
}

{status === "pending" && (
  <span className="inline-flex items-center gap-2">
    <Spinner aria-label="Requesting withdrawal" />
    <span className="type-small text-muted-foreground">Requesting…</span>
  </span>
)}`,
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
        "Inside a button, use Button's own loading prop instead of hand-placing a Spinner — it also sets aria-busy, disables the control, and passes aria-hidden down so the state is announced once rather than twice.",
      language: "tsx",
      code: `import { Spinner } from "@/components/ui/spinner";

export function RequestingWithdrawal() {
  return (
    <span className="inline-flex items-center gap-2">
      <Spinner aria-label="Requesting withdrawal" />
      <span className="type-small text-muted-foreground">
        Requesting withdrawal…
      </span>
    </span>
  );
}`,
    },
    {
      kind: "showcase",
      id: "sizes",
      title: "Sizes",
      description:
        "Spinner has no size prop — size it the same way any inline element is sized, with a className. Three sizes side by side here is a size demonstration, not three things loading, so they are marked aria-hidden — the same call a page makes when copy beside the spinner already says \"Loading\".",
      label: "Sized with className",
      render: (
        <Row>
          <Spinner className="size-4" aria-hidden />
          <Spinner className="size-5" aria-hidden />
          <Spinner className="size-6 text-action-ink" aria-hidden />
        </Row>
      ),
      source: `<Spinner className="size-4" aria-hidden />
<Spinner className="size-5" aria-hidden />
<Spinner className="size-6 text-action-ink" aria-hidden />`,
    },
    {
      kind: "showcase",
      id: "examples",
      title: "Examples",
      description:
        "Inside a button, always prefer the loading prop over a hand-placed Spinner.",
      label: "Button's loading prop",
      render: (
        <Row>
          <Button loading>Opening pack</Button>
          <Button variant="premium" loading>
            Processing deposit
          </Button>
        </Row>
      ),
      source: `<Button loading>Opening pack</Button>
<Button variant="premium" loading>Processing deposit</Button>`,
    },
    {
      kind: "disclosure",
      id: "api",
      title: "API Reference",
      blocks: [
        {
          label: "Spinner",
          body: (
            <Meta
              items={[
                {
                  k: "aria-label",
                  v: 'string. Default: "Loading". The live region\'s accessible name and its announced text (see Accessibility) — pass your own when the surrounding context needs a more specific message than "Loading".',
                },
                {
                  k: "aria-hidden",
                  v: 'boolean | "true". When set, the spinner renders decoratively: no role, no aria-label, no announced text. Use it when the surrounding copy already reads "Loading…", or inside a control that carries its own aria-busy (Button loading and AlertDialogAction loading both do) — two announcements of one state is worse than one.',
                },
                {
                  k: "className",
                  v: "Sets the host <span>'s size and colour — every call site passes sizing (size-4, size-6) and, where needed, a tone (text-action-ink). The inner svg fills it via size-full.",
                },
                {
                  k: "...props",
                  v: "Every other native <span> attribute, forwarded directly.",
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
        "Spinner has exactly one visual state — spinning — so this section documents the announced/decorative distinction rather than an interaction state matrix.",
      blocks: [
        {
          body: (
            <StateGrid cols={4}>
              <StateCell label="announced" note='role="status", real text'>
                <Spinner aria-label="Loading" />
              </StateCell>
              <StateCell label="decorative" note="aria-hidden, no announcement">
                <Spinner aria-hidden />
              </StateCell>
            </StateGrid>
          ),
        },
        {
          body: (
            <Note tone="error" title="It took two fixes to actually announce anything">
              <p>
                This component already wrote{" "}
                <Code>role=&quot;status&quot;</Code> and{" "}
                <Code>aria-label=&quot;Loading&quot;</Code> for as long as it
                existed and announced neither:{" "}
                <Code>Icon</Code> destructured the five props it knew about
                and forwarded nothing, so the role, the label and{" "}
                <Code>data-slot=&quot;spinner&quot;</Code> were all dropped on
                the way to the <Code>&lt;svg&gt;</Code>. Nothing could catch
                it — the class list was right and the role was there in the
                source. Found by asserting the rendered role rather than
                reading the file.
              </p>
              <p className="mt-2">
                Delivering those attributes was still not enough. A live
                region announces its <em>contents</em>, not its accessible
                name — so a <Code>role=&quot;status&quot;</Code> element with
                only an <Code>aria-label</Code> on it is a named,{" "}
                <em>empty</em> region, and a screen reader has nothing to
                read when it mounts. The role now sits on a{" "}
                <Code>&lt;span&gt;</Code> with visually hidden words inside
                it, and it keeps the label as well — <Code>status</Code> is
                not a name-from-content role, so without the label there is
                no name, and without the text there is nothing to announce.
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
        "Both the role and the announced text live on the host <span> — not the inner svg — because that is the only element that can carry both a name and content.",
      blocks: [
        {
          body: (
            <Meta
              items={[
                {
                  k: "Role",
                  v: 'status (live, polite) on the host <span>, unless aria-hidden is set — then no role at all.',
                },
                {
                  k: "Accessible name and content",
                  v: 'Both required and both present: aria-label (default "Loading") gives the region its name, and a visually hidden (sr-only) span with the same text gives it something to announce. Neither substitutes for the other — a status role announces its contents, not its name.',
                },
                {
                  k: "Decoration",
                  v: "Passing aria-hidden removes the role, the label and the hidden text together — the glyph becomes pure decoration for a context that announces the loading state some other way.",
                },
                {
                  k: "Reduced motion",
                  v: "The glyph's spin is anim-spin, subject to the reduced-motion blanket rule in styles/motion.css — the spinner stops turning but the status role and its announced text are unaffected, so the loading state is still communicated to assistive tech.",
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

