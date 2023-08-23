import { micromark } from 'micromark'
import { gfm, gfmHtml } from 'micromark-extension-gfm'

type MarkdownString = string;
type HTMLString = string;

export async function processMarkdown(markdown: MarkdownString): Promise<HTMLString> {
  return micromark(markdown, {
    extensions: [gfm()],
    htmlExtensions: [gfmHtml()]
  })
}
