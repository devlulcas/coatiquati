import { BaseContentRepository } from '@/modules/content/repositories/base-content-repository';
import { db } from '@/modules/database/db';
import { contentRichTextTable, type ContentInsert } from '@/modules/database/schema/content';
import { log } from '@/modules/logging/lib/pino';
import type { JSONContent } from '@tiptap/core';
import { eq } from 'drizzle-orm';

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
        log.info('Criando conteúdo base e de rich text.');

        const newContentId = await this.baseContentRepository.upsertBaseContent(baseContent, tx);

        log.info('Conteúdo base criado com sucesso.', { newContentId });

        const data = {
          asJson: richText,
          previewAsJson: this.getPreview(richText),
          baseContentId: newContentId,
        };

        const alreadyExists = await db.query.contentRichTextTable.findFirst({
          where: (fields, operators) => operators.eq(fields.baseContentId, newContentId),
        });

        if (alreadyExists) {
          await tx
            .update(contentRichTextTable)
            .set(data)
            .where(eq(contentRichTextTable.baseContentId, newContentId))
            .execute();
        } else {
          await tx.insert(contentRichTextTable).values(data).execute();
        }

        log.info('Conteúdo de rich text criado com sucesso.', { newContentId });

        return newContentId;
      } catch (error) {
        console.error(error);
        log.error('Erro ao criar conteúdo de rich text.', error instanceof Error ? error.message : String(error));
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
