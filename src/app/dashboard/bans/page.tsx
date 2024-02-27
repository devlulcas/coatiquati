import { getUsersQuery } from '@/modules/user/actions/get-users-query';
import { UserAvatar } from '@/shared/components/common/user-avatar';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { HammerIcon, TrashIcon } from 'lucide-react';
import Link from 'next/link';

type PageProps = {
  searchParams: {
    user?: string;
  };
};

export default async function Page(props: PageProps) {
  const users = await getUsersQuery({
    search: props.searchParams.user,
  });

  return (
    <div className="flex flex-col gap-8">
      <section>
        <form className="flex gap-2">
          <Input name="user" placeholder="Pesquisar por usuário" />
          <Button>Buscar</Button>
          <Button title="Limpar filtros" aria-label="Limpar filtros" variant="destructive" size="icon" asChild>
            <Link href="/dashboard/bans">
              <TrashIcon className="h-4 w-4" />
            </Link>
          </Button>
        </form>

        <div className="mt-8">
          {users.length > 0 && (
            <ul className="flex flex-col divide-y">
              {users.map(user => (
                <li key={user.id} className="flex items-center justify-between py-4">
                  <div className="flex items-center gap-2">
                    <UserAvatar user={user} />
                    <p className="text-lg font-bold">{user.username}</p>
                    <p className="text-sm text-muted-foreground">{user.email}</p>
                  </div>

                  <Button className="flex items-center gap-2">
                    Banir
                    <HammerIcon className="h-4 w-4" />
                  </Button>
                </li>
              ))}
            </ul>
          )}
        </div>

        {users.length === 0 && typeof props.searchParams.user !== 'undefined' && (
          <p className="text-center text-muted-foreground">Nenhum usuário encontrado. Tente outra busca.</p>
        )}
      </section>
    </div>
  );
}
