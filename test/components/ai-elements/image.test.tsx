import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { Image } from "@/components/ai-elements/image";

describe("Image", () => {
  it("renders a data URI from base64 + mediaType", () => {
    render(<Image base64="AAAA" mediaType="image/png" alt="gen" uint8Array={new Uint8Array()} />);
    const img = screen.getByAltText("gen");
    expect(img).toHaveAttribute("src", "data:image/png;base64,AAAA");
    expect(img).toHaveClass("rounded-md", "max-w-full");
  });
});
