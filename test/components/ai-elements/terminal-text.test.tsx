/**
 * @covers ai-terminal
 */
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { TerminalText, findTextLinks, parseTerminalText, terminalClassName } from "@/lib/terminal-text";

const ESC = "\u001b";
const text = (input: string) => parseTerminalText(input).map((s) => s.text).join("");
const classes = (input: string) => parseTerminalText(input).map((s) => terminalClassName(s.style));

describe("parseTerminalText — colours and decorations", () => {
  it("plain text is one unstyled segment", () => {
    expect(parseTerminalText("hello")).toEqual([{ text: "hello", style: {} }]);
  });

  it("maps the 8 base and 8 bright foregrounds and backgrounds", () => {
    expect(classes(`${ESC}[31mR${ESC}[0m${ESC}[102mG`)).toEqual(["term-fg-red", "term-bg-bright-green"]);
  });

  it("combines several decorations on one span", () => {
    expect(classes(`${ESC}[1;4;34mx`)).toEqual(["term-fg-blue term-bold term-underline"]);
  });

  it("each reset code turns off only its own attribute", () => {
    expect(classes(`${ESC}[1;3;31ma${ESC}[22mb${ESC}[23mc${ESC}[39md`)).toEqual([
      "term-fg-red term-bold term-italic",
      "term-fg-red term-italic",
      "term-fg-red",
      "",
    ]);
  });

  it("an empty code (ESC[m) is a full reset", () => {
    expect(classes(`${ESC}[31ma${ESC}[mb`)).toEqual(["term-fg-red", ""]);
  });

  it("256-colour: 0-15 use the named classes, 16-255 a palette class", () => {
    expect(classes(`${ESC}[38;5;1ma${ESC}[38;5;9mb${ESC}[48;5;200mc`)).toEqual([
      "term-fg-red",
      "term-fg-bright-red",
      "term-fg-bright-red term-bg-palette-200",
    ]);
  });

  it("truecolor carries a class, never an inline colour", () => {
    expect(classes(`${ESC}[38;2;10;20;30mx`)).toEqual(["term-fg-truecolor"]);
  });

  it("accepts colon-separated sub-parameters (38:5:n)", () => {
    expect(classes(`${ESC}[38:5:2mx`)).toEqual(["term-fg-green"]);
  });

  it("inverse swaps foreground and background", () => {
    expect(classes(`${ESC}[31;44;7mx`)).toEqual(["term-fg-blue term-bg-red"]);
  });

  it("dim, italic, blink, hidden and strikethrough have classes", () => {
    expect(classes(`${ESC}[2;3;5;8;9mx`)).toEqual(["term-dim term-italic term-blink term-hidden term-strike"]);
  });
});

describe("parseTerminalText — escapes that are not colour", () => {
  it("strips cursor and other control sequences", () => {
    expect(text(`a${ESC}[2Ab${ESC}[?25lc`)).toBe("abc");
  });

  it("strips OSC sequences ended by BEL or ST", () => {
    expect(text(`${ESC}]0;title\u0007a${ESC}]8;;https://x.test${ESC}\\b${ESC}]8;;${ESC}\\`)).toBe("ab");
  });

  it("drops an unfinished escape at the end instead of printing it", () => {
    expect(text(`ab${ESC}[`)).toBe("ab");
    expect(text(`ab${ESC}[31`)).toBe("ab");
    expect(text(`ab${ESC}`)).toBe("ab");
  });

  it("treats ESC + one character as a complete two-character escape", () => {
    expect(text(`a${ESC}7b${ESC}8c`)).toBe("abc");
  });
});

describe("parseTerminalText — carriage return, backspace, erase line", () => {
  it("\\r returns to column 0 and overwrites, like a terminal", () => {
    expect(text("downloading 10%\rdownloading 100%")).toBe("downloading 100%");
    expect(text("abc\rX")).toBe("Xbc");
  });

  it("\\r\\n is an ordinary line break", () => {
    expect(text("one\r\ntwo")).toBe("one\ntwo");
  });

  it("backspace steps back one column", () => {
    expect(text("ab\bc")).toBe("ac");
  });

  it("ESC[K erases to the end of the line (the usual progress redraw)", () => {
    expect(text(`50% done\r${ESC}[K100%`)).toBe("100%");
  });

  it("ESC[2K clears the whole line, ESC[1K clears up to the cursor", () => {
    expect(text(`abc${ESC}[2Kd`)).toBe("   d");
    expect(text(`abcdef\b\b${ESC}[1K`)).toBe("     f");
  });

  it("overwritten characters take the new style", () => {
    expect(parseTerminalText(`aaa\r${ESC}[31mb`)).toEqual([
      { text: "b", style: { fg: { kind: "named", name: "red", bright: false } } },
      { text: "aa", style: {} },
    ]);
  });
});

describe("findTextLinks", () => {
  it("finds http(s) and www links and trims trailing punctuation", () => {
    expect(findTextLinks("see https://example.com/a?b=1. and www.example.org, ok")).toEqual([
      { start: 4, end: 29, href: "https://example.com/a?b=1" },
      { start: 35, end: 50, href: "https://www.example.org" },
    ]);
  });

  it("keeps a balanced closing paren and drops an unbalanced one", () => {
    expect(findTextLinks("(https://x.test/a_(b))")[0].href).toBe("https://x.test/a_(b)");
  });

  it("finds email addresses as mailto links", () => {
    expect(findTextLinks("mail ops@example.com now")).toEqual([
      { start: 5, end: 20, href: "mailto:ops@example.com" },
    ]);
  });

  it("never links other schemes", () => {
    expect(findTextLinks("javascript:alert(1) ftp://x.test data:text/html,hi")).toEqual([]);
  });

  it("stays fast on hostile input (no catastrophic backtracking)", () => {
    const hostile =
      "a".repeat(200_000) + "@" + "b.".repeat(100_000) + "!" + "mailto:".repeat(20_000) + "http://".repeat(20_000) + "x@".repeat(50_000);
    const started = performance.now();
    findTextLinks(hostile);
    expect(performance.now() - started).toBeLessThan(500);
  });
});

describe("TerminalText", () => {
  it("renders styled spans with classes, never inline styles", () => {
    const { container } = render(<TerminalText>{`${ESC}[31mfail${ESC}[0m ok`}</TerminalText>);
    expect(screen.getByText("fail")).toHaveClass("term-fg-red");
    expect(container.querySelector("[style]")).toBeNull();
  });

  it("links only when asked, opening in a new tab safely", () => {
    const { rerender } = render(<TerminalText>{"docs at https://example.com"}</TerminalText>);
    expect(screen.queryByRole("link")).toBeNull();
    rerender(<TerminalText linkify>{"docs at https://example.com"}</TerminalText>);
    const link = screen.getByRole("link", { name: "https://example.com" });
    expect(link).toHaveAttribute("href", "https://example.com");
    expect(link).toHaveAttribute("target", "_blank");
    expect(link).toHaveAttribute("rel", "noopener noreferrer");
  });

  it("a link inside a coloured span keeps the colour", () => {
    render(<TerminalText linkify>{`${ESC}[32mhttps://example.com${ESC}[0m`}</TerminalText>);
    expect(screen.getByRole("link").closest(".term-fg-green")).not.toBeNull();
  });
});
