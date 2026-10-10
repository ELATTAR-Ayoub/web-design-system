/**
 * The five section renderers.
 *
 * Each one composes `components/ds/kit.tsx` — the documentation furniture this
 * repository already had — rather than re-drawing panels, code blocks and
 * definition lists. Nothing here declares a colour, a size, a radius or a
 * duration: every class is a token-backed utility or a `.type-*` role.
 *
 * `InstallBlock` is the section worth reading closely. It is the only place in
 * the documentation that may print a delivery instruction, and it DERIVES that
 * instruction from `lib/ds/platform-contract.ts` and the generated
 * `public/r/commands.json`. A page cannot pass it a command. That closes the
 * failure the audit found: pages printing `npx shadcn add <name>` for
 * dependency items, CSS capabilities and npm packages alike, none of which
 * resolve.
 */

import { CodeBlock } from "@/components/ds/code-block";
import { Code, CommandBlock, Meta } from "@/components/ds/kit";

import { PreviewCode } from "./preview-code";
import { contractEntry, type ContractEntry } from "@/lib/ds/platform-contract";
import { commandFor } from "@/lib/ds/registry";
import { cn } from "@/lib/utils";

import type {
  DisclosureSection,
  DocSection,
  EffectSection,
  InstallSection,
  ShowcaseSection,
  SnippetSection,
} from "./types";

/* ── Showcase ─────────────────────────────────────────────────────────────── */

function ShowcaseBlock({ section }: { section: ShowcaseSection }) {
  return (
    <PreviewCode
      label={section.label ?? section.title}
      source={section.source}
      flush={section.flush}
      /* The Preview section's stage has a floor (`--height-doc-stage`, 640px)
         and centres its specimen vertically in it; every other stage is sized
         by its content. `wide` (ShowcaseSection's own field — see
         types.ts) drops the ordinary `max-w-3xl` cap for a specimen that
         lays out by its own container width and needs the article's full
         measure to ever reach its wider layouts. */
      stageClassName={
        section.id === "preview"
          ? section.wide
            ? "flex min-h-(--height-doc-stage) flex-col *:w-full"
            : "flex min-h-(--height-doc-stage) flex-col items-center justify-center *:w-full *:max-w-3xl"
          : undefined
      }
    >
      {section.render}
    </PreviewCode>
  );
}

/* ── Effect ───────────────────────────────────────────────────────────────── */

function EffectBlock({ section }: { section: EffectSection }) {
  return (
    <PreviewCode
      label={section.label ?? section.title}
      note={section.appliedAs}
      source={section.source}
      stageClassName={
        section.id === "preview"
          ? "flex min-h-(--height-doc-stage) flex-col items-center justify-center *:w-full *:max-w-3xl"
          : undefined
      }
    >
      {section.render}
    </PreviewCode>
  );
}

/* ── Snippet and shared source rendering ──────────────────────────────────── */

/**
 * The source beneath a specimen.
 *
 * `CodeBlock` rather than the kit's `CommandBlock`: `CommandBlock` is
 * deliberately bash-only, because the one thing it renders is an install
 * command. Source is not a command, and giving `CommandBlock` a `language`
 * prop to serve both would erase the distinction the Install section depends
 * on. Both compose the same base `CodeBlock`, so the copy affordance and its
 * two-signal feedback are identical either way.
 */
function SourceBlock({ code, language = "tsx" }: { code: string; language?: string }) {
  return (
    <div className="mt-4">
      <CodeBlock
        code={code}
        language={language}
        className="rounded-lg border border-border"
      />
    </div>
  );
}

function SnippetBlock({ section }: { section: SnippetSection }) {
  return <SourceBlock code={section.code} language={section.language ?? "tsx"} />;
}

/* ── Install ──────────────────────────────────────────────────────────────── */

/**
 * What this item's delivery actually is, in the system's own words.
 *
 * One branch per `Delivery` and per non-installable `Ownership`, so a reader is
 * never told to run a command that does not exist. The four honest answers a
 * page can give:
 *
 *   - a direct install target prints its real, generated command;
 *   - a dependency names the owner that brings it;
 *   - a CSS capability names the foundation item that delivers the stylesheet;
 *   - a package or browser capability names the package or the API.
 */
