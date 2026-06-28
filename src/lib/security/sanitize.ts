/**
 * Server-side HTML sanitizer for rich-text content stored in Supabase.
 *
 * Blog posts, course descriptions, and any other CMS content rendered with
 * `dangerouslySetInnerHTML` MUST pass through this function first.
 *
 * This strips:
 * - <script>, <iframe>, <object>, <embed> tags (XSS)
 * - on* event handler attributes (onclick, onerror, etc.)
 * - javascript: URLs in href/src
 * - Inline styles that could exfiltrate data (position:fixed overlays)
 *
 * Allows the tags produced by TipTap (the admin rich-text editor):
 * headings, paragraphs, lists, links, bold/italic, images, blockquotes, code.
 */
import createDOMPurify from "isomorphic-dompurify";

const ALLOWED_TAGS = [
  // Headings
  "h1", "h2", "h3", "h4", "h5", "h6",
  // Text
  "p", "br", "hr", "span", "div",
  // Inline formatting
  "strong", "b", "em", "i", "u", "s", "mark", "sub", "sup", "small",
  // Lists
  "ul", "ol", "li",
  // Links & media
  "a", "img",
  // Blocks
  "blockquote", "pre", "code",
  // Tables
  "table", "thead", "tbody", "tr", "th", "td",
];

const ALLOWED_ATTR = [
  "href", "src", "alt", "title", "width", "height",
  "target", "rel", "class",
  "colspan", "rowspan",
  "loading",
];

/**
 * Sanitize untrusted HTML so it is safe to render with dangerouslySetInnerHTML.
 *
 * @param dirty - Raw HTML string from the database or user input.
 * @returns Safe HTML string with all XSS vectors removed.
 */
export function sanitizeHtml(dirty: string): string {
  if (!dirty || typeof dirty !== "string") return "";
  return createDOMPurify.sanitize(dirty, {
    ALLOWED_TAGS,
    ALLOWED_ATTR,
    ALLOW_DATA_ATTR: false,
    FORBID_TAGS: ["style", "script", "iframe", "object", "embed", "form", "input", "button"],
    FORBID_ATTR: ["style", "onerror", "onload", "onclick", "onmouseover"],
  });
}

/**
 * Sanitize a plain-text string for safe output in HTML.
 * Escapes <, >, &, ", ' so the text is never parsed as markup.
 *
 * Use this when rendering user input INSIDE JSX text (not as HTML).
 * JSX escapes automatically, but use this when storing concatenated strings.
 */
export function escapeHtml(text: string): string {
  if (!text) return "";
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
