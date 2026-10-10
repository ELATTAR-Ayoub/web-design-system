# Third-party notices

This project is released under the MIT licence (see [LICENSE](LICENSE)). It contains code and assets adapted from the projects below, which keep their own licences.

## 1. shadcn/ui

These files began as shadcn/ui source and have been modified:

- `components/ui/*`
- `hooks/use-mobile.ts`
- `lib/utils.ts` (the `cn` helper)
- `components/ds/charts/*` (demo data and chart compositions adapted from shadcn/ui's chart examples)

The original licence follows.

MIT License

Copyright (c) 2023 shadcn

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

## 2. Vercel AI Elements

`components/ai-elements/*` is vendored from Vercel AI Elements under the Apache License, Version 2.0, Copyright 2023 Vercel, Inc., and has been modified. The notice and the statement of changes are in [components/ai-elements/NOTICE.md](components/ai-elements/NOTICE.md), and the full licence text is in [components/ai-elements/LICENSE](components/ai-elements/LICENSE). Both files must travel with any copy of those components.

## 3. Fonts

- **Inter** (`public/fonts/inter-variable.woff2`), licensed under the SIL Open Font License 1.1, Copyright (c) 2016 The Inter Project Authors (https://github.com/rsms/inter). The full text is in [public/fonts/OFL.txt](public/fonts/OFL.txt).
- **Geist Mono** (npm package `geist`), licensed under the SIL Open Font License 1.1, Copyright (c) 2023 Vercel, in collaboration with basement.studio.

## 4. npm dependencies

Installed, not vendored. Each package keeps its own licence. Counts from package-lock.json on 2026-10-10; re-run any licence scanner over the lockfile to refresh (for example `npx license-checker --production --summary`).

Advisories that `npm audit --omit=dev` reports for these packages, and why they are accepted, are in [docs/known-issues.md](docs/known-issues.md).

Production dependencies (496 lockfile entries, including optional platform binaries):

| Licence | Packages |
| --- | --- |
| MIT | 390 (including `format`, which declares MIT in an array field, and `khroma`) |
| ISC | 38 |
| Apache-2.0 | 33 |
| BSD-3-Clause | 11 |
| LGPL-3.0-or-later | 10 |
| Apache-2.0 AND LGPL-3.0-or-later | 3 |
| BSD-2-Clause | 2 |
| One each | 0BSD, CC0-1.0, Unlicense, CC-BY-4.0, MIT AND ISC, Apache-2.0 AND LGPL-3.0-or-later AND MIT, (MPL-2.0 OR Apache-2.0), (AFL-2.1 OR BSD-3-Clause), SIL OPEN FONT LICENSE |

Notable packages:

- `caniuse-lite` is CC-BY-4.0. It is browser-support data, not code.
- `dompurify` is MPL-2.0 OR Apache-2.0, used under Apache-2.0.
- `geist` is OFL-1.1.
- `json-schema` is AFL-2.1 OR BSD-3-Clause, used under BSD-3-Clause.
- `khroma` declares no licence field. Its `license` file is the MIT License (Copyright (c) 2019-present Fabio Spampinato, Andrew Maney), so it is MIT.
- `sharp`'s own code is Apache-2.0. `libvips`, the image library it wraps, is LGPL-3.0-or-later. It ships in the `@img/sharp-libvips-*` packages (Linux and macOS, as a separate shared library) and is built into the `@img/sharp-win32-*` and `@img/sharp-wasm32` platform packages (listed above as Apache-2.0 AND LGPL-3.0-or-later, plus MIT for wasm32). Next.js loads it optionally for image optimisation, as an unmodified library used under the LGPL. It is not part of the project's own code.

### Build and test tools (not shipped)

The development tree is 700 lockfile entries, mostly MIT, ISC, Apache-2.0 and BSD. It also includes MPL-2.0 packages (`lightningcss`, `axe-core`), BlueOak-1.0.0, MIT-0, CC0-1.0 and Python-2.0. None of these ships in the built output.

No GPL, AGPL or non-commercial licence is present, in production or development dependencies.

## 5. External services

The UI makes no request to any outside host on its own. `OpenIn` (components/ai-elements/open-in-chat.tsx) opens a caller-supplied chat service in a new tab, with the user's prompt, only when the user clicks.

The dictation fallback and read-aloud use the browser's own `SpeechRecognition` and `speechSynthesis` (`components/agent/voice/speech.ts`, `components/ai-elements/speech-input.tsx`). In some browsers these send audio or text to the browser vendor's speech service. That is the browser's behaviour, not this code's, and this project makes no such request itself.