function deliveryFor(entry: ContractEntry): {
  headline: string;
  command?: string;
  detail: string;
} {
  if (entry.delivery === "package-native") {
    return {
      headline: "Delivered by a package, not by the registry",
      detail:
        "This capability is not an Elattar component. It is documented here because Flutter models it as a registry item and the web equivalent has to be findable under the same name — but on the web it is behaviour you get from a dependency the project already has, and wrapping it in a React component to make the two catalogues the same length would add a file that does nothing.",
    };
  }

  if (entry.delivery === "browser-native") {
    return {
      headline: "Delivered by the browser",
      detail:
        "No install. This is a browser API, reached through a small module in this repository rather than through a component. It is listed so the capability is findable under its shared name; there is nothing to add to a project that a browser does not already provide.",
    };
  }

  if (entry.delivery === "composition") {
    return {
      headline: "Already here, as a composition",
      detail:
        "Nothing to install, and nothing to add. Flutter models this as one capability; on the web it is what you get by composing components this system already ships, and building a second thing under this name would give the system two ways to do what it does once. The components to compose are named below.",
    };
  }

  if (entry.ownership === "dependency") {
    return {
      headline: "Installed as a dependency, not on its own",
      detail:
        "The registry resolves this item, but it is not an advertised install target: it arrives with whatever owns it. Installing the owner brings this source with it, at the right version, with its own dependencies resolved.",
    };
  }

  if (entry.delivery === "css-native") {
    return {
      headline: "Delivered by the foundation stylesheet",
      command: commandFor("source-foundation"),
      detail:
        "There is no component file, and there should not be one: this capability is a class and its tokens, defined under styles/ and shipped with the foundation. A .tsx wrapper that forwarded className and children would be a file with no behaviour in it.",
    };
  }

  return {
    headline:
      entry.ownership === "block"
        ? "Installs as one complete block"
        : entry.ownership === "foundation"
          ? "The foundation every other item depends on"
          : "Install directly",
    command: commandFor(entry.name),
    detail:
      entry.ownership === "block"
        ? "One command brings the whole composition and every part it is built from. The parts are registry dependencies rather than separate products, so this is the supported way to take it."
        : entry.ownership === "foundation"
          ? "The four stylesheets, the globals entry and the shared configuration. Every other item assumes this is already installed."
          : "Resolved through the @elattar namespace declared in components.json, so the command needs no server address.",
  };
}

function InstallBlock({
  section,
  entry,
}: {
  section: InstallSection;
  entry: ContractEntry;
}) {
  const delivery = deliveryFor(entry);
  return (
    <>
      <p className="type-body text-foreground">{delivery.headline}</p>
      <p className="type-small mt-2 max-w-2xl text-muted-foreground">{delivery.detail}</p>
      {delivery.command && (
        <div className="mt-5">
          <CommandBlock command={delivery.command} />
        </div>
      )}
      {section.notes && <div className="mt-5">{section.notes}</div>}
    </>
  );
}

/* ── Disclosure ───────────────────────────────────────────────────────────── */

function DisclosureBlocks({ section }: { section: DisclosureSection }) {
  return (
    <div className="space-y-8">
      {section.blocks.map((block, index) => (
        // `scroll-mt` on the anchored block, not on its heading: the id has to
        // be on the element the rail links to, and that element has to come to
        // rest clear of the sticky header. `--scroll-offset` is the same
        // measure `DsSection` uses, so a nested anchor and a section anchor
        // land at the same height.
        <div
          key={block.anchor ?? block.label ?? index}
          id={block.anchor}
          className={block.anchor ? "scroll-mt-(--scroll-offset)" : undefined}
        >
          {block.label && (
            <h3 className="type-h4 mb-3 text-foreground">{block.label}</h3>
          )}
          {block.body}
        </div>
      ))}
    </div>
  );
}

/* ── Dispatch ─────────────────────────────────────────────────────────────── */

/**
 * Render one section.
 *
 * The `switch` is exhaustive over the closed union, so adding a sixth section
 * type is a typecheck failure here rather than a silently unrendered section
 * on ninety pages.
 */
export function DocSectionBody({
  section,
  name,
}: {
  section: DocSection;
  /** The catalog item, so `install` can read its ownership. */
  name: string;
}) {
  switch (section.kind) {
    case "showcase":
      return <ShowcaseBlock section={section} />;
    case "effect":
      return <EffectBlock section={section} />;
    case "snippet":
      return <SnippetBlock section={section} />;
    case "disclosure":
      return <DisclosureBlocks section={section} />;
    case "install": {
      const entry = contractEntry(name);
      if (!entry) {
        // Unreachable through the route, which resolves the entry before
        // rendering. Kept as a visible statement rather than a thrown error so
        // one bad name cannot blank a page in production.
        return (
          <p className="type-small text-muted-foreground">
            No contract entry for <Code>{name}</Code>.
          </p>
        );
      }
      return <InstallBlock section={section} entry={entry} />;
    }
  }
}

/** A definition list of an item's public exports and source path. */
export function SourceMeta({
  sourcePath,
  exports,
  className,
}: {
  sourcePath: string | null;
  exports: readonly string[];
  className?: string;
}) {
  return (
    <Meta
      className={cn(className)}
      items={[
        {
          k: "Source",
          v: sourcePath ? <Code>{sourcePath}</Code> : "No source file — see Installation.",
        },
        {
          k: "Exports",
          v:
            exports.length > 0 ? (
              <span className="flex flex-wrap gap-2">
                {exports.map((name) => (
                  <Code key={name}>{name}</Code>
                ))}
              </span>
            ) : (
              "None — this capability has no JavaScript surface."
            ),
        },
      ]}
    />
  );
}
