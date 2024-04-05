import type { ContentWithImage, ContentWithRichTextPreview, ContentWithVideo } from '@/modules/content/types/content';
import { ContributionRepository } from '@/modules/contributions/repositories/contribution-repository';
import { db } from '@/modules/database/db';
import { topicTable } from '@/modules/database/schema/topic';
import type { PaginationSchemaWithSearchAndFilter } from '@/modules/database/types/pagination';
import { log } from '@/modules/logging/lib/pino';
import { contentStatus } from '@/shared/constants/content-status';
import { eq } from 'drizzle-orm';
import type { NewTopic, Topic, TopicWithContentArray, UpdateTopic } from '../types/topic';

export class TopicRepository {
  constructor(private readonly contributionRepository: ContributionRepository = new ContributionRepository()) {}

  async createTopic(topic: NewTopic): Promise<number> {
    try {
      const newTopic = await db.insert(topicTable).values(topic).returning({ id: topicTable.id }).get();
      return newTopic.id;
    } catch (error) {
      log.error('Erro ao criar tópico', error);
      throw new Error('Erro ao criar tópico');
    }
  }

  async getTopics(params: PaginationSchemaWithSearchAndFilter): Promise<Topic[]> {
    try {
      return db.query.topicTable.findMany({
        limit: params.take,
        offset: params.skip,
        where: (fields, operators) => {
          const filterByContent = operators.or(
            operators.like(fields.title, `%${params.search}%`),
            operators.like(fields.description, `%${params.search}%`),
          );

          if (params.showDrafts) {
            return filterByContent;
          }

          return operators.and(filterByContent, operators.eq(fields.status, contentStatus.PUBLISHED));
        },
        with: {
          author: true,
          contributors: {
            with: {
              user: true,
            },
          },
        },
      });
    } catch (error) {
      log.error('Erro ao buscar tópicos', { error, params });
      throw new Error('Erro ao buscar tópicos');
    }
  }

  async getTopicById(id: number, showDrafts = false): Promise<Topic> {
    const query = db.query.topicTable.findFirst({
      where: (fields, operators) => {
        if (showDrafts) {
          return operators.eq(fields.id, id);
        }

        return operators.and(operators.eq(fields.id, id), operators.eq(fields.status, contentStatus.PUBLISHED));
      },
      with: {
        author: true,
        contributors: {
          with: {
            user: true,
          },
        },
      },
    });

    const data = await query.catch(error => {
      log.error('Erro ao buscar tópico. Erro interno', { error, id });
      throw new Error('Falha ao buscar tópico. Erro interno');
    });

    if (!data) {
      log.error('Erro ao buscar tópico. Tópico não encontrada', { id });
      throw new Error('Erro ao buscar tópico. Trilha não encontrada');
    }

    return data;
  }

  async getTopicWithContentArray(id: number, showDrafts = false): Promise<TopicWithContentArray> {
    const query = db.query.topicTable.findFirst({
      where: (fields, operators) => {
        if (showDrafts) {
          return operators.eq(fields.id, id);
        }

        return operators.and(operators.eq(fields.id, id), operators.eq(fields.status, contentStatus.PUBLISHED));
      },
      with: {
        author: true,
        contributors: {
          with: {
            user: true,
          },
        },
        contents: {
          with: {
            author: true,
            richText: true,
            image: true,
            video: true,
            contributors: {
              with: {
                user: true,
              },
            },
          },
        },
      },
    });

    const data = await query.catch(error => {
      log.error('Erro ao buscar tópico. Erro interno', { error, id });
      throw new Error('Falha ao buscar tópico. Erro interno');
    });

    if (!data) {
      log.error('Erro ao buscar tópico. Trilha não encontrada', { id });
      throw new Error('Erro ao buscar tópico');
    }

    const withImage: ContentWithImage[] = [];
    const withRTE: ContentWithRichTextPreview[] = [];
    const withVideo: ContentWithVideo[] = [];

    data.contents.forEach(content => {
      console.log('----------------');
      console.log(content);
      if (content.image?.contentType === 'image') {
        const image: ContentWithImage = {
          active: content.active,
          author: content.author,
          contributors: content.contributors,
          createdAt: content.createdAt,
          contentType: 'image',
          id: content.id,
          updatedAt: content.updatedAt,
          deletedAt: content.deletedAt,
          title: content.title,
          content: {
            baseContentId: content.image.baseContentId,
            contentType: 'image',
            createdAt: content.image.createdAt,
            id: content.image.id,
            updatedAt: content.image.updatedAt,
            deletedAt: content.image.deletedAt,
            src: content.image.src,
            description: content.image.description,
          },
        };

        withImage.push(image);
      }

      if (content.richText?.contentType === 'rich_text') {
        const rt: ContentWithRichTextPreview = {
          active: content.active,
          author: content.author,
          contributors: content.contributors,
          createdAt: content.createdAt,
          contentType: 'rich_text',
          id: content.id,
          updatedAt: content.updatedAt,
          deletedAt: content.deletedAt,
          title: content.title,
          content: {
            baseContentId: content.richText.baseContentId,
            contentType: 'rich_text',
            createdAt: content.richText.createdAt,
            id: content.richText.id,
            updatedAt: content.richText.updatedAt,
            deletedAt: content.richText.deletedAt,
            previewAsJson: content.richText.previewAsJson,
          },
        };

        withRTE.push(rt);
      }

      if (content.video?.contentType === 'video') {
        const video: ContentWithVideo = {
          active: content.active,
          author: content.author,
          contributors: content.contributors,
          createdAt: content.createdAt,
          contentType: 'video',
          id: content.id,
          updatedAt: content.updatedAt,
          deletedAt: content.deletedAt,
          title: content.title,
          content: {
            baseContentId: content.video.baseContentId,
            contentType: 'video',
            createdAt: content.video.createdAt,
            id: content.video.id,
            updatedAt: content.video.updatedAt,
            deletedAt: content.video.deletedAt,
            src: content.video.src,
            description: content.video.description,
          },
        };

        withVideo.push(video);
      }
    });

    const unifiedContents = [...withImage, ...withRTE, ...withVideo].sort((a, b) => a.id - b.id);

    return {
      ...data,
      contents: unifiedContents,
    };
  }

  async updateTopic(topic: UpdateTopic): Promise<void> {
    return db.transaction(async tx => {
      try {
        await tx.update(topicTable).set(topic).where(eq(topicTable.id, topic.id)).execute();
        await this.contributionRepository.save(topic.contributorId, { topicId: topic.id }, tx);
      } catch (error) {
        log.error('Erro ao atualizar tópico', error);
        throw new Error('Erro ao atualizar tópico');
      }
    });
  }

  async enableTopic(id: number): Promise<void> {
    try {
      await db.update(topicTable).set({ status: contentStatus.PUBLISHED }).where(eq(topicTable.id, id)).execute();
    } catch (error) {
      log.error('Erro ao habilitar tópico', error);
      throw new Error('Erro ao habilitar tópico');
    }
  }

  async omitTopic(id: number): Promise<void> {
    try {
      await db.update(topicTable).set({ status: contentStatus.DRAFT }).where(eq(topicTable.id, id)).execute();
    } catch (error) {
      log.error('Erro ao omitir tópico', error);
      throw new Error('Erro ao omitir tópico');
    }
  }
}
