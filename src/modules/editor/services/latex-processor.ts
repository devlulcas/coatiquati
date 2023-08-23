import { parse } from "@unified-latex/unified-latex-util-parse";
import { convertToHtml } from "@unified-latex/unified-latex-to-hast";

type LaTexString = string;
type HTMLString = string;

export async function processLaTex(latex: LaTexString): Promise<HTMLString> {
  let output = parse(latex);
  return convertToHtml(output);
}
