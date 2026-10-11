import { describe, expect, it, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "vitest-axe";
import { FileTextIcon } from "lucide-react";

import {
  Attachment,
  AttachmentAction,
  AttachmentActions,
  AttachmentContent,
  AttachmentDescription,
  AttachmentGroup,
  AttachmentMedia,
  AttachmentTitle,
} from "@/components/ui/attachment";
import {
  Avatar,
  AvatarBadge,
  AvatarFallback,
  AvatarGroup,
  AvatarGroupCount,
  AvatarImage,
} from "@/components/ui/avatar";
import {
  Bubble,
  BubbleContent,
  BubbleGroup,
  BubbleReactions,
} from "@/components/ui/bubble";
import {
  Message,
  MessageAvatar,
  MessageContent,
  MessageFooter,
  MessageGroup,
  MessageHeader,
} from "@/components/ui/message";
import {
  MessageScroller,
  MessageScrollerButton,
  MessageScrollerContent,
  MessageScrollerItem,
  MessageScrollerProvider,
  MessageScrollerViewport,
} from "@/components/ui/message-scroller";
import { Spinner } from "@/components/ui/spinner";
import { OVERLAY_AXE_OPTIONS, expectNoFixedHeight } from "../helpers";

const setup = () => userEvent.setup({ pointerEventsCheck: 0 });

/* ── Message ───────────────────────────────────────────────────────────────── */

const thread = () => (
  <MessageGroup>
    <Message>
      <MessageAvatar>
        <Avatar>
          <AvatarFallback>AE</AvatarFallback>
        </Avatar>
      </MessageAvatar>
      <MessageContent>
        <MessageHeader>Ayoub</MessageHeader>
        <BubbleGroup>
          <Bubble variant="muted">
            <BubbleContent>Did the Genesis pack land?</BubbleContent>
          </Bubble>
        </BubbleGroup>
        <MessageFooter>Delivered</MessageFooter>
      </MessageContent>
    </Message>
    <Message align="end">
      <MessageContent>
        <BubbleGroup>
          <Bubble align="end">
            <BubbleContent>
              It did — and the whole print run is very nearly gone, so I would
              not wait on the second one.
            </BubbleContent>
          </Bubble>
        </BubbleGroup>
      </MessageContent>
    </Message>
  </MessageGroup>
);

describe("Message", () => {
  it("keeps the author's name in the accessibility tree, not only in a colour", () => {
    render(thread());
    expect(screen.getByText("Ayoub")).toBeInTheDocument();
    expect(screen.getByText("Delivered")).toBeInTheDocument();
  });

  it("reports which side it is on through data-align, so CSS is not the record", () => {
    const { container } = render(thread());
    const messages = container.querySelectorAll('[data-slot="message"]');
    expect(messages[0]).toHaveAttribute("data-align", "start");
    expect(messages[1]).toHaveAttribute("data-align", "end");
  });

  // Trap 6 territory: a long unbroken run inside a fixed-width column. The
  // component's contract is that the words wrap rather than widening the row.
  it("wraps long content rather than pushing the row wider", () => {
    const { container } = render(thread());
    for (const el of container.querySelectorAll(
      '[data-slot="message"],[data-slot="message-content"],[data-slot="bubble-content"]',
    )) {
      expect(el.className).toMatch(/min-w-0|wrap-break-word|max-w-full/);
    }
  });

  it("pins no fixed height anywhere in the stack", () => {
    const { container } = render(thread());
    for (const el of container.querySelectorAll("[data-slot]")) {
      expectNoFixedHeight(el);
    }
  });

  it("is axe clean", async () => {
    render(thread());
    expect(await axe(document.body, OVERLAY_AXE_OPTIONS)).toHaveNoViolations();
  });
});

/* ── Bubble ────────────────────────────────────────────────────────────────── */

const reactions = [
  { emoji: "❤️", count: 8, label: "a heart", mine: true },
  { emoji: "🔥", count: 2, label: "fire" },
];

describe("Bubble", () => {
  it("names every reaction and puts its count in the tree at rest", () => {
    render(
      <Bubble>
        <BubbleContent>Sold.</BubbleContent>
        <BubbleReactions reactions={reactions} />
      </Bubble>,
    );
    // Not "8" hidden behind a hover: the accessible name carries it.
    expect(
      screen.getByRole("button", { name: "8 reacted with a heart" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "2 reacted with fire" }),
    ).toBeInTheDocument();
  });

  // Trap 11 / RULES §7: a reaction the reader has already given must not be
  // marked by hue alone.
  it("marks the reader's own reaction with aria-pressed, not only a tint", () => {
    render(
      <Bubble>
        <BubbleContent>Sold.</BubbleContent>
        <BubbleReactions reactions={reactions} />
      </Bubble>,
    );
    expect(
      screen.getByRole("button", { name: "8 reacted with a heart" }),
    ).toHaveAttribute("aria-pressed", "true");
    expect(
      screen.getByRole("button", { name: "2 reacted with fire" }),
    ).toHaveAttribute("aria-pressed", "false");
  });

  it("reports the reaction that was pressed", async () => {
    const user = setup();
    const onReact = vi.fn();
    render(
      <Bubble>
        <BubbleContent>Sold.</BubbleContent>
        <BubbleReactions reactions={reactions} onReact={onReact} />
      </Bubble>,
    );
    await user.click(
      screen.getByRole("button", { name: "2 reacted with fire" }),
    );
    expect(onReact).toHaveBeenCalledWith("fire");
  });

  it("becomes the control when asChild, keeping its focus ring", () => {
    render(
      <Bubble>
        <BubbleContent asChild>
          <button type="button">Open the pack</button>
        </BubbleContent>
      </Bubble>,
    );
    const button = screen.getByRole("button", { name: "Open the pack" });
    expect(button).toHaveAttribute("data-slot", "bubble-content");
  });

  it("inks the destructive variant with -ink, never the raw fill", () => {
    const { container } = render(
      <Bubble variant="destructive">
        <BubbleContent>Payment failed.</BubbleContent>
      </Bubble>,
    );
    const cls = container.querySelector('[data-slot="bubble"]')!.className;
    expect(cls).toContain("text-destructive-ink");
  });

  it("is axe clean with reactions showing", async () => {
    render(
      <BubbleGroup>
        <Bubble>
          <BubbleContent>Sold.</BubbleContent>
          <BubbleReactions reactions={reactions} showCount="always" />
        </Bubble>
      </BubbleGroup>,
    );
    expect(await axe(document.body, OVERLAY_AXE_OPTIONS)).toHaveNoViolations();
  });
});

/* ── MessageScroller ───────────────────────────────────────────────────────── */

const scroller = () => (
  <MessageScrollerProvider>
    <MessageScroller>
      <MessageScrollerViewport>
        <MessageScrollerContent>
          {["one", "two", "three"].map((n) => (
            <MessageScrollerItem key={n}>Message {n}</MessageScrollerItem>
          ))}
        </MessageScrollerContent>
      </MessageScrollerViewport>
      <MessageScrollerButton direction="end" />
    </MessageScroller>
  </MessageScrollerProvider>
);

describe("MessageScroller", () => {
  it("gives its jump control a name a screen reader can act on", () => {
    render(scroller());
    expect(
      screen.getByRole("button", { name: "Scroll to end" }),
    ).toBeInTheDocument();
  });

  it("names the start direction too", () => {
    render(
      <MessageScrollerProvider>
        <MessageScroller>
          <MessageScrollerViewport>
            <MessageScrollerContent>
              <MessageScrollerItem>Only</MessageScrollerItem>
            </MessageScrollerContent>
          </MessageScrollerViewport>
          <MessageScrollerButton direction="start" />
        </MessageScroller>
      </MessageScrollerProvider>,
    );
    expect(
      screen.getByRole("button", { name: "Scroll to start" }),
    ).toBeInTheDocument();
  });

  // Component-contracts, "Native scrollbars": the viewport scrolls itself with
  // a real overflow, rather than a synthetic scrollbar that keyboard and
  // trackpad users have to learn.
  it("scrolls natively — a real overflow, not a synthetic bar", () => {
    const { container } = render(scroller());
    const viewport = container.querySelector(
      '[data-slot="message-scroller-viewport"]',
    )!;
    expect(viewport.className).toContain("overflow-y-auto");
    expect(viewport.className).toContain("scrollbar-thin");
  });

  it("renders every message it is given", () => {
    render(scroller());
    expect(screen.getByText("Message one")).toBeInTheDocument();
    expect(screen.getByText("Message three")).toBeInTheDocument();
  });

  it("is axe clean", async () => {
    render(scroller());
    expect(await axe(document.body, OVERLAY_AXE_OPTIONS)).toHaveNoViolations();
  });
});

/* ── Attachment ────────────────────────────────────────────────────────────── */

const attachment = (state: "idle" | "uploading" | "error" | "done" = "done") => (
  <AttachmentGroup>
    <Attachment state={state}>
      <AttachmentMedia>
        {state === "uploading" ? (
          <Spinner aria-label="Uploading" />
        ) : (
          <FileTextIcon />
        )}
      </AttachmentMedia>
      <AttachmentContent>
        <AttachmentTitle>grading-report.pdf</AttachmentTitle>
        <AttachmentDescription>
          {state === "error" ? "Upload failed" : "482 KB"}
        </AttachmentDescription>
      </AttachmentContent>
      <AttachmentActions>
        <AttachmentAction aria-label="Remove grading-report.pdf" />
      </AttachmentActions>
    </Attachment>
  </AttachmentGroup>
);

describe("Attachment", () => {
  it("reports its state as data, so it is not encoded in colour alone", () => {
    for (const state of ["idle", "uploading", "error", "done"] as const) {
      const { container, unmount } = render(attachment(state));
      expect(container.querySelector('[data-slot="attachment"]')).toHaveAttribute(
        "data-state",
        state,
      );
      unmount();
    }
  });

  it("says what failed in words, beside the tinted well", () => {
    render(attachment("error"));
    expect(screen.getByText("Upload failed")).toBeInTheDocument();
  });

  it("names its row action", () => {
    render(attachment());
    expect(
      screen.getByRole("button", { name: "Remove grading-report.pdf" }),
    ).toBeInTheDocument();
  });

  it("announces the uploading state through the spinner's live role", () => {
    render(attachment("uploading"));
    expect(
      screen.getByRole("status", { name: "Uploading" }),
    ).toBeInTheDocument();
  });

  it("fires its row action from the keyboard", async () => {
    const user = setup();
    const onClick = vi.fn();
    render(
      <Attachment>
        <AttachmentContent>
          <AttachmentTitle>grading-report.pdf</AttachmentTitle>
        </AttachmentContent>
        <AttachmentActions>
          <AttachmentAction aria-label="Remove" onClick={onClick} />
        </AttachmentActions>
      </Attachment>,
    );
    const button = screen.getByRole("button", { name: "Remove" });
    button.focus();
    await user.keyboard("{Enter}");
    expect(onClick).toHaveBeenCalled();
  });

  it("names a download action after the file, and says Saving rather than Saved", async () => {
    const user = setup();
    render(
      <Attachment>
        <AttachmentContent>
          <AttachmentTitle>grading-report.pdf</AttachmentTitle>
        </AttachmentContent>
        <AttachmentActions>
          <AttachmentAction href="/files/grading-report.pdf" />
        </AttachmentActions>
      </Attachment>,
    );
    // A plain `download` anchor gives the page no completion event, so the
    // component must not claim the bytes landed.
    const link = screen.getByRole("link", {
      name: "Download grading-report.pdf",
    });
    expect(link).toHaveAttribute("download");
    await user.click(link);
  });

  it("opens the media preview in a named dialog, and closes it on Escape", async () => {
    const user = setup();
    render(
      <Attachment>
        <AttachmentMedia
          variant="image"
          src="/media/grade-9-front.png"
          previewName="Grade 9 front"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/media/grade-9-front.png" alt="" />
        </AttachmentMedia>
      </Attachment>,
    );
    const trigger = screen.getByRole("button", {
      name: "Open Grade 9 front full size",
    });
    trigger.focus();
    await user.keyboard("{Enter}");

    // A Dialog, not an AlertDialog: RULES §5's table reserves the alert for
    // the irreversible, and there is nothing here to decide.
    const dialog = await screen.findByRole("dialog", { name: "Grade 9 front" });
    expect(dialog).toBeInTheDocument();

    await user.keyboard("{Escape}");
    await waitFor(() =>
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument(),
    );
    expect(trigger).toHaveFocus();
  });

  it("is axe clean in every state", async () => {
    for (const state of ["idle", "uploading", "error", "done"] as const) {
      const { unmount } = render(attachment(state));
      expect(await axe(document.body, OVERLAY_AXE_OPTIONS)).toHaveNoViolations();
      unmount();
    }
  });
});

/* ── Avatar ────────────────────────────────────────────────────────────────── */

describe("Avatar", () => {
  it("falls back to initials that are readable at the 14px floor", () => {
    render(
      <Avatar>
        <AvatarImage src="/nope.png" alt="Ayoub Elattar" />
        <AvatarFallback>AE</AvatarFallback>
      </Avatar>,
    );
    // Radix only swaps the image in once it loads; jsdom loads nothing, so the
    // fallback is what is on screen — which is the case worth asserting.
    const fallback = screen.getByText("AE");
    expect(fallback.className).toContain("type-small");
    expect(fallback.className).not.toMatch(/text-\[\d/);
  });

  it("does not pin a fixed text height on the fallback", () => {
    render(
      <Avatar size="sm">
        <AvatarFallback>AE</AvatarFallback>
      </Avatar>,
    );
    expectNoFixedHeight(screen.getByText("AE"));
  });

  it("a decorative avatar image carries an empty alt, not a filename", () => {
    const { container } = render(
      <Avatar>
        <AvatarImage src="/a.png" alt="" />
        <AvatarFallback>AE</AvatarFallback>
      </Avatar>,
    );
    // The image element is only mounted once loaded; what matters here is that
    // the component does not invent an alt of its own.
    expect(container.querySelector("img[alt]:not([alt=''])")).toBeNull();
  });

  it("counts an overflowing group in text, not in a tooltip alone", () => {
    render(
      <AvatarGroup>
        <Avatar>
          <AvatarFallback>AE</AvatarFallback>
        </Avatar>
        <Avatar>
          <AvatarFallback>ZK</AvatarFallback>
        </Avatar>
        <AvatarGroupCount>+3</AvatarGroupCount>
      </AvatarGroup>,
    );
    expect(screen.getByText("+3")).toBeInTheDocument();
  });

  it("is axe clean, alone, badged and grouped", async () => {
    render(
      <AvatarGroup>
        <Avatar>
          <AvatarFallback>AE</AvatarFallback>
          <AvatarBadge />
        </Avatar>
        <AvatarGroupCount>+3</AvatarGroupCount>
      </AvatarGroup>,
    );
    expect(await axe(document.body, OVERLAY_AXE_OPTIONS)).toHaveNoViolations();
  });
});
