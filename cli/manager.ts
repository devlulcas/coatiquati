import { authClient } from '@/modules/auth/lib/auth-client';
import { AVATARS } from '@/modules/user/constants/avatars';
import * as p from '@clack/prompts';
import { intro, outro } from '@clack/prompts';
import { config } from 'dotenv';

config({ path: '.env.local' });

type User = {
  username: string;
  password: string;
  email: string;
  avatar: string;
};

type Role = 'admin' | 'user' | 'superAdmin';

async function registerUser(user: User, role: Role) {
  const { data, error } = await authClient.signUp.email({
    email: user.email,
    password: user.password,
    username: user.username,
    name: user.username,
    image: user.avatar,
  });

  if (error) {
    throw new Error(error.message);
  }

  const { error: roleError } = await authClient.admin.setRole({
    userId: data.user.id,
    role: role,
  });

  if (roleError) {
    throw new Error(roleError.message);
  }

  return data;
}

async function withLoading<T>(
  promise: Promise<T>,
  opts: { start: string; stop: string; error: string; exit: boolean }
) {
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

  const promise = authClient.admin
    .listUsers({
      query: {
        filterField: 'username',
        filterValue: username,
        filterOperator: 'eq',
      },
    })
    .then((res) => {
      if (res.error) {
        throw new Error(res.error.message);
      }

      return res.data.users.length > 0;
    });

  const usernameAlreadyTaken = await withLoading(promise, {
    start: 'Buscando nome de usuário...',
    stop: 'Finalizada a busca',
    error: 'Erro ao buscar nome de usuário',
    exit: false,
  });

  const goBack = () => {
    p.note(
      `Nome de usuário ${username} já está em uso. Tente outro.`,
      'Conflito de nome de usuário'
    );
    return promptUsername() as Promise<string>;
  };

  if (usernameAlreadyTaken) {
    await promptBasicConfirm(
      `Nome de usuário ${username} já está em uso. Deseja tentar outro?`
    );
    return goBack();
  }

  return username;
}

async function promptUserRole() {
  const role = await p.select({
    message: 'Selecione o grau de permissão do usuário:',
    options: [
      {
        value: 'superAdmin',
        label: 'Administrador de alta permissão - Poder ilimitado',
      },
      { value: 'admin', label: 'Administrador - Poder limitado' },
      { value: 'user', label: 'Usuário comum - Poder mínimo' },
    ],
  });

  if (p.isCancel(role)) {
    p.cancel('Operação cancelada');
    process.exit(0);
  }

  return role as Role;
}

async function promptUserPassword() {
  const password = await p.password({
    message: 'Digite a senha do usuário:',
    validate: (value) =>
      value.length < 6
        ? 'Senha inválida: muito curta, deve ter no mínimo 6 caracteres'
        : undefined,
  });

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

  const email = await promptUserEmail();

  const promise = authClient.admin
    .listUsers({
      query: {
        filterField: 'email',
        filterValue: email,
        filterOperator: 'eq',
      },
    })
    .then((res) => {
      if (res.error) {
        throw new Error(res.error.message);
      }

      if (res.data.users.length === 0) {
        return null;
      }

      return res.data.users[0];
    });

  const emailAlreadyTaken = await withLoading(promise, {
    start: 'Buscando usuário...',
    stop: 'Finalizada a busca',
    error: 'Erro ao buscar usuário',
    exit: false,
  });

  if (emailAlreadyTaken) {
    const confirm = await promptBasicConfirm(
      `Usuário encontrado: ${emailAlreadyTaken.name} (${emailAlreadyTaken.email}). Deseja atualizar o usuário?`
    );

    if (!confirm) {
      outro('Operação cancelada');
      process.exit(0);
    }

    const role = await promptUserRole();

    const updateUserPromise = authClient.admin.updateUser({
      userId: emailAlreadyTaken.id,
      data: {
        email: email,
        name: emailAlreadyTaken.name,
      },
    });

    await withLoading(updateUserPromise, {
      start: 'Atualizando usuário...',
      stop: 'Usuário atualizado',
      error: 'Erro ao atualizar usuário',
      exit: true,
    });

    const setRolePromise = authClient.admin.setRole({
      userId: emailAlreadyTaken.id,
      role: role,
    });

    await withLoading(setRolePromise, {
      start: 'Definindo permissão do usuário...',
      stop: 'Permissão definida',
      error: 'Erro ao definir permissão do usuário',
      exit: true,
    });

    outro(`Usuário ${emailAlreadyTaken.name} atualizado com sucesso!`);
  }

  const username = await promptUsername();
  const password = await promptUserPassword();
  const role = await promptUserRole();

  const confirm = await promptBasicConfirm(
    `Criar usuário ${username} (${email}) com permissão ${role}?`
  );

  if (!confirm) {
    outro('Operação cancelada');
    process.exit(0);
  }

  const avatar = AVATARS[Math.floor(Math.random() * AVATARS.length)];

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
