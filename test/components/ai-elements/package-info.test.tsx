import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";

import {
  PackageInfo,
  PackageInfoChangeType,
  PackageInfoContent,
  PackageInfoDependencies,
  PackageInfoDependency,
  PackageInfoDescription,
  PackageInfoHeader,
  PackageInfoName,
  PackageInfoVersion,
} from "@/components/ai-elements/package-info";

describe("PackageInfo", () => {
  it("renders the fully-composed card (from ae examples) with the card surface", () => {
    const { container } = render(
      <PackageInfo changeType="major" currentVersion="18.2.0" name="react" newVersion="19.0.0">
        <PackageInfoHeader>
          <PackageInfoName />
          <PackageInfoChangeType />
        </PackageInfoHeader>
        <PackageInfoVersion />
        <PackageInfoDescription>
          A JavaScript library for building user interfaces.
        </PackageInfoDescription>
        <PackageInfoContent>
          <PackageInfoDependencies>
            <PackageInfoDependency name="react-dom" version="^19.0.0" />
            <PackageInfoDependency name="scheduler" version="^0.24.0" />
          </PackageInfoDependencies>
        </PackageInfoContent>
      </PackageInfo>
    );

    const root = container.firstElementChild as HTMLElement;
    expect(root.className).toMatch(/\bbg-card\b/);
    expect(screen.getByText("react").className).toMatch(/\btype-identifier\b/);
    expect(
      screen.getByText("A JavaScript library for building user interfaces.")
        .className
    ).toMatch(/\btype-body\b/);
    expect(screen.getByText("react-dom").className).toMatch(
      /\btype-identifier\b/
    );
  });

  it("maps each changeType to its semantic Badge variant", () => {
    const cases: Array<[
      "major" | "minor" | "patch" | "added" | "removed",
      string,
    ]> = [
      ["major", "destructive"],
      ["minor", "warning"],
      ["patch", "success"],
      ["added", "info"],
      ["removed", "secondary"],
    ];

    for (const [changeType, variant] of cases) {
      const { unmount } = render(
        <PackageInfo changeType={changeType} name="pkg" />
      );
      const badge = screen.getByText(changeType.charAt(0).toUpperCase() + changeType.slice(1));
      expect(badge.getAttribute("data-variant")).toBe(variant);
      unmount();
    }
  });

  it("renders the minimal 'added' composition with no version arrow", () => {
    render(
      <PackageInfo changeType="added" name="lodash">
        <PackageInfoHeader>
          <PackageInfoName />
          <PackageInfoChangeType />
        </PackageInfoHeader>
        <PackageInfoVersion />
      </PackageInfo>
    );
    expect(screen.getByText("lodash")).toBeInTheDocument();
    expect(screen.getByText("Added")).toBeInTheDocument();
  });

  it("renders the implicit 'removed' composition (no children) via the default render path", () => {
    render(
      <PackageInfo changeType="removed" currentVersion="2.29.4" name="moment" />
    );
    expect(screen.getByText("moment")).toBeInTheDocument();
    expect(screen.getByText("Removed")).toBeInTheDocument();
    expect(screen.getByText("2.29.4")).toBeInTheDocument();
  });

  it("renders both versions with an arrow between them, and the new version in the page foreground", () => {
    render(<PackageInfo currentVersion="18.2.0" name="react" newVersion="19.0.0" />);
    const newVersion = screen.getByText("19.0.0");
    expect(newVersion.className).toMatch(/\btext-foreground\b/);
  });

  it("omits the version row entirely when neither version is set", () => {
    render(<PackageInfo name="react" />);
    expect(screen.queryByText("→")).not.toBeInTheDocument();
  });

  it("the Dependencies label is quiet small text, not a badge", () => {
    render(
      <PackageInfoDependencies>
        <PackageInfoDependency name="react-dom" />
      </PackageInfoDependencies>
    );
    const label = screen.getByText("Dependencies");
    expect(label).toHaveClass("type-small", "text-muted-foreground");
    expect(label).not.toHaveClass("type-badge");
  });
});
