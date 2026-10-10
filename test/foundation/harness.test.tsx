import { describe, expect, it } from "vitest";
import { render } from "@testing-library/react";
import { axe } from "vitest-axe";

describe("unit test harness", () => {
  it("registers jest-dom and axe matchers", async () => {
    const { container, getByRole } = render(<button type="button">Click me</button>);

    expect(getByRole("button", { name: "Click me" })).toBeInTheDocument();
    expect(await axe(container)).toHaveNoViolations();
  });
});
