import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { SchemaDisplay } from "@/components/ai-elements/schema-display";

const setup = () => userEvent.setup({ pointerEventsCheck: 0 });

describe("SchemaDisplay", () => {
  it("renders the basic composition (method + path only) on the card surface", () => {
    const { container } = render(<SchemaDisplay method="GET" path="/api/users" />);
    const root = container.firstElementChild as HTMLElement;
    expect(root.className).toMatch(/\bbg-card\b/);
    expect(screen.getByText("GET").getAttribute("data-variant")).toBe("success");
    expect(screen.getByText("/api/users").className).toMatch(
      /\btype-identifier\b/
    );
  });

  it("maps each HTTP method to its semantic Badge variant", () => {
    const cases: Array<[
      "GET" | "POST" | "PUT" | "PATCH" | "DELETE",
      string,
    ]> = [
      ["GET", "success"],
      ["POST", "info"],
      ["PUT", "warning"],
      ["PATCH", "warning"],
      ["DELETE", "destructive"],
    ];
    for (const [method, variant] of cases) {
      const { unmount } = render(<SchemaDisplay method={method} path="/x" />);
      expect(screen.getByText(method).getAttribute("data-variant")).toBe(variant);
      unmount();
    }
  });

  it("highlights {param} path segments with the info-ink token", () => {
    render(<SchemaDisplay method="GET" path="/api/users/{userId}" />);
    const highlighted = screen.getByText("{userId}");
    expect(highlighted.className).toMatch(/\btext-info-ink\b/);
  });

  it("renders parameters (path/query, required) from the ae 'params' example", () => {
    render(
      <SchemaDisplay
        method="GET"
        parameters={[
          { location: "path", name: "userId", required: true, type: "string" },
          { location: "query", name: "include", type: "string" },
        ]}
        path="/api/users/{userId}"
      />
    );
    expect(screen.getByText("userId")).toBeInTheDocument();
    expect(screen.getByText("required").getAttribute("data-variant")).toBe(
      "destructive"
    );
    expect(screen.getByText("path")).toBeInTheDocument();
    expect(screen.getByText("include")).toBeInTheDocument();
  });

  it("renders request/response bodies from the ae 'body' example", () => {
    render(
      <SchemaDisplay
        method="POST"
        path="/api/users"
        requestBody={[{ name: "email", required: true, type: "string" }]}
        responseBody={[{ name: "id", type: "string" }]}
      />
    );
    expect(screen.getByText("Request Body")).toBeInTheDocument();
    expect(screen.getByText("Response")).toBeInTheDocument();
    expect(screen.getByText("email")).toBeInTheDocument();
    expect(screen.getByText("id")).toBeInTheDocument();
  });

  it("renders nested properties/items recursively, open by depth", () => {
    render(
      <SchemaDisplay
        method="POST"
        path="/api/orders"
        requestBody={[
          {
            name: "items",
            properties: [{ name: "sku", type: "string" }],
            type: "array",
          },
        ]}
      />
    );
    // depth < 2 defaults open, so the nested leaf is already visible.
    expect(screen.getByText("sku")).toBeInTheDocument();
  });

  it("each collapsible section header wears press and toggles independently", async () => {
    const user = setup();
    render(
      <SchemaDisplay
        method="GET"
        parameters={[{ name: "q", type: "string" }]}
        path="/api/search"
      />
    );

    const trigger = screen
      .getByText("Parameters")
      .closest('[data-slot="collapsible-trigger"]') as HTMLElement;
    expect(trigger.className).toMatch(/\bpress\b/);
    expect(trigger.getAttribute("data-state")).toBe("open");
    expect(screen.getByText("q")).toBeInTheDocument();

    await user.click(trigger);
    expect(trigger.getAttribute("data-state")).toBe("closed");
  });

  it("shows the description band in body type when provided", () => {
    render(
      <SchemaDisplay
        description="Fetch a single user by id."
        method="GET"
        path="/api/users/{id}"
      />
    );
    expect(screen.getByText("Fetch a single user by id.").className).toMatch(
      /\btype-body\b/
    );
  });
});
