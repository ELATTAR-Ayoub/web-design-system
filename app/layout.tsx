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
    // next-themes writes the theme onto <html> before hydration.
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
