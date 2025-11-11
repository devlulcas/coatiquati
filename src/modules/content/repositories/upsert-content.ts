import type { Transaction } from '@/modules/database/db';
import {
  contents,
  imageContents,
  richTextContents,
  videoContents,
  type InsertContent,
  type InsertImageContent,
  type InsertRichTextContent,
  type InsertVideoContent,
} from '@/modules/database/schema/content';
import { contributions } from '@/modules/database/schema/contribution';

function upsertBaseContent(tx: Transaction, content: InsertContent) {
  return tx.transaction(async (tx) => {
    // atualiza o conteúdo se já existir, mas não atualiza o userId
    const [insertedContent] = await tx
      .insert(contents)
      .values(content)
      .onConflictDoUpdate({
        target: [contents.id],
        set: { ...content, userId: undefined },
      })
      .returning({ id: contents.id });

    // um usuário pode ter várias contribuições para o mesmo conteúdo
    const [savedContribution] = await tx
      .insert(contributions)
      .values({
        userId: content.userId,
        contentId: insertedContent.id,
        trailId: null,
        topicId: null,
      })
      .returning({ id: contributions.id });

    return {
      contentId: insertedContent.id,
      contributionId: savedContribution.id,
    };
  });
}

function upsertRichTextContent(
  tx: Transaction,
  content: InsertRichTextContent
) {
  return tx.transaction(async (tx) => {
    const [insertedRichTextContent] = await tx
      .insert(richTextContents)
      .values({
        contentId: content.contentId,
        jsonContent: content.jsonContent,
      })
      .onConflictDoUpdate({
        target: [richTextContents.contentId],
        set: { jsonContent: content.jsonContent },
      })
      .returning({ id: richTextContents.id });

    return insertedRichTextContent.id;
  });
}

function upsertImageContent(tx: Transaction, content: InsertImageContent) {
  return tx.transaction(async (tx) => {
    const [insertedImageContent] = await tx
      .insert(imageContents)
      .values({
        contentId: content.contentId,
        src: content.src,
        alt: content.alt,
      })
      .onConflictDoUpdate({
        target: [imageContents.contentId],
        set: { src: content.src, alt: content.alt },
      })
      .returning({ id: imageContents.id });

    return insertedImageContent.id;
  });
}

function upsertVideoContent(tx: Transaction, content: InsertVideoContent) {
  return tx.transaction(async (tx) => {
    const [insertedVideoContent] = await tx
      .insert(videoContents)
      .values({ contentId: content.contentId, src: content.src })
      .onConflictDoUpdate({
        target: [videoContents.contentId],
        set: { src: content.src },
      })
      .returning({ id: videoContents.id });

    return insertedVideoContent.id;
  });
}

export const upsertContent = {
  base: upsertBaseContent,
  richText: upsertRichTextContent,
  image: upsertImageContent,
  video: upsertVideoContent,
};
