import sanitize from 'sanitize-html';

function cleanHtml(html: string) {
  return sanitize(html);
}

function htmlTagTemplateString(strings: TemplateStringsArray, ...values: unknown[]) {
  return strings.reduce((acc, str, i) => {
    const val = values[i] === null ? '' : values[i];
    return acc + str + cleanHtml(String(val));
  }, '');
}

export const html = htmlTagTemplateString;
