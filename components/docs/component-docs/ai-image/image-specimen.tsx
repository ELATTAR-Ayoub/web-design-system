"use client";

import { Image } from "@/components/ai-elements/image";
import { Panel, StateCell, StateGrid } from "@/components/ds/kit";

import { SAMPLE_IMAGE_BASE64 } from "./image-sample";

/**
 * Live specimens for the `ai-image` documentation page. The picture is a small
 * inline SVG handed over as base64 with an `image/svg+xml` media type, which is
 * the same shape a generated image arrives in.
 */

const EMPTY_BYTES = new Uint8Array();
const ALT = "Abstract mountains under a low sun";

/** The Preview: a generated image with its alt text. */
export function ImagePreview() {
  return (
    <Panel label="Image" note="base64 + mediaType, data URL src">
      <Image alt={ALT} base64={SAMPLE_IMAGE_BASE64} mediaType="image/svg+xml" uint8Array={EMPTY_BYTES} />
    </Panel>
  );
}

/** The States grid: the image at a fixed width, and inside a narrow column. */
export function ImageStateGrid() {
  return (
    <StateGrid cols={2}>
      <StateCell label="rest" note="fixed width, rounded-md">
        <Image
          alt={ALT}
          base64={SAMPLE_IMAGE_BASE64}
          className="w-40"
          mediaType="image/svg+xml"
          uint8Array={EMPTY_BYTES}
        />
      </StateCell>
      <StateCell label="constrained" note="max-w-full keeps it inside a narrow parent">
        <div className="w-24">
          <Image alt={ALT} base64={SAMPLE_IMAGE_BASE64} mediaType="image/svg+xml" uint8Array={EMPTY_BYTES} />
        </div>
      </StateCell>
    </StateGrid>
  );
}
