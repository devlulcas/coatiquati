import type { ContentWithImage, ContentWithRichTextPreview, ContentWithVideo } from '@/modules/content/types/content';
import { ContributionRepository } from '@/modules/contributions/repositories/contribution-repository';
import { db } from '@/modules/database/db';
import { topicTable } from '@/modules/database/schema/topic';
import type { PaginationSchemaWithSearch } from '@/modules/database/types/pagination';
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

  async getTopics(params: PaginationSchemaWithSearch): Promise<Topic[]> {
    try {
      return db.query.topicTable.findMany({
        limit: params.take,
        offset: params.skip,
        where: (fields, operators) => {
          return operators.or(
            operators.like(fields.title, `%${params.search}%`),
            operators.like(fields.description, `%${params.search}%`),
          );
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

  async getTopicById(id: number): Promise<Topic> {
    const query = db.query.topicTable.findFirst({
      where: (fields, operators) => {
        return operators.eq(fields.id, id);
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
      log.error('Erro ao buscar tópico. Trilha não encontrada', { id });
      throw new Error('Erro ao buscar tópico. Trilha não encontrada');
    }

    return data;
  }

  async getTopicWithContentArray(id: number): Promise<TopicWithContentArray> {
    const query = db.query.topicTable.findFirst({
      where: (fields, operators) => {
        return operators.eq(fields.id, id);
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
      if (content.image.contentType === 'image') {
        withImage.push({
          ...content,
          contentType: 'image',
          content: content.image,
        });
      }

      if (content.richText.contentType === 'rich_text') {
        withRTE.push({
          ...content,
          contentType: 'rich_text',
          content: content.richText,
        });
      }

      if (content.video.contentType === 'video') {
        withVideo.push({
          ...content,
          contentType: 'video',
          content: content.video,
        });
      }
    });

    return {
      ...data,
      contents: [...withImage, ...withRTE, ...withVideo].sort((a, b) => a.id - b.id),
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
