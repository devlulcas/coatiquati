import { contentStatus, type ContentStatus } from '@/shared/constants/content-status';
import { faker } from '@faker-js/faker';
import { createClient } from '@libsql/client';
import { config } from 'dotenv';
import { drizzle } from 'drizzle-orm/libsql';
import { roles } from '../auth/constants/roles';
import { schema } from './schema';

config({ path: '.env.local' });

const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) throw new Error('DATABASE_URL is not defined');

const DATABASE_AUTH_TOKEN = process.env.DATABASE_AUTH_TOKEN;
if (!DATABASE_AUTH_TOKEN) throw new Error('DATABASE_AUTH_TOKEN is not defined');

const sqlite = createClient({ url: DATABASE_URL, authToken: DATABASE_AUTH_TOKEN });
const db = drizzle(sqlite, { schema });

async function seedDatabase() {
  try {
    // Create users first
    const userIds = Array.from({ length: 10 }).map(() => faker.string.uuid().substring(0, 8));

    await Promise.all(
      userIds.map(async it => {
        return db.insert(schema.userTable).values({
          id: it,
          role: roles.ADMIN,
          email: faker.internet.email(),
          username: faker.internet.userName(),
          passwordHash: faker.internet.password(),
          avatar: faker.image.urlPicsumPhotos(),
          verifiedAt: faker.date.past(),
        });
      }),
    );

    // Create trails
    const trailIds = Array.from({ length: 10 }).map(() => faker.number.int());

    await Promise.all(
      trailIds.map(async it => {
        return db.insert(schema.trailTable).values({
          id: it,
          title: faker.lorem.words(3),
          description: faker.lorem.paragraph(),
          authorId: faker.helpers.arrayElement(userIds),
          thumbnail: faker.image.urlPicsumPhotos(),
          category: faker.lorem.word(),
          status: faker.helpers.arrayElement<ContentStatus>(Object.values(contentStatus)),
        });
      }),
    )

    // // Create topics
    // await Promise.all(
    //   Array.from({ length: 8 }).map(() =>
    //     db.insert(schema.topicTable).values({
    //       authorId: faker.helpers.arrayElement(userIds),
    //       title: faker.lorem.words(3),
    //       description: faker.lorem.paragraph(),
    //       trailId: faker.helpers.arrayElement(trailIds),
    //       status: faker.helpers.arrayElement<ContentStatus>(Object.values(contentStatus)),
    //       thumbnail: faker.image.urlPicsumPhotos(),
    //     }),
    //   ),
    // );

    // // Create some trail subscriptions
    // await Promise.all(
    //   userIds.map(userId =>
    //     db.insert(schema.trailSubscriptionTable).values({
    //       userId,
    //       trailId: faker.helpers.arrayElement(trailIds),
    //     }),
    //   ),
    // );

    // // Create some todos
    // await Promise.all(
    //   userIds.map(userId =>
    //     db.insert(schema.todos).values({
    //       text: faker.lorem.sentence(),
    //       userId,
    //       completed: faker.datatype.boolean(),
    //       createdAt: faker.date.past(),
    //       updatedAt: new Date(),
    //     }),
    //   ),
    // );

    // // Create some pomodoros
    // await Promise.all(
    //   userIds.map(userId =>
    //     db.insert(schema.pomodoroSessions).values({
    //       userId,
    //       startTime: faker.date.past(),
    //       endTime: faker.date.recent(),
    //       type: 'pomodoro',
    //       completed: true,
    //       createdAt: faker.date.past(),
    //       deletedAt: null,
    //     }),
    //   ),
    // );

    console.log('Database seeded successfully!');
  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    await sqlite.close();
  }
}

seedDatabase();
