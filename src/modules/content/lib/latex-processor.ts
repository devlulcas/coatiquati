import { convertToHtml } from '@unified-latex/unified-latex-to-hast';
import { parse } from '@unified-latex/unified-latex-util-parse';

type LaTexString = string;
type HTMLString = string;

export function processLaTex(latex: LaTexString): HTMLString {
  let output = parse(latex);
  return convertToHtml(output);
}
