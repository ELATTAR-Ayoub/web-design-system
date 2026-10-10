import * as React from "react"

type ColorName = "black" | "red" | "green" | "yellow" | "blue" | "magenta" | "cyan" | "white"

const COLOR_NAMES: readonly ColorName[] = ["black", "red", "green", "yellow", "blue", "magenta", "cyan", "white"]

export type TerminalColor =
  | { kind: "named"; name: ColorName; bright: boolean }
  | { kind: "palette"; index: number }
  | { kind: "rgb"; r: number; g: number; b: number }

export type TerminalStyle = {
  fg?: TerminalColor
  bg?: TerminalColor
  bold?: true
  dim?: true
  italic?: true
  underline?: true
  blink?: true
  inverse?: true
  hidden?: true
  strike?: true
}

export type TerminalSegment = { text: string; style: TerminalStyle }

export type TextLink = { start: number; end: number; href: string }

type Flag = Exclude<keyof TerminalStyle, "fg" | "bg">
type Cell = { ch: string; style: TerminalStyle }

const ESC = "\u001b"
const BLANK: TerminalStyle = {}

function without(style: TerminalStyle, ...keys: (keyof TerminalStyle)[]): TerminalStyle {
  const next = { ...style }
  for (const key of keys) delete next[key]
  return next
}

function withFlag(style: TerminalStyle, flag: Flag): TerminalStyle {
  return { ...style, [flag]: true }
}

function paletteColor(index: number): TerminalColor {
  if (index < 8) return { kind: "named", name: COLOR_NAMES[index], bright: false }
  if (index < 16) return { kind: "named", name: COLOR_NAMES[index - 8], bright: true }
  return { kind: "palette", index }
}

function applyCodes(style: TerminalStyle, params: string): TerminalStyle {
  const codes = params === "" ? [0] : params.split(/[;:]/).map((p) => (p === "" ? 0 : Number(p)))
  let next = style

  for (let i = 0; i < codes.length; i++) {
    const code = codes[i]

    if (code === 38 || code === 48) {
      const layer = code === 38 ? "fg" : "bg"
      const mode = codes[i + 1]
      if (mode === 5 && codes[i + 2] !== undefined) {
        next = { ...next, [layer]: paletteColor(codes[i + 2] & 255) }
        i += 2
      } else if (mode === 2 && codes[i + 4] !== undefined) {
        next = { ...next, [layer]: { kind: "rgb", r: codes[i + 2], g: codes[i + 3], b: codes[i + 4] } }
        i += 4
      }
      continue
    }

    if (code === 0) next = BLANK
    else if (code === 1) next = withFlag(next, "bold")
    else if (code === 2) next = withFlag(next, "dim")
    else if (code === 3) next = withFlag(next, "italic")
    else if (code === 4 || code === 21) next = withFlag(next, "underline")
    else if (code === 5 || code === 6) next = withFlag(next, "blink")
    else if (code === 7) next = withFlag(next, "inverse")
    else if (code === 8) next = withFlag(next, "hidden")
    else if (code === 9) next = withFlag(next, "strike")
    else if (code === 22) next = without(next, "bold", "dim")
    else if (code === 23) next = without(next, "italic")
    else if (code === 24) next = without(next, "underline")
    else if (code === 25) next = without(next, "blink")
    else if (code === 27) next = without(next, "inverse")
    else if (code === 28) next = without(next, "hidden")
    else if (code === 29) next = without(next, "strike")
    else if (code >= 30 && code <= 37) next = { ...next, fg: paletteColor(code - 30) }
    else if (code === 39) next = without(next, "fg")
    else if (code >= 40 && code <= 47) next = { ...next, bg: paletteColor(code - 40) }
    else if (code === 49) next = without(next, "bg")
    else if (code >= 90 && code <= 97) next = { ...next, fg: paletteColor(code - 90 + 8) }
    else if (code >= 100 && code <= 107) next = { ...next, bg: paletteColor(code - 100 + 8) }
  }

  return next
}

function colorClass(layer: "fg" | "bg", color: TerminalColor): string {
  if (color.kind === "named") return `term-${layer}-${color.bright ? "bright-" : ""}${color.name}`
  if (color.kind === "palette") return `term-${layer}-palette-${color.index}`
  return `term-${layer}-truecolor`
}

const FLAG_CLASSES: readonly [Flag, string][] = [
  ["bold", "term-bold"],
  ["dim", "term-dim"],
  ["italic", "term-italic"],
  ["underline", "term-underline"],
  ["blink", "term-blink"],
  ["hidden", "term-hidden"],
  ["strike", "term-strike"],
]

export function terminalClassName(style: TerminalStyle): string {
  const fg = style.inverse ? style.bg : style.fg
  const bg = style.inverse ? style.fg : style.bg
  const names: string[] = []
  if (fg) names.push(colorClass("fg", fg))
  if (bg) names.push(colorClass("bg", bg))
  for (const [flag, name] of FLAG_CLASSES) if (style[flag]) names.push(name)
  return names.join(" ")
}

