import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { axe } from "vitest-axe";
import { CircleCheckIcon, InfoIcon, OctagonXIcon, TriangleAlertIcon } from "lucide-react";

import {
  Alert,
  AlertAction,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { Kbd, KbdGroup } from "@/components/ui/kbd";
import { Marker, MarkerContent, MarkerIcon } from "@/components/ui/marker";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { Spinner } from "@/components/ui/spinner";
import { TOAST_ICONS, Toaster } from "@/components/ui/toaster";
import { toast } from "sonner";
import { act } from "@testing-library/react";
import { expectNoFixedHeight, OVERLAY_AXE_OPTIONS } from "../helpers";

/* ── Alert ─────────────────────────────────────────────────────────────────── */

const ALERT_GLYPHS = {
  default: InfoIcon,
  info: InfoIcon,
  success: CircleCheckIcon,
  warning: TriangleAlertIcon,
  destructive: OctagonXIcon,
} as const;

type AlertVariant = keyof typeof ALERT_GLYPHS;
const VARIANTS = Object.keys(ALERT_GLYPHS) as AlertVariant[];

const alertOf = (variant: AlertVariant) => {
  const Glyph = ALERT_GLYPHS[variant];
  return (
    <Alert variant={variant}>
      <Glyph />
      <AlertTitle>Vault sync {variant}</AlertTitle>
      <AlertDescription>Nine cards moved since last night.</AlertDescription>
    </Alert>
  );
};

describe("Alert", () => {
  // RED before the fix: every variant hardcoded `role="alert"`. `alert` is an
  // assertive live region — a screen reader interrupts whatever it is saying to
  // read it. The feedback specimen shows five of them at once, so landing on
  // that page fired five interruptions for information that is not urgent.
  // RULES §5 "Alert: one surface, five meanings" makes the meaning the tone's
  // job; the ARIA role has to follow the meaning.
  it("only the urgent tones are assertive; the rest announce politely", () => {
    for (const variant of ["destructive", "warning"] as const) {
      const { unmount } = render(alertOf(variant));
      expect(screen.getByRole("alert")).toBeInTheDocument();
      unmount();
    }
    for (const variant of ["default", "info", "success"] as const) {
      const { unmount } = render(alertOf(variant));
      expect(screen.getByRole("status")).toBeInTheDocument();
      expect(screen.queryByRole("alert")).not.toBeInTheDocument();
      unmount();
    }
  });

  it("lets a caller override the role it chose", () => {
    render(
      <Alert variant="success" role="alert">
        <CircleCheckIcon />
        <AlertTitle>Paid</AlertTitle>
      </Alert>,
    );
    expect(screen.getByRole("alert")).toBeInTheDocument();
  });

  // Trap 11: a mark whose only difference between states is hue is one signal.
  // Alert carries the second signal in the glyph — which the CALLER passes — so
  // the contract is that a variant other than `default` renders one.
  it("every tone is drawn with a glyph beside the words, not colour alone", () => {
    for (const variant of VARIANTS) {
      const { container, unmount } = render(alertOf(variant));
      const root = container.querySelector('[data-slot="alert"]')!;
      expect(root.querySelector("svg")).not.toBeNull();
      unmount();
    }
  });

  // Trap 12: a state hue on text or on a glyph is the `-ink` end of the ramp,
  // never the raw fill.
  it("inks its state glyphs with -ink, never the raw hue", () => {
    for (const variant of ["destructive", "success", "warning", "info"] as const) {
      const { container, unmount } = render(alertOf(variant));
      const cls = container.querySelector('[data-slot="alert"]')!.className;
      expect(cls).toContain(`text-${variant === "destructive" ? "destructive" : variant}-ink`);
      // and never the raw fill on text
      expect(cls).not.toMatch(
        new RegExp(`svg\\]:text-(destructive|success|warning|info)(?!-ink)`),
      );
      unmount();
    }
  });

  it("does not pin a fixed height — the words decide how tall it is", () => {
    const { container } = render(alertOf("info"));
    expectNoFixedHeight(container.querySelector('[data-slot="alert"]')!);
  });

  it("takes an action without it escaping the surface", () => {
    render(
      <Alert variant="warning">
        <TriangleAlertIcon />
        <AlertTitle>Print run nearly gone</AlertTitle>
        <AlertAction>
          <Button size="sm" variant="ghost">
            Dismiss
          </Button>
        </AlertAction>
      </Alert>,
    );
    expect(screen.getByRole("button", { name: "Dismiss" })).toBeInTheDocument();
  });

  it("is axe clean in all five tones", async () => {
    for (const variant of VARIANTS) {
      const { unmount } = render(alertOf(variant));
      expect(await axe(document.body, OVERLAY_AXE_OPTIONS)).toHaveNoViolations();
      unmount();
    }
  });
});

/* ── Badge ─────────────────────────────────────────────────────────────────── */

const BADGE_VARIANTS = [
  "default",
  "secondary",
  "destructive",
  "outline",
  "ghost",
  "link",
  "action",
  "premium",
  "success",
  "warning",
  "info",
] as const;

describe("Badge", () => {
  it("wears the type-badge role — 14/18, the contract's label size", () => {
    render(<Badge>Featured</Badge>);
    expect(screen.getByText("Featured").className).toContain("type-badge");
  });

  // RED before the fix: `h-5` is a ceiling as well as a floor. `type-badge` is
  // 14/18, so a badge whose content wraps or whose caller bumps the type had
  // its own text clipped by its own class. The same correction batch 1 made
  // across six control files.
  it("does not pin a fixed height", () => {
    render(<Badge>Featured</Badge>);
    expectNoFixedHeight(screen.getByText("Featured"));
  });

  it("sets no case of its own — sentence case unless a call site says otherwise", () => {
    render(<Badge variant="premium">Limited print</Badge>);
    const cls = screen.getByText("Limited print").className;
    expect(cls).not.toMatch(/(?:^|\s)(uppercase|lowercase|capitalize)(?![\w-])/);
  });

  it("every filled state variant carries its own hue, on the -ink end", () => {
    for (const variant of ["success", "warning", "info", "destructive"] as const) {
      const { unmount } = render(<Badge variant={variant}>Chip</Badge>);
      expect(screen.getByText("Chip").className).toContain(`text-${variant}-ink`);
      unmount();
    }
  });

  it("becomes whatever it is asChild over, keeping its own slot", () => {
    render(
      <Badge asChild variant="action">
        <a href="/packs">Open packs</a>
      </Badge>,
    );
    const link = screen.getByRole("link", { name: "Open packs" });
    expect(link).toHaveAttribute("data-slot", "badge");
  });

  it("is axe clean in every variant", async () => {
    render(
      <div>
        {BADGE_VARIANTS.map((v) => (
          <Badge key={v} variant={v}>
            {v}
          </Badge>
        ))}
      </div>,
    );
    expect(await axe(document.body, OVERLAY_AXE_OPTIONS)).toHaveNoViolations();
  });
});

/* ── Kbd ───────────────────────────────────────────────────────────────────── */

describe("Kbd", () => {
  it("is a real <kbd>, so it is announced as keyboard input", () => {
    render(<Kbd>⌘</Kbd>);
    expect(screen.getByText("⌘").tagName).toBe("KBD");
  });

  it("does not pin a fixed height", () => {
    render(<Kbd>Esc</Kbd>);
    expectNoFixedHeight(screen.getByText("Esc"));
  });

  it("groups without swallowing the individual keys", () => {
    render(
      <KbdGroup>
        <Kbd>Ctrl</Kbd>
        <Kbd>K</Kbd>
      </KbdGroup>,
    );
    expect(screen.getByText("Ctrl")).toBeInTheDocument();
    expect(screen.getByText("K")).toBeInTheDocument();
  });
});

/* ── Marker ────────────────────────────────────────────────────────────────── */

describe("Marker", () => {
  it("renders its label and hides its glyph from assistive tech", () => {
    const { container } = render(
      <Marker variant="separator">
        <MarkerIcon>
          <InfoIcon />
        </MarkerIcon>
        <MarkerContent>Context cleared</MarkerContent>
      </Marker>,
    );
    expect(screen.getByText("Context cleared")).toBeInTheDocument();
    expect(container.querySelector('[data-slot="marker-icon"]')).toHaveAttribute(
      "aria-hidden",
      "true",
    );
  });

  it("does not pin a fixed height in any variant", () => {
    for (const variant of ["default", "separator", "border"] as const) {
      const { container, unmount } = render(
        <Marker variant={variant}>
          <MarkerContent>Today</MarkerContent>
        </Marker>,
      );
      expectNoFixedHeight(container.querySelector('[data-slot="marker"]')!);
      unmount();
    }
  });

  it("is axe clean", async () => {
    render(
      <Marker variant="border">
        <MarkerContent>3 messages hidden</MarkerContent>
      </Marker>,
    );
    expect(await axe(document.body, OVERLAY_AXE_OPTIONS)).toHaveNoViolations();
  });
});

/* ── Progress ──────────────────────────────────────────────────────────────── */

describe("Progress", () => {
  it("announces its value, its bounds and its name", () => {
    render(<Progress value={42} aria-label="Vault sync" />);
    const bar = screen.getByRole("progressbar", { name: "Vault sync" });
    expect(bar).toHaveAttribute("aria-valuenow", "42");
    expect(bar).toHaveAttribute("aria-valuemin", "0");
    expect(bar).toHaveAttribute("aria-valuemax", "100");
  });

  // An indeterminate bar must NOT claim a value it does not have, and it must
  // still be visible as something in progress rather than an empty channel.
  it("is honest when it does not know how far through it is", () => {
    const { container } = render(<Progress aria-label="Working" />);
    const bar = screen.getByRole("progressbar", { name: "Working" });
    expect(bar).toHaveAttribute("data-state", "indeterminate");
    expect(bar).not.toHaveAttribute("aria-valuenow");
    // RULES §5: "progress only when you can honestly say how far through you
    // are" — so the indeterminate bar carries a motion of its own rather than
    // reading as a bar stuck at zero.
    const indicator = container.querySelector(
      '[data-slot="progress-indicator"]',
    )!;
    expect(indicator.className).toContain("anim-");
  });

  it("every tone drives the fill from the -ink end of its ramp", () => {
    for (const tone of ["default", "value", "success", "warning", "destructive"] as const) {
      const { container, unmount } = render(
        <Progress value={60} tone={tone} aria-label="t" />,
      );
      const cls = container.querySelector(
        '[data-slot="progress-indicator"]',
      )!.className;
      expect(cls).toMatch(/bg-(action|value|success|warning|destructive)-ink/);
      unmount();
    }
  });

  it("is axe clean, determinate and indeterminate", async () => {
    const { unmount } = render(<Progress value={70} aria-label="Sync" />);
    expect(await axe(document.body, OVERLAY_AXE_OPTIONS)).toHaveNoViolations();
    unmount();
    render(<Progress aria-label="Sync" />);
    expect(await axe(document.body, OVERLAY_AXE_OPTIONS)).toHaveNoViolations();
  });
});

/* ── Spinner ───────────────────────────────────────────────────────────────── */

describe("Spinner", () => {
  // RED before the fix: `Spinner` wrote `role="status"`, `aria-label="Loading"`
  // and `data-slot="spinner"` onto `Icon`, and `Icon` destructures its props
  // and spreads NOTHING — so all three were dropped on the floor. The file
  // claimed an announcement it did not make. Raised as a cross-batch finding in
  // batch 1; batch 3 owns the file, so batch 3 closes it.
  // RED before the fix, and it is a different defect from the swallowed props:
  // a LIVE REGION announces its CONTENTS, not its accessible name. The first
  // version was `<svg role="status" aria-label="Loading">` with nothing inside
  // it, so the region was named but empty — assistive tech very likely says
  // nothing at all when it mounts. The name has to be real text in the region.
  it("announces itself as a live status whose CONTENT is the label", () => {
    render(<Spinner />);
    const status = screen.getByRole("status", { name: "Loading" });
    expect(status).toHaveTextContent("Loading");
  });

  it("takes a caller's own label, as content and as the name", () => {
    render(<Spinner aria-label="Requesting withdrawal" />);
    const status = screen.getByRole("status", {
      name: "Requesting withdrawal",
    });
    expect(status).toHaveTextContent("Requesting withdrawal");
  });

  // The words are for assistive tech only — the glyph is what a sighted reader
  // sees, and printing "Loading" beside every spinner is not the design.
  it("keeps the announcement out of the visible layout", () => {
    const { container } = render(<Spinner />);
    expect(container.querySelector(".sr-only")).toHaveTextContent("Loading");
  });

  // A spinner beside a label that already says "Loading…" is decoration, and
  // announcing it twice is worse than not announcing it once.
  it("can be silenced where the surrounding copy already says it", () => {
    render(
      <span>
        <Spinner aria-hidden />
        Loading your vault
      </span>,
    );
    expect(screen.queryByRole("status")).not.toBeInTheDocument();
  });

  it("carries the data-slot other components style it by", () => {
    const { container } = render(<Spinner />);
    expect(container.querySelector('[data-slot="spinner"]')).not.toBeNull();
  });

  it("spins from the named utility, not from an inline animation", () => {
    const { container } = render(<Spinner />);
    // The glyph is what rotates; the host carries the role and the size.
    // `.className` on an SVGElement is an SVGAnimatedString, not a string.
    expect(container.querySelector("svg")!.getAttribute("class")).toContain(
      "anim-spin",
    );
  });

  // `attachment.tsx` sizes the spinner with
  // `*:data-[slot=spinner]:size-6!` — a DIRECT-CHILD selector — so the slot has
  // to stay on the element `AttachmentMedia` actually contains, which is now
  // the status host rather than the svg. Asserted here because moving it would
  // break a different file silently.
  it("keeps data-slot on the element a parent can select as a direct child", () => {
    const { container } = render(
      <div data-testid="well">
        <Spinner />
      </div>,
    );
    const well = container.querySelector('[data-testid="well"]')!;
    expect(well.firstElementChild).toHaveAttribute("data-slot", "spinner");
  });

  it("is axe clean", async () => {
    render(<Spinner />);
    expect(await axe(document.body, OVERLAY_AXE_OPTIONS)).toHaveNoViolations();
  });
});

/* ── Skeleton ──────────────────────────────────────────────────────────────── */

describe("Skeleton", () => {
  it("shimmers from the named utility", () => {
    const { container } = render(<Skeleton className="h-4 w-40" />);
    expect(container.firstElementChild!.className).toContain("anim-shimmer");
  });

  // RULES §5 "Skeletons match the footprint": a <div> inside a <p> is invalid
  // HTML that every guard here passes, so the escape hatch has to work.
  it("stands in for words inside a <p> without breaking the HTML", () => {
    const { container } = render(
      <p>
        <Skeleton as="span" className="h-4 w-24" />
      </p>,
    );
    const skeleton = container.querySelector('[data-slot="skeleton"]')!;
    expect(skeleton.tagName).toBe("SPAN");
    // A bare span ignores width and height; inline-block restores them.
    expect(skeleton.className).toContain("inline-block");
    expect(container.querySelector("p > div")).toBeNull();
  });

  // A shimmering rectangle with no text is meaningless to a screen reader, and
  // announcing "" repeatedly while it shimmers is worse than silence.
  it("is not announced — the container's aria-busy is what carries the state", () => {
    const { container } = render(
      <div aria-busy="true" aria-live="polite">
        <Skeleton className="h-4 w-40" />
      </div>,
    );
    const skeleton = container.querySelector('[data-slot="skeleton"]')!;
    expect(skeleton).toHaveAttribute("aria-hidden", "true");
  });

  it("is axe clean inside a busy region", async () => {
    render(
      <div aria-busy="true">
        <Skeleton className="h-4 w-40" />
      </div>,
    );
    expect(await axe(document.body, OVERLAY_AXE_OPTIONS)).toHaveNoViolations();
  });
});

/* ── Empty ─────────────────────────────────────────────────────────────────── */

describe("Empty", () => {
  it("always offers a way forward — RULES §5's whole reason for the component", () => {
    render(
      <Empty>
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <InfoIcon />
          </EmptyMedia>
          <EmptyTitle>No packs yet</EmptyTitle>
          <EmptyDescription>Open one and it lands here.</EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          <Button>Browse the market</Button>
        </EmptyContent>
      </Empty>,
    );
    expect(
      screen.getByRole("button", { name: "Browse the market" }),
    ).toBeInTheDocument();
    expect(screen.getByText("No packs yet")).toBeInTheDocument();
  });

  // RED before the fix: the base carried `border-dashed` and no `border`, so
  // the dashed edge the description promises had zero width and never drew.
  // Every token is valid and both guards stay green — trap 15 exactly.
  it("draws the dashed edge it says it draws", () => {
    const { container } = render(
      <Empty>
        <EmptyTitle>Nothing here</EmptyTitle>
      </Empty>,
    );
    const cls = container.querySelector('[data-slot="empty"]')!.className;
    expect(cls).toContain("border-dashed");
    expect(cls).toMatch(/(?:^|\s)border(?![\w-])/);
  });

  it("its description is a <p>, as its own type says", () => {
    const { container } = render(
      <Empty>
        <EmptyDescription>Nothing yet.</EmptyDescription>
      </Empty>,
    );
    expect(
      container.querySelector('[data-slot="empty-description"]')!.tagName,
    ).toBe("P");
  });

  it("is axe clean", async () => {
    render(
      <Empty>
        <EmptyHeader>
          <EmptyTitle>No packs yet</EmptyTitle>
          <EmptyDescription>Open one and it lands here.</EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          <Button>Browse the market</Button>
        </EmptyContent>
      </Empty>,
    );
    expect(await axe(document.body, OVERLAY_AXE_OPTIONS)).toHaveNoViolations();
  });
});

/* ── Toaster / sonner ──────────────────────────────────────────────────────── */

describe("Toaster", () => {
  it("exports one icon per toast type, so the live toast and the preview cannot drift", () => {
    expect(Object.keys(TOAST_ICONS).sort()).toEqual(
      ["error", "info", "loading", "success", "warning"].sort(),
    );
  });

  it("a toast opts back into pointer events, so its action works while a modal has disabled the page", async () => {
    render(<Toaster />);
    act(() => {
      toast("Conversation deleted", { action: { label: "Undo", onClick: () => {} } });
    });
    const undo = await screen.findByRole("button", { name: "Undo" });
    expect(undo.closest("[data-sonner-toast]")).toHaveClass("pointer-events-auto");
  });
});
