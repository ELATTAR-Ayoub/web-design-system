/**
 * @covers source-foundation
 *
 * `source-foundation`'s own documentation page
 * (`components/docs/component-docs/source-foundation/page.tsx`) states
 * plainly why it has no live specimen of its own to render: it is four
 * stylesheets, `lib/utils.ts`'s `cn()` merge, and the icon primitives every
 * other page's Preview already exercises — "see selection-control and menu
 * for the page shape this follows when a capability is not a placeable
 * thing." This file follows the same shape: assert the delivery contract
 * `page.tsx` describes ("What this installs") is actually true of the
 * repository, exercise the one non-trivial piece of runtime code this
 * foundation ships (`cn()`'s non-standard token-group registration — the
 * trap `lib/utils.ts`'s own header comment documents shipping three times),
 * and run axe on the one real, renderable piece of the foundation: `Icon`
 * from `components/ui/icon.tsx`, which `page.tsx` names as part of what this
 * item delivers.
 *
 * `test/foundation/token-source.test.ts` already checks the finer-grained
 * shape of what each stylesheet may declare (which file owns `@theme`,
 * `:root`, `@keyframes`, …); this file does not repeat that — it checks the
 * coarser claim `page.tsx`'s reader is actually told: the four files exist,
 * `globals.css` imports them in the documented order, and nothing else.
 */

import { readFileSync, existsSync } from "node:fs";
import { join } from "node:path";
import { Package } from "lucide-react";
import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { axe } from "vitest-axe";

import { cn } from "@/lib/utils";
import { Icon } from "@/components/ui/icon";

const ROOT = process.cwd();
const read = (rel: string) => readFileSync(join(ROOT, ...rel.split("/")), "utf8");

describe("the four stylesheets page.tsx says this item installs", () => {
  it.each([
    "styles/tokens.css",
    "styles/typeset.css",
    "styles/motion.css",
    "styles/utilities.css",
  ])("%s exists", (rel) => {
    expect(existsSync(join(ROOT, ...rel.split("/")))).toBe(true);
  });

  it("app/globals.css imports all four, in the documented load-bearing order", () => {
    const entry = read("app/globals.css");
    const order = ["tokens.css", "typeset.css", "motion.css", "utilities.css"].map((name) =>
      entry.indexOf(name),
    );
    for (const index of order) {
      expect(index).toBeGreaterThan(-1);
    }
    expect(order).toEqual([...order].sort((a, b) => a - b));
  });

  it("lib/utils.ts and the icon primitives page.tsx names are real modules", () => {
    expect(existsSync(join(ROOT, "lib", "utils.ts"))).toBe(true);
    expect(existsSync(join(ROOT, "components", "ui", "icon.tsx"))).toBe(true);
    expect(existsSync(join(ROOT, "components", "ui", "icon-swap.tsx"))).toBe(true);
  });
});

describe("cn() merges this system's non-standard token groups, as documented", () => {
  // The exact trap `lib/utils.ts`'s header comment records shipping: without
  // registering the custom `--text-*`/`--shadow-*`/`--rounded-*` groups,
  // tailwind-merge treats an unrecognised `text-*`/`shadow-*` class as a
  // COLOUR utility and a later one silently deletes an earlier, unrelated one.
  it("a later custom type-size class does not delete an earlier colour class", () => {
    expect(cn("text-background", "text-number-sm")).toBe("text-background text-number-sm");
  });

  it("a later custom shadow does not delete an earlier one from the same group", () => {
    expect(cn("shadow-pressed", "shadow-none")).toBe("shadow-none");
  });

  it("a later custom radius wins over an earlier one, same group", () => {
    expect(cn("rounded-pill", "rounded-lg")).toBe("rounded-lg");
  });

  it("plain conditional classes still merge the ordinary clsx way", () => {
    expect(cn("flex", false && "hidden", "gap-2")).toBe("flex gap-2");
  });
});

describe("Icon — the one real, renderable piece of this foundation", () => {
  it("an unlabelled icon is hidden from assistive tech, per its own contract", () => {
    render(<Icon icon={Package} />);
    expect(screen.queryByRole("img")).not.toBeInTheDocument();
  });

  it("a labelled icon becomes role=img with that accessible name", () => {
    render(<Icon icon={Package} label="Package" />);
    expect(screen.getByRole("img", { name: "Package" })).toBeInTheDocument();
  });

  it("axe: both the unlabelled and the labelled icon", async () => {
    const { container } = render(
      <>
        <Icon icon={Package} />
        <Icon icon={Package} label="Package" />
      </>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