export function parseTerminalText(input: string): TerminalSegment[] {
  const lines: Cell[][] = [[]]
  let line = lines[0]
  let col = 0
  let style = BLANK

  const blankTo = (to: number) => {
    for (let j = 0; j <= to && j < line.length; j++) line[j] = { ch: " ", style: BLANK }
  }

  const eraseLine = (mode: number) => {
    if (mode === 0) line.length = Math.min(line.length, col)
    else if (mode === 1) blankTo(col)
    else if (mode === 2) blankTo(line.length - 1)
  }

  let i = 0
  while (i < input.length) {
    const ch = input[i]

    if (ch === ESC) {
      const kind = input[i + 1]
      if (kind === undefined) break

      if (kind === "[") {
        let j = i + 2
        while (j < input.length && input.charCodeAt(j) >= 0x20 && input.charCodeAt(j) <= 0x3f) j++
        if (j >= input.length) break
        const final = input[j]
        const params = input.slice(i + 2, j)
        if (final === "m") style = applyCodes(style, params)
        else if (final === "K") eraseLine(params === "" ? 0 : Number(params))
        i = j + 1
        continue
      }

      if (kind === "]") {
        const bel = input.indexOf("\u0007", i + 2)
        const st = input.indexOf(`${ESC}\\`, i + 2)
        const ends = [bel === -1 ? Infinity : bel + 1, st === -1 ? Infinity : st + 2]
        const end = Math.min(...ends)
        if (end === Infinity) break
        i = end
        continue
      }

      i += 2
      continue
    }

    if (ch === "\n") {
      line = []
      lines.push(line)
      col = 0
    } else if (ch === "\r") {
      col = 0
    } else if (ch === "\b") {
      if (col > 0) col--
    } else {
      while (line.length < col) line.push({ ch: " ", style: BLANK })
      line[col] = { ch, style }
      col++
    }
    i++
  }

  const segments: TerminalSegment[] = []
  let lastKey: string | null = null

  const push = (ch: string, cellStyle: TerminalStyle) => {
    const key = terminalClassName(cellStyle)
    const last = segments[segments.length - 1]
    if (last && key === lastKey) {
      last.text += ch
      return
    }
    segments.push({ text: ch, style: cellStyle })
    lastKey = key
  }

  lines.forEach((cells, n) => {
    if (n > 0) push("\n", segments[segments.length - 1]?.style ?? BLANK)
    for (const cell of cells) push(cell.ch, cell.style)
  })

  return segments
}

const URL_START = /\b(?:https?:\/\/|www\.)[^\s<>"'`]+/gi
const TRAILING = new Set([".", ",", ";", ":", "!", "?", "'", '"'])
const LOCAL_CHAR = /[A-Za-z0-9._%+-]/
const DOMAIN_CHAR = /[A-Za-z0-9.-]/

function trimUrl(raw: string): string {
  let end = raw.length
  let opens = 0
  let closes = 0
  for (const ch of raw) {
    if (ch === "(") opens++
    else if (ch === ")") closes++
  }
  while (end > 0) {
    const last = raw[end - 1]
    if (TRAILING.has(last)) end--
    else if (last === ")" && closes > opens) {
      closes--
      end--
    } else break
  }
  return raw.slice(0, end)
}

function findEmails(text: string, from: number, to: number, out: TextLink[]) {
  let at = text.indexOf("@", from)
  while (at !== -1 && at < to) {
    let start = at
    while (start > from && LOCAL_CHAR.test(text[start - 1])) start--
    let end = at + 1
    while (end < to && DOMAIN_CHAR.test(text[end])) end++
    while (end > at + 1 && (text[end - 1] === "." || text[end - 1] === "-")) end--

    const domain = text.slice(at + 1, end)
    const dot = domain.lastIndexOf(".")
    const tld = dot === -1 ? "" : domain.slice(dot + 1)
    if (start < at && dot > 0 && /^[A-Za-z]{2,}$/.test(tld) && !domain.startsWith(".") && !domain.includes("..")) {
      out.push({ start, end, href: `mailto:${text.slice(start, end)}` })
      at = text.indexOf("@", end)
    } else {
      at = text.indexOf("@", at + 1)
    }
  }
}

export function findTextLinks(text: string): TextLink[] {
  const links: TextLink[] = []
  let cursor = 0

  for (const match of text.matchAll(URL_START)) {
    const start = match.index ?? 0
    const url = trimUrl(match[0])
    const host = url.replace(/^(?:https?:\/\/|www\.)/i, "")
    if (!/^[A-Za-z0-9]/.test(host)) continue

    findEmails(text, cursor, start, links)
    links.push({ start, end: start + url.length, href: /^www\./i.test(url) ? `https://${url}` : url })
    cursor = start + match[0].length
  }
  findEmails(text, cursor, text.length, links)

  return links.sort((a, b) => a.start - b.start)
}

function withLinks(text: string): React.ReactNode {
  const links = findTextLinks(text)
  if (links.length === 0) return text

  const parts: React.ReactNode[] = []
  let last = 0
  for (const link of links) {
    if (link.start > last) parts.push(text.slice(last, link.start))
    parts.push(
      <a
        key={link.start}
        className="underline underline-offset-2"
        href={link.href}
        rel="noopener noreferrer"
        target="_blank"
      >
        {text.slice(link.start, link.end)}
      </a>
    )
    last = link.end
  }
  if (last < text.length) parts.push(text.slice(last))
  return parts
}

export function TerminalText({ children = "", linkify = false }: { children?: string; linkify?: boolean }) {
  const segments = React.useMemo(() => parseTerminalText(children), [children])

  return (
    <>
      {segments.map((segment, index) => (
        <span key={index} className={terminalClassName(segment.style) || undefined}>
          {linkify ? withLinks(segment.text) : segment.text}
        </span>
      ))}
    </>
  )
}
