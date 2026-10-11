import { DocsShell } from "@/components/docs/chrome/docs-shell";

export default function DesignSystemLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <DocsShell>{children}</DocsShell>;
}
