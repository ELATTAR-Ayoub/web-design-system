import { describe, expect, it, vi } from "vitest";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {
  Attachment,
  AttachmentEmpty,
  AttachmentInfo,
  AttachmentPreview,
  AttachmentRemove,
  Attachments,
  getAttachmentLabel,
  getMediaCategory,
  type AttachmentData,
} from "@/components/ai-elements/attachments";

const img = { id: "1", type: "file", mediaType: "image/png", filename: "p.png", url: "https://x.test/p.png" } as AttachmentData;
const doc = { id: "2", type: "file", mediaType: "application/pdf", filename: "d.pdf", url: "https://x.test/d.pdf" } as AttachmentData;
const src = { id: "3", type: "source-document", mediaType: "text/html", title: "Site", sourceId: "s" } as AttachmentData;

describe("attachments helpers", () => {
  it("categorises and labels", () => {
    expect(getMediaCategory(img)).toBe("image");
    expect(getMediaCategory(doc)).toBe("document");
    expect(getMediaCategory(src)).toBe("source");
    expect(getAttachmentLabel(src)).toBe("Site");
    expect(getAttachmentLabel({ ...img, filename: undefined } as AttachmentData)).toBe("Image");
  });
});

describe("Attachments", () => {
  it.each(["grid", "inline", "list"] as const)("%s variant renders and removes", async (variant) => {
    const onRemove = vi.fn();
    render(
      <Attachments variant={variant}>
        <Attachment data={doc} onRemove={onRemove}>
          <AttachmentPreview />
          <AttachmentInfo showMediaType />
          <AttachmentRemove />
        </Attachment>
      </Attachments>,
    );
    if (variant !== "grid") {
      expect(screen.getByText("d.pdf")).toHaveClass("type-small");
      expect(screen.getByText("application/pdf")).toHaveClass("text-muted-foreground");
    }
    const user = userEvent.setup();
    await user.click(screen.getByRole("button", { name: "Remove" }));
    expect(onRemove).not.toHaveBeenCalled();
    const confirm = await screen.findByRole("alertdialog", { name: "Remove this attachment?" });
    expect(confirm).toHaveAccessibleDescription("d.pdf");
    await user.click(within(confirm).getByRole("button", { name: "Remove" }));
    expect(onRemove).toHaveBeenCalled();
  });
  it("remove control sizes: grid/inline keep small visuals with a 40px hit area, list is the icon size", () => {
    const sizes = {} as Record<string, HTMLElement>;
    for (const variant of ["grid", "inline", "list"] as const) {
      const { unmount } = render(
        <Attachments variant={variant}>
          <Attachment data={doc} onRemove={() => {}}>
            <AttachmentRemove />
          </Attachment>
        </Attachments>,
      );
      sizes[variant] = screen.getByRole("button", { name: "Remove" });
      expect(sizes[variant]).toHaveClass("size-10");
      expect(sizes[variant].className).not.toContain("size-target-min");
      if (variant === "list") {
        expect(sizes[variant].className).not.toContain("-m-");
      } else {
        expect(sizes[variant].querySelector("span.rounded-pill")).toHaveClass(variant === "grid" ? "size-6" : "size-5");
      }
      if (variant === "inline") expect(sizes[variant]).toHaveClass("-m-2.5");
      if (variant === "grid") expect(sizes[variant]).toHaveClass("top-0", "right-0");
      unmount();
    }
  });
  it("inline chip is compact (h-8) and uses the nav role", () => {
    const { container } = render(
      <Attachments variant="inline">
        <Attachment data={doc} />
      </Attachments>,
    );
    const chip = container.querySelector(".group.relative");
    expect(chip).toHaveClass("h-8", "type-nav");
  });
  it("renders image preview and hides remove without onRemove", () => {
    render(
      <Attachments>
        <Attachment data={img}>
          <AttachmentPreview />
          <AttachmentRemove />
        </Attachment>
      </Attachments>,
    );
    expect(screen.getByAltText("p.png")).toHaveAttribute("src", "https://x.test/p.png");
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
  });
  it("empty state", () => {
    render(<AttachmentEmpty />);
    expect(screen.getByText("No attachments")).toHaveClass("type-small");
  });
});
