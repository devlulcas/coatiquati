import type {
  BaseContent,
  Content,
  ContentFile,
  ContentImage,
  ContentRichTextPreview,
  ContentVideo,
  ContentWithFile,
  ContentWithImage,
  ContentWithRichTextPreview,
  ContentWithVideo,
} from '@/modules/content/types/content';
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
});

export function createTopicRepository(): TopicRepository {
  return {
    createTopic,
    getTopicWithContentArray,
    getTopics,
    updateTopic,
  };
}

async function createTopic(topic: NewTopic): Promise<Topic> {
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

async function getTopics(params: PaginationSchemaWithSearch): Promise<Topic[]> {
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

async function getTopicWithContentArray(
  id: number
): Promise<TopicWithContentArray> {
  try {
    const data = await db.query.topicTable.findFirst({
      columns: TOPIC_DB_FIELDS,
      where: (fields, operators) => {
        return operators.eq(fields.id, id);
      },
      with: {
        contents: {
          columns: {
            id: true,
            createdAt: true,
            updatedAt: true,
            title: true,
            active: true,
            contentType: true,
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
            return getContentWithFile(content);
          case 'image':
            return getContentWithImage(content);
          case 'video':
            return getContentWithVideo(content);
          case 'rich_text':
            return getContentWithRichTextPreview(content);
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

async function updateTopic(
  id: number,
  topic: Partial<NewTopic>
): Promise<Topic> {
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

// TODO: Refactor this

async function getContentWithFile(
  content: BaseContent
): Promise<ContentWithFile> {
  const resultFile: ContentFile | undefined =
    await db.query.contentFileTable.findFirst({
      where(fields, operators) {
        return operators.eq(fields.contentId, content.id);
      },
    });

  if (!resultFile) {
    throw new Error('Erro ao buscar conteúdo');
  }

  return {
    ...content,
    contentType: 'file',
    content: resultFile,
  };
}

async function getContentWithImage(
  content: BaseContent
): Promise<ContentWithImage> {
  const resultImage: ContentImage | undefined =
    await db.query.contentImageTable.findFirst({
      where(fields, operators) {
        return operators.eq(fields.contentId, content.id);
      },
    });

  if (!resultImage) {
    throw new Error('Erro ao buscar conteúdo de imagem com id = ' + content.id);
  }

  return {
    ...content,
    contentType: 'image',
    content: resultImage,
  };
}

async function getContentWithVideo(
  content: BaseContent
): Promise<ContentWithVideo> {
  const resultVideo: ContentVideo | undefined =
    await db.query.contentVideoTable.findFirst({
      where(fields, operators) {
        return operators.eq(fields.contentId, content.id);
      },
    });

  if (!resultVideo) {
    throw new Error('Erro ao buscar conteúdo de video com id = ' + content.id);
  }

  return {
    ...content,
    contentType: 'video',
    content: resultVideo,
  };
}

async function getContentWithRichTextPreview(
  content: BaseContent
): Promise<ContentWithRichTextPreview> {
  const resultRichtext: ContentRichTextPreview | undefined =
    await db.query.contentRichTextTable.findFirst({
      columns: {
        id: true,
        createdAt: true,
        updatedAt: true,
        contentId: true,
        previewAsJson: true,
      },
      where(fields, operators) {
        return operators.eq(fields.contentId, content.id);
      },
    });

  if (!resultRichtext) {
    throw new Error(
      'Erro ao buscar conteúdo de rich text com id = ' + content.id
    );
  }

  return {
    ...content,
    contentType: 'rich_text',
    content: resultRichtext,
  };
}
