import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { LandingHero } from "@/components/docs/page/landing-hero";
import { PageContainer } from "@/components/docs/layout/page-container";
import { PageSection } from "@/components/docs/layout/page-section";
import { AnnouncementBar } from "@/components/docs/chrome/announcement-bar";
import { SiteFooter } from "@/components/docs/chrome/site-footer";
import { SiteHeader } from "@/components/docs/chrome/site-header";
import { SkipLink } from "@/components/docs/chrome/skip-link";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { CommandBlock, Meta } from "@/components/ds/kit";
import { Logo } from "@/components/ds/logo";
import { ThemeToggle } from "@/components/ds/theme-toggle";
import { commandFor } from "@/lib/ds/registry";
import { SITE_FOOTER, SITE_LEGAL } from "@/lib/docs/nav";

export const metadata: Metadata = {
  title: "Elattar's Design System",
  description:
    "A token-driven design system for the web — React, Next.js, Tailwind v4 and Radix, shipped as a shadcn-compatible registry.",
};

const NAV = [
  { title: "Introduction", href: "/design-system/docs/introduction" },
  { title: "Components", href: "/design-system/components" },
  { title: "Registry", href: "/design-system/docs/registry" },
];

export default function Home() {
  const foundation = commandFor("source-foundation");

  return (
    <div className="flex min-h-dvh flex-col">
      <SkipLink />

      <AnnouncementBar>
        Design System v0.1 — the registry is live at{" "}
        <Link
          href="/design-system/docs/registry"
          className="type-small text-action-ink underline underline-offset-2 hover:no-underline"
        >
          /design-system/docs/registry
        </Link>
        .
      </AnnouncementBar>

      <SiteHeader
        brand={
          <Link href="/" className="press shrink-0">
            <Logo />
          </Link>
        }
        items={NAV}
        actions={<ThemeToggle />}
      />

      <main id="main" tabIndex={-1} className="flex-1 outline-none">
        <PageSection spacing="loose">
          <PageContainer width="page">
            <LandingHero
              headline="A design system you can defend."
              description="Every colour, size, radius and curve comes from a token. Nothing can drift without failing a build — and it ships as a shadcn-compatible registry, so you install exactly the files you need with the CLI you already use."
              actions={
                <>
                  <Button size="xl" asChild>
                    <Link href="/design-system/docs/introduction">
                      Read the introduction
                      <Icon icon={ArrowRight} size="sm" tone="inherit" />
                    </Link>
                  </Button>
                  <Button variant="secondary" size="xl" asChild>
                    <Link href="/design-system">Browse components</Link>
                  </Button>
                </>
              }
            />
          </PageContainer>
        </PageSection>

        <PageSection surface="muted" spacing="loose">
          <PageContainer width="page">
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_1.2fr] lg:items-start">
              <div>
                <h2 className="type-h2 text-foreground">What it is</h2>
                <p className="type-body mt-4 max-w-prose text-muted-foreground">
                  Three product-agnostic families — base components on Radix,
                  a complete AI console, and the page furniture a real site
                  needs — built on one token layer, in light and dark, with
                  every state drawn and every action giving feedback. Read the{" "}
                  <Link
                    href="/design-system/docs/introduction"
                    className="text-action-ink underline underline-offset-2"
                  >
                    Introduction
                  </Link>{" "}
                  for the three ideas that explain the rest.
                </p>
              </div>
              <div>
                <p className="type-badge mb-3 text-muted-foreground">Install</p>
                <CommandBlock command={foundation} />
                <p className="type-small mt-3 text-muted-foreground">
                  Read from the built registry —{" "}
                  <Link
                    href="/design-system/docs/installation"
                    className="text-action-ink underline underline-offset-2"
                  >
                    full installation guide
                  </Link>
                  .
                </p>
              </div>
            </div>
          </PageContainer>
        </PageSection>

        <PageSection spacing="loose">
          <PageContainer width="page">
            <Meta
              items={[
                { k: "Introduction", v: <Link href="/design-system/docs/introduction" className="text-action-ink underline underline-offset-2">What this system is and the three ideas it runs on</Link> },
                { k: "Components", v: <Link href="/design-system/components" className="text-action-ink underline underline-offset-2">Base and Agent families, every state drawn</Link> },
                { k: "Registry", v: <Link href="/design-system/docs/registry" className="text-action-ink underline underline-offset-2">Every install command, read from the built registry</Link> },
              ]}
            />
          </PageContainer>
        </PageSection>
      </main>

      <SiteFooter
        brand={
          <div className="max-w-(--width-prose)">
            <p className="type-h3 text-foreground">Elattar&rsquo;s Design System</p>
            <p className="type-small mt-3 text-muted-foreground">
              A reference implementation. Every page here is composed from{" "}
              <code className="type-code">components/docs</code> and the base
              components, with no visual values of its own.
            </p>
          </div>
        }
        groups={SITE_FOOTER}
        legal={SITE_LEGAL}
        legalNote="Elattar's Design System — a reference implementation."
      />
    </div>
  );
}
