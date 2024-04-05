import { BaseContentRepository } from '@/modules/content/repositories/base-content-repository';
import { db } from '@/modules/database/db';
import { contentRichTextTable, type ContentInsert } from '@/modules/database/schema/content';
import { log } from '@/modules/logging/lib/pino';
import type { JSONContent } from '@tiptap/core';

export class RichTextContentRepository {
  constructor(private readonly baseContentRepository: BaseContentRepository = new BaseContentRepository()) {}

  async getByContentId(contentId: number) {
    const resultRichtext = await db.query.contentRichTextTable.findFirst({
      columns: { previewAsJson: false },
      where: (fields, operators) => operators.eq(fields.baseContentId, contentId),
      with: {
        content: {
          with: {
            author: true,
            contributors: { with: { user: true } },
            topic: {
              with: {
                trail: {
                  with: {
                    author: true,
                    contributors: { with: { user: true } },
                    category: true,
                  },
                },
                author: true,
                contributors: { with: { user: true } },
              },
            },
          },
        },
      },
    });

    if (!resultRichtext) {
      log.error('Erro ao buscar conteúdo de rich text', { contentId });
      throw new Error('Erro ao buscar conteúdo de rich text com id = ' + contentId);
    }

    return resultRichtext;
  }

  async upsert(baseContent: ContentInsert, richText: JSONContent): Promise<number> {
    return db.transaction(async tx => {
      try {
        const newContentId = await this.baseContentRepository.upsertBaseContent(baseContent, tx);

        const data = {
          asJson: richText,
          previewAsJson: this.getPreview(richText),
          baseContentId: newContentId,
        };

        await tx
          .insert(contentRichTextTable)
          .values(data)
          .onConflictDoUpdate({ target: [contentRichTextTable.baseContentId, contentRichTextTable.id], set: data })
          .execute();

        return newContentId;
      } catch (error) {
        log.error('Erro ao criar conteúdo de rich text.', { baseContent, richText, error });
        tx.rollback();
        throw new Error('Erro ao criar conteúdo de rich text com id = ' + richText.contentId);
      }
    });
  }

  private getPreview(jsonContent: JSONContent): JSONContent {
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
}
