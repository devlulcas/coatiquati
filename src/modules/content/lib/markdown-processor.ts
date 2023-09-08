import { micromark } from 'micromark';
import { gfm, gfmHtml } from 'micromark-extension-gfm';

type MarkdownString = string;
type HTMLString = string;

export function processMarkdown(markdown: MarkdownString): HTMLString {
  return micromark(markdown, {
    extensions: [gfm()],
    htmlExtensions: [gfmHtml()],
  });
}
