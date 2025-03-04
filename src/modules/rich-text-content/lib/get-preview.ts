import type { JSONContent } from '@tiptap/core';

export function getPreview(jsonContent: JSONContent): JSONContent {
  let validContent = [];

  const initialContent = jsonContent.content ?? [];

  for (const item of initialContent) {
    if (validContent.length === 3) {
      break;
    }

    if (item.content?.length === 0) {
      continue;
    }

    validContent.push(item);
  }

  return {
    ...jsonContent,
    content: validContent,
  };
}
