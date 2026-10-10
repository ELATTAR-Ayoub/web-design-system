export type SiteNavItem = {
  title: string;
  href: string;
  description?: string;
};

export type SiteNavGroup = {
  title: string;
  items: SiteNavItem[];
};

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

export const SITE_LEGAL: SiteNavItem[] = [
  { title: "Terms of service", href: "/terms" },
  { title: "Privacy policy", href: "/privacy" },
];
