/**
 * The Typeset catalog is the ONE list of the 17 public roles — both
 * `/design-system/typography` renders it; the old `/design-system/docs/typeset`
 * URL redirects there rather than maintaining a second role list.
 *
 * Contract asserted here: the first thing the catalog renders is a
 * CONTINUOUS preview of all 17 roles, each in its own class, in the exact
 * canonical order — and only after that do the grouped Words / Code /
 * Numerics detail sections appear. Exact membership: no role missing, none
 * extra, nothing duplicated.
 */

import { describe, expect, it } from "vitest";
import { render, within } from "@testing-library/react";

import { TYPESET_ROLES, TypesetCatalog } from "@/components/ds/typeset-catalog";

const CANONICAL_ORDER = [
  "display",
  "h1",
  "h2",
  "h3",
  "h4",
  "lead",
  "body",
  "small",
  "nav",
  "badge",
  "code",
  "identifier",
  "number-sm",
  "number-base",
  "number-md",
  "number-lg",
  "number-xl",
];

describe("TYPESET_ROLES", () => {
  it("is exactly the 17 public roles, in canonical order", () => {
    expect(TYPESET_ROLES.map((r) => r.cls)).toEqual(CANONICAL_ORDER);
  });
});

describe("<TypesetCatalog />", () => {
  it("renders a continuous preview of all 17 roles, in canonical order, before the detail groups", () => {
    const { container } = render(<TypesetCatalog />);

    const preview = container.querySelector('[data-testid="typeset-continuous-preview"]');
    const groups = container.querySelector('[data-testid="typeset-detail-groups"]');
    expect(preview, "no continuous preview rendered").toBeTruthy();
    expect(groups, "no detail groups rendered").toBeTruthy();

    // Continuous preview comes first in the DOM.
    expect(
      !!(preview!.compareDocumentPosition(groups!) & Node.DOCUMENT_POSITION_FOLLOWING),
    ).toBe(true);

    const roleEls = within(preview as HTMLElement).getAllByTestId("typeset-role");
    expect(roleEls.map((el) => el.getAttribute("data-role"))).toEqual(CANONICAL_ORDER);
    expect(roleEls).toHaveLength(17);
  });

  it("groups the detail sections into exactly Words, Code, Numerics — after the continuous preview", () => {
    const { container } = render(<TypesetCatalog />);
    const groups = container.querySelector('[data-testid="typeset-detail-groups"]');
    expect(groups).toBeTruthy();

    const words = within(groups as HTMLElement).getByTestId("typeset-group-words");
    const code = within(groups as HTMLElement).getByTestId("typeset-group-code");
    const numerics = within(groups as HTMLElement).getByTestId("typeset-group-numerics");

    // Words, then Code, then Numerics.
    expect(!!(words.compareDocumentPosition(code) & Node.DOCUMENT_POSITION_FOLLOWING)).toBe(true);
    expect(!!(code.compareDocumentPosition(numerics) & Node.DOCUMENT_POSITION_FOLLOWING)).toBe(
      true,
    );

    // Exact membership per group, nothing extra.
    expect(within(words).getAllByTestId("typeset-role").map((el) => el.getAttribute("data-role"))).toEqual(
      ["display", "h1", "h2", "h3", "h4", "lead", "body", "small", "nav", "badge"],
    );
    expect(within(code).getAllByTestId("typeset-role").map((el) => el.getAttribute("data-role"))).toEqual(
      ["code", "identifier"],
    );
    expect(
      within(numerics).getAllByTestId("typeset-role").map((el) => el.getAttribute("data-role")),
    ).toEqual(["number-sm", "number-base", "number-md", "number-lg", "number-xl"]);
  });
});
