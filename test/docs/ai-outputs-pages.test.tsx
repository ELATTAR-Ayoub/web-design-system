/**
 * Smoke test for the `ai-outputs` documentation pages: every specimen renders
 * and every page's sections render without throwing.
 *
 * @covers ai-artifact
 * @covers ai-web-preview
 * @covers ai-jsx-preview
 * @covers ai-sandbox
 * @covers ai-image
 * @covers ai-package-info
 * @covers ai-environment-variables
 * @covers ai-schema-display
 * @covers ai-audio-player
 */
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { createElement, type ReactNode } from "react";
import { afterEach, describe, expect, it, vi } from "vitest";

// media-chrome's store attaches to a real HTMLMediaElement, which jsdom lacks.
// Same stub as test/components/ai-elements/audio-player.test.tsx.
vi.mock("media-chrome/react", () => {
  const el = (tag: string) => {
    const Comp = ({ children, ...rest }: Record<string, unknown>) => {
      delete rest.seekOffset;
      delete rest.audio;
      return createElement(tag, rest, children as never);
    };
    return Comp;
  };
  return {
    MediaController: el("div"),
    MediaControlBar: el("div"),
    MediaPlayButton: el("button"),
    MediaSeekBackwardButton: el("button"),
    MediaSeekForwardButton: el("button"),
    MediaMuteButton: el("button"),
    MediaTimeDisplay: el("span"),
    MediaDurationDisplay: el("span"),
    MediaTimeRange: el("div"),
    MediaVolumeRange: el("div"),
  };
});

import { ArtifactPreview, ArtifactStateGrid } from "@/components/docs/component-docs/ai-artifact/artifact-specimen";
import { spec as artifactSpec } from "@/components/docs/component-docs/ai-artifact/page";
import { AudioPlayerPreview, AudioPlayerStateGrid } from "@/components/docs/component-docs/ai-audio-player/audio-player-specimen";
import { spec as audioSpec } from "@/components/docs/component-docs/ai-audio-player/page";
import {
  EnvironmentVariablesPreview,
  EnvironmentVariablesStateGrid,
} from "@/components/docs/component-docs/ai-environment-variables/environment-variables-specimen";
import { spec as envSpec } from "@/components/docs/component-docs/ai-environment-variables/page";
import { spec as imageSpec } from "@/components/docs/component-docs/ai-image/page";
import { ImagePreview, ImageStateGrid } from "@/components/docs/component-docs/ai-image/image-specimen";
import { spec as jsxSpec } from "@/components/docs/component-docs/ai-jsx-preview/page";
import { JsxPreviewPlayground, JsxPreviewStateGrid } from "@/components/docs/component-docs/ai-jsx-preview/jsx-preview-specimen";
import {
  PackageInfoChangeTypes,
  PackageInfoPreview,
  PackageInfoStateGrid,
} from "@/components/docs/component-docs/ai-package-info/package-info-specimen";
import { spec as packageSpec } from "@/components/docs/component-docs/ai-package-info/page";
import { spec as sandboxSpec } from "@/components/docs/component-docs/ai-sandbox/page";
import { SandboxPreview, SandboxStateGrid } from "@/components/docs/component-docs/ai-sandbox/sandbox-specimen";
import { spec as schemaSpec } from "@/components/docs/component-docs/ai-schema-display/page";
import { SchemaDisplayPreview, SchemaDisplayStateGrid } from "@/components/docs/component-docs/ai-schema-display/schema-display-specimen";
import { spec as webSpec } from "@/components/docs/component-docs/ai-web-preview/page";
import { WebPreviewPreview, WebPreviewStateGrid } from "@/components/docs/component-docs/ai-web-preview/web-preview-specimen";
import type { ComponentDocSpec } from "@/components/docs/component-page/types";

afterEach(cleanup);

const SPECS: [string, ComponentDocSpec][] = [
  ["ai-artifact", artifactSpec],
  ["ai-web-preview", webSpec],
  ["ai-jsx-preview", jsxSpec],
  ["ai-sandbox", sandboxSpec],
  ["ai-image", imageSpec],
  ["ai-package-info", packageSpec],
  ["ai-environment-variables", envSpec],
  ["ai-schema-display", schemaSpec],
  ["ai-audio-player", audioSpec],
];

/** Every ReactNode a page's sections carry, mounted so a thrown render shows up. */
function nodesOf(spec: ComponentDocSpec): ReactNode[] {
  const nodes: ReactNode[] = [];
  for (const section of spec.sections) {
    if (section.kind === "showcase" || section.kind === "effect") nodes.push(section.render);
    if (section.kind === "install" && section.notes) nodes.push(section.notes);
    if (section.kind === "disclosure") for (const block of section.blocks) nodes.push(block.body);
  }
  return nodes;
}

