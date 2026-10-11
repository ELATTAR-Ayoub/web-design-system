/**
 * Shared assertions for the component-audit tests.
 *
 * jsdom has no stylesheet and no `:focus-visible` resolution, so "the ring is
 * there" cannot be measured here — it is measured in the Playwright suite. What
 * this file asserts is the weaker, still-useful claim the unit layer *can*
 * make: the element carries a `focus-visible:` ring declaration at all, and the
 * keyboard actually lands on it. A control that lost its ring class fails here;
 * a control whose ring is painted the wrong colour fails in e2e.
 *
 * Lives at `test/components/` rather than inside one batch folder because
 * batches 1 (controls) and 2 (overlays) both use it.
 */

export function expectFocusRing(el: Element) {
  const cls = el.getAttribute("class") ?? "";
  if (!/focus-visible:ring/.test(cls)) {
    throw new Error(
      `expected a focus-visible ring declaration on <${el.tagName.toLowerCase()}>, got: ${cls}`,
    );
  }
}

/**
 * The 44px floor from RULES §7 cannot be read from jsdom either — nothing is
 * laid out. What is checkable here is that the control does not pin itself to a
 * fixed height that forbids growing to the floor: `h-*` is a ceiling as well as
 * a floor, `min-h-*` is not.
 */
export function expectNoFixedHeight(el: Element) {
  const cls = el.getAttribute("class") ?? "";
  // Unprefixed only: `file:h-7` sizes the file-picker button inside the field,
  // not the field, and a variant-scoped height is a different claim.
  const fixed = cls.match(/(?:^|\s)h-\d+(\.\d+)?(?![\w-])/);
  if (fixed) {
    throw new Error(
      `expected no fixed text height on <${el.tagName.toLowerCase()}>, found "${fixed[0]}" in: ${cls}`,
    );
  }
}

/**
 * axe options for an OPEN overlay, running over the whole `document.body`
 * because every Radix overlay portals out of the render container.
 *
 * Two rules are disabled BY NAME, and this is the whole list. Everything else
 * axe knows still runs over the entire document, which is where a missing name,
 * a wrong role or a bad contrast pair in our own markup shows up.
 *
 * `aria-hidden-focus` — Radix builds its focus trap out of two
 * `data-radix-focus-guard` sentinels (`tabindex="0"` + `aria-hidden="true"`)
 * and marks the rest of the document `aria-hidden` while a modal is open:
 *
 *   "ARIA hidden element must not be focusable or contain focusable elements"
 *   <span data-radix-focus-guard tabindex="0" aria-hidden="true">
 *   <div data-aria-hidden="true" aria-hidden="true">   ← the backgrounded page
 *
 * Neither element is ours and neither is reachable from a wrapper: the guards
 * are how `react-focus-guards` wraps focus at the ends of the trap, and hiding
 * the background is the behaviour that makes a modal modal. Changing either
 * means forking the primitive, which RULES §5 forbids.
 *
 * `region` — asks whether all page content sits inside a landmark, which is a
 * claim about a *page*. These tests mount a fragment into a bare jsdom
 * `<body>`, so it fires for every portalled overlay whatever the component
 * does. Landmarks belong to the specimen routes and are checked there.
 *
 * Both exclusions are deliberate, so no test here claims a clean axe run it
 * did not have.
 */
export const OVERLAY_AXE_OPTIONS = {
  rules: {
    "aria-hidden-focus": { enabled: false },
    region: { enabled: false },
  },
} as const;
