/**
 * Generates the inventory half of `docs/audits/web-component-audit.md`.
 *
 * One row per source module across `components/ui`, `components/agent`,
 * `components/agent` and `hooks`. Reads the real `export` statements rather than
 * a hand-typed list, because a hand-typed inventory of a hundred modules is
 * wrong the day after it is written.
 *
 * Type-only modules are skipped: a `type` is not a component and has no state
 * matrix. Everything else gets a row, including supporting hooks.
 *
 * Usage:  node scripts/build-audit-inventory.mjs        # print the table
 *         node scripts/build-audit-inventory.mjs --json # print rows as JSON
 */

import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative, sep } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = fileURLToPath(new URL("..", import.meta.url));
const ROOTS = ["components/ui", "components/agent", "hooks"];

/* ── which specimen route owns which module ───────────────────────────────── */

/** Longest matching prefix wins, so a directory rule can be overridden. */
const SPECIMEN = [
  // base
  ["components/ui/button.tsx", "base/buttons"],
  ["components/ui/button-group.tsx", "base/buttons"],
  ["components/ui/toggle.tsx", "base/buttons"],
  ["components/ui/toggle-group.tsx", "base/buttons"],
  ["components/ui/active-indicator.tsx", "base/buttons"],
  ["components/ui/kbd.tsx", "base/buttons"],
  ["components/ui/input.tsx", "base/inputs"],
  ["components/ui/input-group.tsx", "base/inputs"],
  ["components/ui/input-otp.tsx", "base/inputs"],
  ["components/ui/textarea.tsx", "base/inputs"],
  ["components/ui/label.tsx", "base/inputs"],
  ["components/ui/field.tsx", "base/forms"],
  ["components/ui/form.tsx", "base/forms"],
  ["components/ui/questionnaire.tsx", "base/forms"],
  ["components/ui/select.tsx", "base/selects"],
  ["components/ui/native-select.tsx", "base/selects"],
  ["components/ui/combobox.tsx", "base/selects"],
  ["components/ui/command.tsx", "base/selects"],
  ["components/ui/checkbox.tsx", "base/selection"],
  ["components/ui/radio.tsx", "base/selection"],
  ["components/ui/switch.tsx", "base/selection"],
  ["components/ui/slider.tsx", "base/selection"],
  ["components/ui/calendar.tsx", "base/selects"],
  ["components/ui/use-replay-on-state-change.ts", "base/selection"],
  ["components/ui/dialog.tsx", "base/dialogs"],
  ["components/ui/alert-dialog.tsx", "base/dialogs"],
  ["components/ui/sheet.tsx", "base/dialogs"],
  ["components/ui/drawer.tsx", "base/dialogs"],
  ["components/ui/popover.tsx", "base/dialogs"],
  ["components/ui/hover-card.tsx", "base/dialogs"],
  ["components/ui/tooltip.tsx", "base/dialogs"],
  ["components/ui/dropdown-menu.tsx", "base/menus"],
  ["components/ui/context-menu.tsx", "base/menus"],
  ["components/ui/menubar.tsx", "base/menus"],
  ["components/ui/breadcrumb.tsx", "base/navigation"],
  ["components/ui/navigation-menu.tsx", "base/navigation"],
  ["components/ui/pagination.tsx", "base/navigation"],
  ["components/ui/tabs.tsx", "base/navigation"],
  ["components/ui/user-menu.tsx", "base/navigation"],
  ["components/ui/direction.tsx", "base/navigation"],
  ["components/ui/alert.tsx", "base/feedback"],
  ["components/ui/badge.tsx", "base/feedback"],
  ["components/ui/empty.tsx", "base/feedback"],
  ["components/ui/progress.tsx", "base/feedback"],
  ["components/ui/skeleton.tsx", "base/feedback"],
  ["components/ui/toaster.tsx", "base/feedback"],
  ["components/ui/spinner.tsx", "base/feedback"],
  ["components/ui/marker.tsx", "base/feedback"],
  ["components/ui/bubble.tsx", "base/chat"],
  ["components/ui/message.tsx", "base/chat"],
  ["components/ui/message-scroller.tsx", "base/chat"],
  ["components/ui/attachment.tsx", "base/chat"],
  ["components/ui/avatar.tsx", "base/chat"],
  ["components/ui/table.tsx", "base/data"],
  ["components/ui/item.tsx", "base/data"],
  ["components/ui/stat.tsx", "base/data"],
  ["components/ui/carousel.tsx", "base/data"],
  ["components/ui/chart.tsx", "base/charts"],
  ["components/ui/accordion.tsx", "base/layout"],
  ["components/ui/aspect-ratio.tsx", "base/layout"],
  ["components/ui/card.tsx", "base/layout"],
  ["components/ui/collapsible.tsx", "base/layout"],
  ["components/ui/prose.tsx", "base/layout"],
  ["components/ui/resizable.tsx", "base/layout"],
  ["components/ui/scroll-area.tsx", "base/layout"],
  ["components/ui/separator.tsx", "base/layout"],
  ["components/ui/icon.tsx", "icons"],
  ["components/ui/icon-swap.tsx", "icons"],
  ["components/ui/sidebar.tsx", "base/sidebar"],
  // agent
  ["components/agent/", "agent-workspace"],
  // hooks
  ["hooks/use-mobile.ts", "base/sidebar"],
  ["hooks/use-reduced-motion.ts", "motion"],
  ["hooks/use-latest.ts", "—"],
];

