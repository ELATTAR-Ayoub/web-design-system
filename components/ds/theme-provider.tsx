"use client";

import { ThemeProvider as NextThemes } from "next-themes";

/**
 * The two modes.
 *
 * `defaultTheme="dark"` is deliberate rather than lazy. This system was
 * designed in the dark — the elevation scale, the rationed glow and the
 * iridescent bloom all assume a near-black page, and light mode is a genuine
 * second treatment rather than the origin. A first-time visitor should see the
 * system as it was drawn; light is one click away and remembered thereafter.
 *
 * `enableSystem` is on, so anyone whose OS asks for light gets it. Nothing here
 * pins a mode the way the old dark-only root did.
 *
 * `disableTransitionOnChange` matters more than it sounds. Every surface in
 * this system carries a `transition-[background-color,box-shadow,border-color]`
 * on `duration-normal`, so without it the toggle animates ~200 elements from one
 * palette to the other at once — a 250ms smear that looks like a rendering
 * fault rather than a theme change. next-themes drops a stylesheet killing all
 * transitions for one frame, flips, then restores them.
 */
export function ThemeProvider({ children }: { children: React.ReactNode }) {
  return (
    <NextThemes
      attribute="class"
      defaultTheme="dark"
      enableSystem
      disableTransitionOnChange
    >
      {children}
    </NextThemes>
  );
}
