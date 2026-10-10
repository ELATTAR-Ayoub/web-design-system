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

function ShowcaseBlock({ section }: { section: ShowcaseSection }) {
  return (
    <PreviewCode
      label={section.label ?? section.title}
      source={section.source}
      flush={section.flush}
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

function DisclosureBlocks({ section }: { section: DisclosureSection }) {
  return (
    <div className="space-y-8">
      {section.blocks.map((block, index) => (
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

export function DocSectionBody({
  section,
  name,
}: {
  section: DocSection;
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