describe("ai-outputs documentation pages", () => {
  for (const [name, spec] of SPECS) {
    it(`${name}: every section renders and the order is the documented one`, () => {
      expect(spec.name).toBe(name);
      const ids = spec.sections.map((s) => s.id);
      expect(ids.slice(0, 4)).toEqual(["preview", "installation", "usage", "states"]);
      expect(ids.slice(-4)).toEqual(["api", "accessibility", "why", "source"]);
      for (const node of nodesOf(spec)) {
        const { unmount } = render(<>{node}</>);
        unmount();
      }
    });
  }

  it("ai-artifact: each action is a button named by its label", () => {
    render(<ArtifactPreview />);
    expect(screen.getByRole("button", { name: "Copy" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Download" })).toBeInTheDocument();
    render(<ArtifactStateGrid />);
    expect(screen.getByRole("button", { name: "Close" })).toBeInTheDocument();
  });

  it("ai-web-preview: the frame is titled Preview and never loads a remote site", () => {
    const { container } = render(
      <>
        <WebPreviewPreview />
        <WebPreviewStateGrid />
      </>,
    );
    for (const frame of container.querySelectorAll("iframe")) {
      expect(frame).toHaveAttribute("title", "Preview");
      const src = frame.getAttribute("src");
      expect(src === null || src === "about:blank").toBe(true);
    }
    expect(screen.getAllByLabelText("Address")[0]).toHaveAttribute("readonly");
    expect(screen.getByRole("button", { name: "Console" })).toBeInTheDocument();
  });

  it("ai-jsx-preview: renders the string, repairs a stream and shows the error block", () => {
    const spy = vi.spyOn(console, "error").mockImplementation(() => {});
    render(<JsxPreviewPlayground />);
    expect(screen.getByText("Order shipped")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Restart stream" }));
    expect(screen.getByRole("button", { name: "Reveal more" })).toBeInTheDocument();
    cleanup();
    render(<JsxPreviewStateGrid />);
    expect(screen.getAllByText("Order shipped").length).toBeGreaterThan(0);
    spy.mockRestore();
  });

  it("ai-sandbox: the tabs are named and the header carries each status", () => {
    render(<SandboxPreview />);
    expect(screen.getByRole("tab", { name: "Code" })).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: "Output" })).toBeInTheDocument();
    cleanup();
    render(<SandboxStateGrid />);
    expect(screen.getAllByRole("button", { name: /python sandbox/ })).toHaveLength(4);
  });

  it("ai-image: the picture is a data URL with its alt text", () => {
    render(
      <>
        <ImagePreview />
        <ImageStateGrid />
      </>,
    );
    const img = screen.getAllByAltText("Abstract mountains under a low sun")[0];
    expect(img.getAttribute("src")).toMatch(/^data:image\/svg\+xml;base64,/);
  });

  it("ai-package-info: shows the name, the version move and each change type", () => {
    render(
      <>
        <PackageInfoPreview />
        <PackageInfoChangeTypes />
        <PackageInfoStateGrid />
      </>,
    );
    expect(screen.getByText("react-dom")).toBeInTheDocument();
    expect(screen.getByText("18.3.1")).toBeInTheDocument();
    for (const label of ["Major", "Minor", "Patch", "Added", "Removed"]) {
      expect(screen.getAllByText(label).length).toBeGreaterThan(0);
    }
  });

  it("ai-environment-variables: values are masked until the switch is turned on", () => {
    render(<EnvironmentVariablesPreview />);
    expect(screen.queryByText("info")).not.toBeInTheDocument();
    const toggle = screen.getByRole("switch", { name: "Toggle value visibility" });
    fireEvent.click(toggle);
    expect(screen.getByText("info")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Copy LOG_LEVEL" })).toBeInTheDocument();
    cleanup();
    render(<EnvironmentVariablesStateGrid />);
    expect(screen.getAllByRole("switch").some((s) => s.hasAttribute("disabled"))).toBe(true);
  });

  it("ai-schema-display: the method badge and the path are shown, sections are disclosure buttons", () => {
    render(
      <>
        <SchemaDisplayPreview />
        <SchemaDisplayStateGrid />
      </>,
    );
    expect(screen.getAllByText("PATCH").length).toBeGreaterThan(0);
    expect(screen.getByRole("button", { name: /Request Body/ })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Parameters/ })).toBeInTheDocument();
  });

  it("ai-audio-player: mounts the play button and both ranges", () => {
    render(
      <>
        <AudioPlayerPreview />
        <AudioPlayerStateGrid />
      </>,
    );
    expect(document.querySelector('[data-slot="audio-player-play-button"]')).not.toBeNull();
    expect(document.querySelector('[data-slot="audio-player-time-range"]')).not.toBeNull();
    expect(document.querySelector('[data-slot="audio-player-volume-range"]')).not.toBeNull();
    expect(document.querySelector("audio")?.getAttribute("src")).toMatch(/^data:audio\/wav;base64,/);
  });
});
