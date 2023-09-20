import {
  CONTENT_DB_FIELDS,
  type ContentRepository,
} from '@/modules/content/repositories/content-repository';
import type { Content } from '@/modules/content/types/content';
import { db } from '@/modules/database/db';
import { topicTable } from '@/modules/database/schema/topic';
import type { PaginationSchemaWithSearch } from '@/modules/database/types/pagination';
import { CONTRIBUTOR_DB_FIELDS } from '@/modules/user/repositories/user-repository';
import { eq } from 'drizzle-orm';
import type { NewTopic, Topic, TopicWithContentArray } from '../types/topic';

export type TopicRepository = {
  createTopic: (topic: NewTopic) => Promise<Topic>;
  getTopics: (params: PaginationSchemaWithSearch) => Promise<Topic[]>;
  updateTopic: (id: number, topic: Partial<NewTopic>) => Promise<Topic>;
  getTopicWithContentArray: (id: number) => Promise<TopicWithContentArray>;
};

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

export class DrizzleTopicRepository implements TopicRepository {
  constructor(private readonly contentRepository: ContentRepository) {}

  async createTopic(topic: NewTopic): Promise<Topic> {
    try {
      const newTopic = db.insert(topicTable).values(topic).returning().get();

      const data = await db.query.topicTable.findFirst({
        columns: TOPIC_DB_FIELDS,
        where: (fields, operators) => {
          return operators.eq(fields.id, newTopic.id);
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

      if (!data) {
        throw new Error('Erro ao criar trilha');
      }

      return data;
    } catch (error) {
      console.error(error);
      throw new Error('Erro ao criar trilha');
    }
  }

  async getTopics(params: PaginationSchemaWithSearch): Promise<Topic[]> {
    try {
      return db.query.topicTable.findMany({
        columns: TOPIC_DB_FIELDS,
        limit: params.take,
        offset: params.skip,
        where: (fields, operators) => {
          return operators.or(
            operators.like(fields.title, `%${params.search}%`),
            operators.like(fields.description, `%${params.search}%`)
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
      console.error(error);
      throw new Error('Erro ao buscar trilhas');
    }
  }

  async getTopicWithContentArray(id: number): Promise<TopicWithContentArray> {
    try {
      const data = await db.query.topicTable.findFirst({
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

      if (!data) {
        throw new Error('Erro ao buscar trilha');
      }

      const filledContents: Content[] = await Promise.all(
        data.contents.map((content) => {
          switch (content.contentType) {
            case 'file':
              return this.contentRepository.getContentWithFile(content);
            case 'image':
              return this.contentRepository.getContentWithImage(content);
            case 'video':
              return this.contentRepository.getContentWithVideo(content);
            case 'rich_text':
              return this.contentRepository.getContentWithRichTextPreview(
                content
              );
            default:
              throw new Error('Tipo de conteúdo inválido');
          }
        })
      );

      const dataWithFilledContents: TopicWithContentArray = {
        ...data,
        contents: filledContents,
      };

      return dataWithFilledContents;
    } catch (error) {
      console.error(error);
      throw new Error('Erro ao buscar trilha');
    }
  }

  async updateTopic(id: number, topic: Partial<NewTopic>): Promise<Topic> {
    try {
      const updatedTopic = db
        .update(topicTable)
        .set({ ...topic, updatedAt: new Date().toISOString() })
        .where(eq(topicTable.id, id))
        .returning()
        .get();

      const data = await db.query.topicTable.findFirst({
        columns: TOPIC_DB_FIELDS,
        where: (fields, operators) => {
          return operators.eq(fields.id, updatedTopic.id);
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

      if (!data) {
        throw new Error('Erro ao atualizar trilha');
      }

      return data;
    } catch (error) {
      console.error(error);
      throw new Error('Erro ao atualizar trilha');
    }
  }
}
