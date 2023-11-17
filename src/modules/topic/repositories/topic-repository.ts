import { CONTENT_DB_FIELDS, ContentRepository } from '@/modules/content/repositories/content-repository';
import type { Content } from '@/modules/content/types/content';
import { db } from '@/modules/database/db';
import { topicContributionTable } from '@/modules/database/schema/contribution';
import { topicTable } from '@/modules/database/schema/topic';
import type { PaginationSchemaWithSearch } from '@/modules/database/types/pagination';
import { log } from '@/modules/logging/lib/pino';
import { CONTRIBUTOR_DB_FIELDS } from '@/modules/user/repositories/user-repository';
import { contentStatus } from '@/shared/constants/content-status';
import { eq } from 'drizzle-orm';
import type { NewTopic, Topic, TopicWithContentArray, UpdateTopic } from '../types/topic';

export const TOPIC_DB_FIELDS = Object.freeze({
  id: true,
  title: true,
  description: true,
  thumbnail: true,
  status: true,
  createdAt: true,
  updatedAt: true,
  trailId: true,
});

export class TopicRepository {
  constructor(private readonly contentRepository: ContentRepository = new ContentRepository()) {}

  async createTopic(topic: NewTopic, database = db): Promise<Topic> {
    try {
      const newTopic = database.insert(topicTable).values(topic).returning({ id: topicTable.id }).get();
      const data = await this.getTopicById(newTopic.id, database);
      return data;
    } catch (error) {
      log.error('Erro ao criar tópico', error);
      throw new Error('Erro ao criar tópico');
    }
  }

  async getTopics(params: PaginationSchemaWithSearch, database = db): Promise<Topic[]> {
    try {
      return database.query.topicTable.findMany({
        columns: TOPIC_DB_FIELDS,
        limit: params.take,
        offset: params.skip,
        where: (fields, operators) => {
          return operators.or(
            operators.like(fields.title, `%${params.search}%`),
            operators.like(fields.description, `%${params.search}%`),
          );
        },
        with: {
          author: {
            columns: CONTRIBUTOR_DB_FIELDS,
          },
          contributors: {
            with: {
              user: {
                columns: CONTRIBUTOR_DB_FIELDS,
              },
            },
          },
        },
      });
    } catch (error) {
      log.error('Erro ao buscar tópicos', { error, params });
      throw new Error('Erro ao buscar tópicos');
    }
  }

  async getTopicById(id: number, database = db): Promise<Topic> {
    const query = database.query.topicTable.findFirst({
      columns: TOPIC_DB_FIELDS,
      where: (fields, operators) => {
        return operators.eq(fields.id, id);
      },
      with: {
        author: {
          columns: CONTRIBUTOR_DB_FIELDS,
        },
        contributors: {
          with: {
            user: {
              columns: CONTRIBUTOR_DB_FIELDS,
            },
          },
        },
      },
    });

    const data: Topic | undefined = await query.catch(error => {
      log.error('Erro ao buscar tópico. Erro interno', { error, id });
      throw new Error('Falha ao buscar tópico. Erro interno');
    });

    if (!data) {
      log.error('Erro ao buscar tópico. Trilha não encontrada', { id });
      throw new Error('Erro ao buscar tópico. Trilha não encontrada');
    }

    return data;
  }

  async getTopicWithContentArray(id: number, database = db): Promise<TopicWithContentArray> {
    const query = database.query.topicTable.findFirst({
      columns: TOPIC_DB_FIELDS,
      where: (fields, operators) => {
        return operators.eq(fields.id, id);
      },
      with: {
        contents: {
          columns: CONTENT_DB_FIELDS,
          with: {
            author: {
              columns: CONTRIBUTOR_DB_FIELDS,
            },
            contributors: {
              with: {
                user: {
                  columns: CONTRIBUTOR_DB_FIELDS,
                },
              },
            },
          },
        },
        author: {
          columns: CONTRIBUTOR_DB_FIELDS,
        },
        contributors: {
          with: {
            user: {
              columns: CONTRIBUTOR_DB_FIELDS,
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

    // Tenho quase certeza que essa não é a forma correta de fazer isso
    const filledContentsPromises = data.contents.map(content => {
      switch (content.contentType) {
        case 'file':
          return this.contentRepository.getContentWithFile(content);
        case 'image':
          return this.contentRepository.getContentWithImage(content);
        case 'video':
          return this.contentRepository.getContentWithVideo(content);
        case 'rich_text':
          return this.contentRepository.getContentWithRichTextPreview(content);
        default:
          throw new Error('Tipo de conteúdo inválido');
      }
    });

    const filledContents: Content[] = await Promise.all(filledContentsPromises).catch(error => {
      log.error('Erro ao buscar conteúdos do tópico. Erro interno', { error, id });
      throw new Error('Falha ao buscar conteúdos do tópico. Erro interno');
    });

    const dataWithFilledContents: TopicWithContentArray = {
      ...data,
      contents: filledContents,
    };

    return dataWithFilledContents;
  }

  async updateTopic(topic: UpdateTopic, database = db): Promise<Topic> {
    const { id, contributorId, ...updatedData } = topic;

    const updatedAt = new Date().toISOString();

    return database.transaction(async tx => {
      try {
        tx.update(topicTable)
          .set({ ...updatedData, updatedAt })
          .where(eq(topicTable.id, id))
          .execute();

        tx.update(topicContributionTable)
          .set({ topicId: id, userId: contributorId, contributedAt: updatedAt })
          .where(eq(topicContributionTable.topicId, id))
          .execute();

        const data = await this.getTopicById(id, tx);

        return data;
      } catch (error) {
        log.error(error);
        throw new Error('Erro ao atualizar tópico');
      }
    });
  }

  async enableTopic(id: number, database = db): Promise<void> {
    const updatedAt = new Date().toISOString();
    try {
      await database
        .update(topicTable)
        .set({ status: contentStatus.PUBLISHED, updatedAt })
        .where(eq(topicTable.id, id))
        .execute();
    } catch (error) {
      log.error('Erro ao habilitar tópico', error);
      throw new Error('Erro ao habilitar tópico');
    }
  }

  async omitTopic(id: number, database = db): Promise<void> {
    const updatedAt = new Date().toISOString();
    try {
      await database
        .update(topicTable)
        .set({ status: contentStatus.DRAFT, updatedAt })
        .where(eq(topicTable.id, id))
        .execute();
    } catch (error) {
      log.error('Erro ao omitir tópico', error);
      throw new Error('Erro ao omitir tópico');
    }
  }
}
