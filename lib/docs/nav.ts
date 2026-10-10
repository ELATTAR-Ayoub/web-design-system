/**
 * Nav data for the private documentation/showcase furniture in
 * `components/docs/`, not a published registry family.
 *
 * `SiteFooter` and its legal row read from here, so a link can never appear in
 * the footer's columns and not the legal row, or vice versa, by accident. This
 * used to also back a top nav and a customer-facing route shell; both were
 * removed, which is why only the footer shapes remain below.
 *
 * **Every href below points at a route that exists.** `lib/ds/nav.ts` carries a
 * comment earned the hard way — a `contents` entry is a promise, and the `data`
 * page advertised a "Chart" chip for months with no specimen behind it. A nav
 * entry is a stronger promise still, because a missing one is a 404 rather than
 * a gap in the documentation. Add the route in the same change that adds the
 * link, or do not add the link.
 *
 * The content is placeholder — this repository ships a design system, not a
 * company — but the *shape* is the deliverable: grouped footer columns and a
 * legal row that is separate from them because legal links belong at the foot
 * of a page whatever else is there.
 */

export type SiteNavItem = {
  title: string;
  href: string;
  /** Shown in the footer's grouped columns; the header has no room for it. */
  description?: string;
};

export type SiteNavGroup = {
  /** Names the column, and becomes the `<nav>`'s accessible name. */
  title: string;
  items: SiteNavItem[];
};

/** The footer's columns. */
export const SITE_FOOTER: SiteNavGroup[] = [
  {
    title: "Support",
    items: [
      { title: "FAQ", href: "/faq", description: "The questions that arrive most often" },
      { title: "Help centre", href: "/help", description: "Guides and troubleshooting" },
      { title: "Contact", href: "/contact", description: "Reach a person" },
    ],
  },
  {
    title: "Company",
    items: [
      { title: "About", href: "/about", description: "Who builds this" },
      { title: "Resources", href: "/resources", description: "Documents and downloads" },
    ],
  },
];

/**
 * The legal row, kept out of the columns above.
 *
 * Not a style choice: these have to be findable from every page regardless of
 * what else the footer is carrying, and a reader looking for a privacy policy
 * is not browsing — they are looking for one specific thing, in the one place
 * every site puts it.
 */
export const SITE_LEGAL: SiteNavItem[] = [
  { title: "Terms of service", href: "/terms" },
  { title: "Privacy policy", href: "/privacy" },
];
