/**
 * Swaps the hyphen in compounds like "expert-graded" or "re-runnable" for a
 * non-breaking hyphen (U+2011, inside the fonts' latin subset), so lines never
 * break in the middle of the word. Display only: keep plain hyphens in data.
 */
export function keepHyphenated(text: string): string {
  return text.replace(/(\w)-(\w)/g, "$1‑$2");
}
