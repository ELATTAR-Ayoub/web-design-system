import { expect, type Page } from "@playwright/test";

/**
 * Helpers for `e2e/batch4.spec.ts`, copied out of `e2e/component-interactions.spec.ts`
 * so the batches could run in parallel:
 * that file is shared and must not be edited, and spec files cannot import
 * from one another, so any helper a batch needs is duplicated into its own
 * `helpers-<label>.ts`. Keep these in sync with the originals only if the
 * originals change for a reason that also applies here — they are copies, not
 * a shared module.
 */

export async function noHorizontalOverflow(page: Page) {
  return page.evaluate(() => ({
    scrollWidth: document.documentElement.scrollWidth,
    /*
     * `clientWidth`, not `window.innerWidth`.
     *
     * On a mobile-shaped context Chrome GROWS the layout viewport to fit an
     * overflowing document, so `innerWidth` moves to meet `scrollWidth` and
     * the comparison is true however far the page overflows. The chat specimen
     * measured 438 against 438 at a 375px viewport and passed — a real
     * overflow, invisible to the assertion written to catch it. `clientWidth`
     * is the layout viewport and does not move.
     */
    innerWidth: document.documentElement.clientWidth,
    /** The widest offender, so a failure names the element rather than a number. */
    widest: (() => {
      let worst = { tag: "", width: 0, cls: "" };
      for (const el of Array.from(document.querySelectorAll<HTMLElement>("*"))) {
        const r = el.getBoundingClientRect();
        if (r.right > window.innerWidth + 1 && r.width > worst.width) {
          worst = {
            tag: el.tagName.toLowerCase(),
            width: Math.round(r.width),
            cls: (el.getAttribute("class") ?? "").slice(0, 120),
          };
        }
      }
      return worst;
    })(),
  }));
}

/** One at-risk element, addressed by a path both browser contexts agree on. */
export type AnimatedNode = { path: string; label: string; visible: boolean };

/**
 * Every element that carries an animation, or a class from a family that does,
 * with whether it is currently visible. Runs in the page.
 */
export function collectAnimated(): AnimatedNode[] {
  /** A structural index path — the two contexts render the same static HTML. */
  const pathOf = (el: Element) => {
    const parts: string[] = [];
    let node: Element | null = el;
    while (node?.parentElement) {
      const i = Array.prototype.indexOf.call(node.parentElement.children, node);
      parts.unshift(`${node.tagName.toLowerCase()}:nth-child(${i + 1})`);
      node = node.parentElement;
    }
    return parts.join(">");
  };

  const isVisible = (el: Element) => {
    const s = getComputedStyle(el);
    const r = el.getBoundingClientRect();
    return (
      parseFloat(s.opacity) > 0 &&
      s.visibility !== "hidden" &&
      s.display !== "none" &&
      r.width > 0 &&
      r.height > 0
    );
  };

  const out: AnimatedNode[] = [];
  for (const el of Array.from(document.querySelectorAll("*"))) {
    const cls = typeof el.className === "string" ? el.className : "";
    const animated =
      getComputedStyle(el).animationName !== "none" ||
      /(?:^|\s)(?:anim-|animate-|shimmer-|foil-|sheen-|bloom-)/.test(cls);
    if (!animated) continue;
    out.push({
      path: pathOf(el),
      label: `${el.tagName.toLowerCase()}.${cls}`.slice(0, 140),
      visible: isVisible(el),
    });
  }
  return out;
}

/** Which of `expected` stopped being visible. Runs in the page. */
export function checkStillVisible(expected: AnimatedNode[]): string[] {
  const gone: string[] = [];
  for (const item of expected) {
    const el = document.querySelector(item.path);
    if (!el) {
      gone.push(`${item.label}  [element missing]`);
      continue;
    }
    const s = getComputedStyle(el);
    const r = el.getBoundingClientRect();
    const visible =
      parseFloat(s.opacity) > 0 &&
      s.visibility !== "hidden" &&
      s.display !== "none" &&
      r.width > 0 &&
      r.height > 0;
    if (!visible) {
      gone.push(
        `${item.label}  [opacity ${s.opacity}, visibility ${s.visibility}, ` +
          `${Math.round(r.width)}x${Math.round(r.height)}, animation ${s.animationName}]`,
      );
    }
  }
  return gone;
}

export async function settleBox(
  panel: ReturnType<Page["locator"]>,
  label: string,
) {
  let last = "";
  await expect
    .poll(
      async () => {
        const b = await panel.boundingBox();
        const now = b
          ? `${Math.round(b.x)},${Math.round(b.y)},${Math.round(b.width)},${Math.round(b.height)}`
          : "";
        const stable = now !== "" && now === last;
        last = now;
        return stable;
      },
      { message: `${label}: the panel never stopped moving`, intervals: [120, 120, 120, 200, 200, 300] },
    )
    .toBe(true);
}