/** Batch membership, from the plan's Step 2 list. Longest prefix wins. */
const BATCH = [
  ["components/ui/button.tsx", 1],
  ["components/ui/button-group.tsx", 1],
  ["components/ui/toggle.tsx", 1],
  ["components/ui/toggle-group.tsx", 1],
  ["components/ui/input.tsx", 1],
  ["components/ui/input-group.tsx", 1],
  ["components/ui/input-otp.tsx", 1],
  ["components/ui/textarea.tsx", 1],
  ["components/ui/label.tsx", 1],
  ["components/ui/field.tsx", 1],
  ["components/ui/form.tsx", 1],
  ["components/ui/select.tsx", 1],
  ["components/ui/native-select.tsx", 1],
  ["components/ui/combobox.tsx", 1],
  ["components/ui/command.tsx", 1],
  ["components/ui/checkbox.tsx", 1],
  ["components/ui/radio.tsx", 1],
  ["components/ui/switch.tsx", 1],
  ["components/ui/slider.tsx", 1],
  ["components/ui/calendar.tsx", 1],
  ["components/ui/questionnaire.tsx", 1],
  ["components/ui/use-replay-on-state-change.ts", 1],
  ["components/ui/dialog.tsx", 2],
  ["components/ui/alert-dialog.tsx", 2],
  ["components/ui/sheet.tsx", 2],
  ["components/ui/drawer.tsx", 2],
  ["components/ui/popover.tsx", 2],
  ["components/ui/hover-card.tsx", 2],
  ["components/ui/tooltip.tsx", 2],
  ["components/ui/dropdown-menu.tsx", 2],
  ["components/ui/context-menu.tsx", 2],
  ["components/ui/menubar.tsx", 2],
  ["components/ui/breadcrumb.tsx", 3],
  ["components/ui/navigation-menu.tsx", 3],
  ["components/ui/pagination.tsx", 3],
  ["components/ui/tabs.tsx", 3],
  ["components/ui/user-menu.tsx", 3],
  ["components/ui/direction.tsx", 3],
  ["components/ui/active-indicator.tsx", 3],
  ["components/ui/alert.tsx", 3],
  ["components/ui/badge.tsx", 3],
  ["components/ui/empty.tsx", 3],
  ["components/ui/progress.tsx", 3],
  ["components/ui/skeleton.tsx", 3],
  ["components/ui/toaster.tsx", 3],
  ["components/ui/spinner.tsx", 3],
  ["components/ui/marker.tsx", 3],
  ["components/ui/kbd.tsx", 3],
  ["components/ui/bubble.tsx", 3],
  ["components/ui/message.tsx", 3],
  ["components/ui/message-scroller.tsx", 3],
  ["components/ui/attachment.tsx", 3],
  ["components/ui/avatar.tsx", 3],
  ["components/ui/table.tsx", 3],
  ["components/ui/item.tsx", 3],
  ["components/ui/stat.tsx", 3],
  ["components/ui/carousel.tsx", 3],
  ["components/ui/chart.tsx", 4],
  ["components/ui/accordion.tsx", 4],
  ["components/ui/aspect-ratio.tsx", 4],
  ["components/ui/card.tsx", 4],
  ["components/ui/collapsible.tsx", 4],
  ["components/ui/prose.tsx", 4],
  ["components/ui/resizable.tsx", 4],
  ["components/ui/scroll-area.tsx", 4],
  ["components/ui/separator.tsx", 4],
  ["components/ui/sidebar.tsx", 4],
  ["components/ui/icon.tsx", 4],
  ["components/ui/icon-swap.tsx", 4],
  ["components/agent/", 5],
  ["hooks/use-mobile.ts", 4],
  ["hooks/use-reduced-motion.ts", 4],
  ["hooks/use-latest.ts", 4],
];

