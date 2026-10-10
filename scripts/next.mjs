#!/usr/bin/env node
// Runs the Next.js CLI with anonymous telemetry off. Next reads the variable at CLI start.
import { spawn } from "node:child_process";
import { fileURLToPath } from "node:url";

const bin = fileURLToPath(new URL("../node_modules/next/dist/bin/next", import.meta.url));
const child = spawn(process.execPath, [bin, ...process.argv.slice(2)], {
  stdio: "inherit",
  env: { ...process.env, NEXT_TELEMETRY_DISABLED: "1" },
});
child.on("exit", (code, signal) => {
  if (signal) process.kill(process.pid, signal);
  else process.exit(code ?? 1);
});
