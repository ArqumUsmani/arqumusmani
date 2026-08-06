/**
 * Joins the last two words with a non-breaking space so a headline never
 * strands a single trailing word (a widow) on its own line at any viewport
 * width. Safe to call on any string — no-op below two words.
 */
export function preventOrphans(text: string): string {
  const lastSpace = text.lastIndexOf(" ");
  if (lastSpace === -1) return text;
  return `${text.slice(0, lastSpace)} ${text.slice(lastSpace + 1)}`;
}
