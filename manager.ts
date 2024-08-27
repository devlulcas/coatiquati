import { createClient } from '@libsql/client/web';
import { hash } from 'argon2';
import { config } from 'dotenv';
import { eq } from 'drizzle-orm';
import { drizzle } from 'drizzle-orm/libsql';
import { generateId } from 'lucia';
import { type Role } from './src/modules/auth/constants/roles';
import { schema } from './src/modules/database/schema';
import { userTable } from './src/modules/database/schema/user';

config({ path: '.env.local' });

const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) {
  throw new Error('DATABASE_URL is not defined');
}

const DATABASE_AUTH_TOKEN = process.env.DATABASE_AUTH_TOKEN;
if (!DATABASE_AUTH_TOKEN) {
  throw new Error('DATABASE_AUTH_TOKEN is not defined');
}

const sqlite = createClient({ url: DATABASE_URL, authToken: DATABASE_AUTH_TOKEN });

const db = drizzle(sqlite, { schema });

type User = {
  username: string;
  password: string;
  email: string;
  avatar: string;
};

function validateUser(user: any): User {
  if (
    typeof user.username !== 'string' ||
    user.username.length < 3 ||
    user.username.length > 31 ||
    !/^[a-z0-9_-]+$/.test(user.username)
  ) {
    throw new Error('Nome de usuário inválido');
  }

  if (typeof user.password !== 'string' || user.password.length < 6 || user.password.length > 255) {
    throw new Error('Senha inválida');
  }

  if (typeof user.email !== 'string' || user.email.length < 6 || user.email.length > 255) {
    throw new Error('Email inválido');
  }

  const avatars = ['grape.png', 'mint.png', 'original.png', 'peach.png'];

  const avatar = '/avatars/' + avatars[Math.floor(Math.random() * avatars.length)];

  return { ...user, avatar };
}

async function registerUser(user: User, role: Role) {
  const validated = validateUser(user);

  const passwordHash = await hash(validated.password, {
    memoryCost: 19456,
    timeCost: 2,
    hashLength: 32,
    parallelism: 1,
  });

  const userId = generateId(15);

  return db
    .insert(userTable)
    .values({
      id: userId,
      role: role,
      username: validated.username,
      password_hash: passwordHash,
      avatar: validated.avatar,
      email: validated.email,
      bannedAt: null,
      verifiedAt: null,
      deletedAt: null,
    })
    .run();
}

async function updateUser(username: string, role: Role) {
  return db.update(userTable).set({ role: role }).where(eq(userTable.username, username)).run();
}

async function findUser(username: string) {
  return db.select().from(userTable).where(eq(userTable.username, username)).get();
}

// Quer criar um usuário? Ou quer buscar um?
// Quer alterar a role para o que?
// Confirmar!

async function main() {}
