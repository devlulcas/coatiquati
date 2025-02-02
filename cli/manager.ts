import * as p from '@clack/prompts';
import { intro, outro } from '@clack/prompts';
import { createClient } from '@libsql/client/web';
import { hash } from 'argon2';
import { config } from 'dotenv';
import { eq } from 'drizzle-orm';
import { drizzle } from 'drizzle-orm/libsql';
import { generateId } from 'lucia';
import { type Role, roles } from '../src/modules/auth/constants/roles';
import { schema } from '../src/modules/database/schema';
import { userTable } from '../src/modules/database/schema/user';

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

async function registerUser(user: User, role: Role) {
  const passwordHash = await hash(user.password, {
    memoryCost: 19456,
    timeCost: 2,
    hashLength: 32,
    parallelism: 1,
  });

  const userId = generateId(15);

  const data = {
    id: userId,
    role: role,
    username: user.username,
    password_hash: passwordHash,
    avatar: user.avatar,
    email: user.email,
    bannedAt: null,
    verifiedAt: null,
    deletedAt: null,
  }

  return db
    .insert(userTable)
    .values(data)
    .onConflictDoUpdate({
      target: userTable.email,
      set: data
    });
}

async function updateUser(username: string, role: Role) {
  return db.update(userTable).set({ role: role }).where(eq(userTable.username, username)).run();
}

async function findUserByUsername(username: string) {
  return db.select().from(userTable).where(eq(userTable.username, username)).get();
}

async function findUserByEmail(email: string) {
  return db.select().from(userTable).where(eq(userTable.email, email)).get();
}

async function withLoading<T>(promise: Promise<T>, opts: { start: string, stop: string, error: string, exit: boolean }) {
  const s = p.spinner();
  try {
    s.start(opts.start);
    const data = await promise;
    return data;
  } catch (error) {
    s.stop();
    const message = error instanceof Error ? error.message : error;
    outro(`${opts.error} - ${message}`);
    if (opts.exit) {
      process.exit(1);
    }
  } finally {
    s.stop(opts.stop);
  }
}

async function promptUserEmail() {
  const email = await p.text({
    message: 'Digite o email que deseja buscar ou criar:',
    validate: (value) => {
      if (value.length < 6) {
        return 'Email inválido: muito curto, deve ter no mínimo 6 caracteres';
      }

      if (value.length > 255) {
        return 'Email inválido: muito longo, deve ter no máximo 255 caracteres';
      }

      if (!value.includes('@')) {
        return 'Email inválido: deve conter um @';
      }
    },
  });

  if (p.isCancel(email)) {
    p.cancel('Operação cancelada');
    process.exit(0);
  }

  return email;
}

async function promptUsername(): Promise<string> {
  const username = await p.text({
    message: 'Digite o nome de usuário que deseja buscar ou criar:',
    validate: (value) => {
      if (value.length < 3) {
        return 'Nome de usuário inválido: muito curto, deve ter no mínimo 3 caracteres';
      }

      if (value.length > 31) {
        return 'Nome de usuário inválido: muito longo, deve ter no máximo 31 caracteres';
      }

      if (!/^[a-z0-9_-]+$/.test(value)) {
        return 'Nome de usuário inválido: deve conter apenas letras minúsculas, números, hifens e underscores';
      }
    },
  });

  if (p.isCancel(username)) {
    p.cancel('Operação cancelada');
    process.exit(0);
  }

  const usernameAlreadyTaken = await withLoading(findUserByUsername(username), {
    start: 'Buscando nome de usuário...',
    stop: 'Finalizada a busca',
    error: 'Erro ao buscar nome de usuário',
    exit: false,
  });

  const goBack = () => {
    p.note(`Nome de usuário ${username} já está em uso. Tente outro.`, 'Conflito de nome de usuário');
    return promptUsername() as Promise<string>;
  }

  if (usernameAlreadyTaken) {
    await promptBasicConfirm(`Nome de usuário ${username} já está em uso. Deseja tentar outro?`);
    return goBack();
  }

  return username;
}

async function promptUserRole() {
  const role = await p.select({
    message: 'Selecione o grau de permissão do usuário:',
    options: [
      { value: roles.HIGH_PRIVILEGE_ADMIN, label: 'Administrador de alta permissão - Poder ilimitado' },
      { value: roles.ADMIN, label: 'Administrador - Poder limitado' },
      { value: roles.USER, label: 'Usuário comum - Poder mínimo' },
    ],
  });

  if (p.isCancel(role)) {
    p.cancel('Operação cancelada');
    process.exit(0);
  }

  return role as Role;
}

async function promptUserPassword() {
  const password = await p.password({ message: 'Digite a senha do usuário:', validate: (value) => value.length < 6 ? 'Senha inválida: muito curta, deve ter no mínimo 6 caracteres' : undefined });

  if (p.isCancel(password)) {
    p.cancel('Operação cancelada');
    process.exit(0);
  }

  return password;
}

async function promptBasicConfirm(message: string) {
  const yesOrNo = await p.confirm({ message });

  if (p.isCancel(yesOrNo)) {
    p.cancel('Operação cancelada');
    process.exit(0);
  }

  return yesOrNo;
}

async function main() {
  intro(`Manuseie sua instância do CoatiQuati`);

  const email = await promptUserEmail()

  const emailAlreadyTaken = await withLoading(findUserByEmail(email), {
    start: 'Buscando usuário...',
    stop: 'Finalizada a busca',
    error: 'Erro ao buscar usuário',
    exit: false,
  })

  if (emailAlreadyTaken) {
    const confirm = await promptBasicConfirm(`Usuário encontrado: ${emailAlreadyTaken.username} (${emailAlreadyTaken.email}). Deseja atualizar o usuário?`);

    if (!confirm) {
      outro('Operação cancelada');
      process.exit(0);
    }

    const role = await promptUserRole();

    await withLoading(updateUser(emailAlreadyTaken.username, role), {
      start: 'Atualizando usuário...',
      stop: 'Usuário atualizado',
      error: 'Erro ao atualizar usuário',
      exit: true,
    });

    outro(`Usuário ${emailAlreadyTaken.username} atualizado com sucesso!`);
  }

  const username = await promptUsername();
  const password = await promptUserPassword();
  const role = await promptUserRole();
  const confirm = await promptBasicConfirm(`Criar usuário ${username} (${email}) com permissão ${role}?`);

  if (!confirm) {
    outro('Operação cancelada');
    process.exit(0);
  }

  const avatars = ['grape.png', 'mint.png', 'original.png', 'peach.png'];
  const avatar = '/avatars/' + avatars[Math.floor(Math.random() * avatars.length)];

  await withLoading(registerUser({ username, email, password, avatar }, role), {
    start: 'Criando usuário...',
    stop: 'Usuário criado',
    error: 'Erro ao criar usuário',
    exit: true,
  });

  outro(`Usuário ${username} criado com sucesso!`);
}

main().catch((error) => {
  outro(`Erro inesperado: ${error.message}`);
  process.exit(1);
});
