import type { Metadata } from "next";
import { GeistMono } from "geist/font/mono";

import { ThemeProvider } from "@/components/ds/theme-provider";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";

import "./globals.css";
import "../components/docs/docs-motion.css";

export const metadata: Metadata = {
  title: "Elattar's Design System",
  description:
    "Foundations, base components and a complete agent workspace — every token, in light and dark.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    /**
     * `suppressHydrationWarning` is required, not defensive. next-themes writes
     * the resolved theme onto <html> from an inline script before React
     * hydrates — that is the whole mechanism that prevents a flash of the wrong
     * palette — so the server's markup and the client's first read of this one
     * element genuinely differ, by design. Without this, React logs a hydration
     * error on every page load. It suppresses the warning for this element
     * only, not for the tree.
     */
    <html
      lang="en"
      suppressHydrationWarning
      className={`${GeistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <ThemeProvider>
          <TooltipProvider delayDuration={200}>{children}</TooltipProvider>
          <Toaster position="top-center" />
        </ThemeProvider>
      </body>
    </html>
  );
}
