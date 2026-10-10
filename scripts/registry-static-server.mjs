#!/usr/bin/env node
/**
 * A ~30-line static file server for rehearsing registry installs locally.
 *
 * Deliberately not `next start` (that is the shared, lock-serialised Next
 * build) and not a third-party static-server package (one more thing that
 * can fail to resolve offline) — just enough to serve `public/r/**` over
 * HTTP so `npx shadcn add http://127.0.0.1:<port>/r/<item>.json` has
 * something real to hit.
 *
 *   node scripts/registry-static-server.mjs <rootDir> <port>
 *
 * Defaults to serving ./public on port 3200.
 */
import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const root = path.resolve(process.argv[2] || path.join(repoRoot, "public"));
const port = Number(process.argv[3] || 3200);

const MIME = {
  ".json": "application/json",
  ".css": "text/css",
  ".js": "application/javascript",
  ".html": "text/html",
  ".woff2": "font/woff2",
};

const server = http.createServer((req, res) => {
  const urlPath = decodeURIComponent((req.url ?? "/").split("?")[0]);
  const filePath = path.join(root, urlPath);
  if (!filePath.startsWith(root)) {
    res.writeHead(403);
    res.end("forbidden");
    return;
  }
  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(404, { "content-type": "text/plain" });
      res.end(`not found: ${urlPath}`);
      return;
    }
    const ext = path.extname(filePath);
    res.writeHead(200, { "content-type": MIME[ext] ?? "application/octet-stream" });
    res.end(data);
  });
});

server.listen(port, "127.0.0.1", () => {
  console.log(`serving ${root} on http://127.0.0.1:${port}`);
});