/** Third-party owners worth naming in the ledger. */
const DEP_LABEL = [
  [/^radix-ui$/, "radix"],
  [/^@radix-ui\//, "radix"],
  [/^@base-ui\//, "base-ui"],
  [/^vaul$/, "vaul"],
  [/^cmdk$/, "cmdk"],
  [/^recharts$/, "recharts"],
  [/^sonner$/, "toaster"],
  [/^input-otp$/, "input-otp"],
  [/^react-day-picker$/, "react-day-picker"],
  [/^react-hook-form$/, "react-hook-form"],
  [/^@hookform\//, "react-hook-form"],
  [/^zod$/, "zod"],
  [/^embla-carousel/, "embla"],
  [/^react-resizable-panels$/, "react-resizable-panels"],
  [/^@tanstack\/react-table$/, "tanstack-table"],
  [/^@shadcn\/react/, "@shadcn/react"],
  [/^class-variance-authority$/, "cva"],
  [/^lucide-react$/, "lucide"],
  [/^next-themes$/, "next-themes"],
  [/^date-fns$/, "date-fns"],
];

function walk(dir, out = []) {
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) walk(full, out);
    else if (/\.(tsx?|ts)$/.test(entry)) out.push(full);
  }
  return out;
}

/** Value exports only — a `type` has no state matrix and no specimen. */
function publicExports(src) {
  const names = new Set();
  const push = (n) => {
    if (n && /^[A-Za-z_$][\w$]*$/.test(n)) names.add(n);
  };

  for (const m of src.matchAll(
    /^export\s+(?:async\s+)?(?:function|const|let|var|class)\s+([A-Za-z_$][\w$]*)/gm,
  ))
    push(m[1]);

  for (const m of src.matchAll(/^export\s*\{([^}]*)\}/gm)) {
    for (const raw of m[1].split(",")) {
      const part = raw.trim();
      if (!part || /^type\s/.test(part)) continue;
      const as = part.split(/\s+as\s+/);
      push((as[1] ?? as[0]).trim());
    }
  }

  if (/^export\s+default\s/m.test(src)) push("default");
  return [...names];
}

function deps(src) {
  const found = new Set();
  for (const m of src.matchAll(/from\s+["']([^"']+)["']/g)) {
    const spec = m[1];
    if (spec.startsWith(".") || spec.startsWith("@/")) continue;
    for (const [re, label] of DEP_LABEL) if (re.test(spec)) found.add(label);
  }
  return [...found].sort();
}

function longestMatch(table, rel) {
  let best = null;
  for (const [prefix, value] of table)
    if (rel.startsWith(prefix) && (!best || prefix.length > best[0].length))
      best = [prefix, value];
  return best ? best[1] : null;
}

const rows = [];
for (const root of ROOTS) {
  for (const file of walk(join(ROOT, root)).sort()) {
    const rel = relative(ROOT, file).split(sep).join("/");
    if (rel.endsWith("index.ts")) continue; // a barrel re-exports, it owns nothing
    const src = readFileSync(file, "utf8");
    const exports = publicExports(src);
    if (exports.length === 0) continue; // type-only module

    const name =
      exports.find((e) => /^[A-Z]/.test(e)) ??
      exports.find((e) => /^use[A-Z]/.test(e)) ??
      exports[0];

    const specimen = longestMatch(SPECIMEN, rel) ?? "—";
    rows.push({
      component: name,
      source: rel,
      exports,
      specimen:
        specimen === "—"
          ? "—"
          : specimen === "icons" || specimen === "motion"
            ? `/design-system/${specimen}`
            : `/design-system/components/${specimen}`,
      deps: deps(src),
      batch: longestMatch(BATCH, rel) ?? "—",
    });
  }
}

rows.sort((a, b) => {
  const ab = a.batch === "—" ? 99 : a.batch;
  const bb = b.batch === "—" ? 99 : b.batch;
  return ab - bb || a.source.localeCompare(b.source);
});

if (process.argv.includes("--json")) {
  process.stdout.write(JSON.stringify(rows, null, 2));
} else {
  const AXES = [
    "source",
    "interaction",
    "accessibility",
    "responsive",
    "motion",
    "docs",
    "tests",
    "visual",
    "release",
  ];
  const head = [
    "#",
    "batch",
    "component",
    "source path",
    "public exports",
    "specimen route",
    "applicable states",
    "dependencies",
    ...AXES,
    "evidence",
  ];
  const lines = [
    `| ${head.join(" | ")} |`,
    `|${head.map(() => "---").join("|")}|`,
  ];
  rows.forEach((r, i) => {
    lines.push(
      `| ${[
        i + 1,
        r.batch,
        r.component,
        `\`${r.source}\``,
        r.exports.map((e) => `\`${e}\``).join(", "),
        r.specimen,
        "pending",
        r.deps.length ? r.deps.join(", ") : "—",
        ...AXES.map(() => "pending"),
        "—",
      ].join(" | ")} |`,
    );
  });
  process.stdout.write(lines.join("\n") + "\n");
  process.stderr.write(`\n${rows.length} rows\n`);
}
