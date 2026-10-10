import "@testing-library/jest-dom/vitest";
import { afterEach, vi } from "vitest";

import { cleanup } from "@testing-library/react";
import * as matchers from "vitest-axe/matchers";
import { expect } from "vitest";

/*
 * Streamdown's mermaid plugin (imported by the AI Elements message and
 * reasoning parts, and so by anything that imports the agent index) pulls in
 * mermaid → khroma, whose ESM `../utils/index.js` imports the vmThreads loader
 * resolves against the wrong directory. No test renders a mermaid diagram, so
 * the plugin is stubbed for every file; a test that needs it can unmock it.
 */
vi.mock("@streamdown/mermaid", () => ({ mermaid: {} }));

// See ./vitest-axe.d.ts for the `toHaveNoViolations` type augmentation:
// vitest-axe@0.1.0 ships it against the pre-v3 `Vi.Assertion` global
// namespace, which Vitest 5 no longer reads.
expect.extend(matchers);

afterEach(() => {
  cleanup();
});

// jsdom implements none of the layout and pointer-capture APIs that Radix,
// Base UI and the sliding indicator read on mount. Stub them to the shape those
// libraries expect. Every one of these is a *browser* fact, so nothing asserted
// against a stub is a claim about rendering — the rendered claims live in the
// Playwright suite.
if (typeof globalThis.ResizeObserver === "undefined") {
  globalThis.ResizeObserver = class {
    observe() {}
    unobserve() {}
    disconnect() {}
  } as unknown as typeof ResizeObserver;
}

// embla-carousel observes its slides. jsdom ships no IntersectionObserver, and
// without it `Carousel` throws on mount rather than rendering — so the stub is
// what makes the component testable at all, not something a claim rests on.
if (typeof globalThis.IntersectionObserver === "undefined") {
  globalThis.IntersectionObserver = class {
    readonly root = null;
    readonly rootMargin = "";
    readonly thresholds: readonly number[] = [];
    observe() {}
    unobserve() {}
    disconnect() {}
    takeRecords(): IntersectionObserverEntry[] {
      return [];
    }
  } as unknown as typeof IntersectionObserver;
}

if (typeof document !== "undefined") {
  document.elementFromPoint ??= () => null;
}

if (typeof Element !== "undefined") {
  Element.prototype.scrollIntoView ??= () => {};
  Element.prototype.hasPointerCapture ??= () => false;
  Element.prototype.setPointerCapture ??= () => {};
  Element.prototype.releasePointerCapture ??= () => {};
}

// jsdom does not implement matchMedia. Several components read
// `prefers-reduced-motion` via `window.matchMedia`, so stub a
// non-matching implementation that satisfies the MediaQueryList shape.
if (typeof window !== "undefined" && !window.matchMedia) {
  window.matchMedia = (query: string): MediaQueryList => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => false,
  });
}
