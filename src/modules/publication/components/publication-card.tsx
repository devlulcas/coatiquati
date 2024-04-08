import { ReportFormDialogTrigger } from '@/modules/user-moderation/components/report-form-dialog-trigger';
import { createProfileUrl } from '@/modules/user/lib/create-profile-url';
import type { User } from '@/modules/user/types/user';
import { CheckCircle2Icon, DotIcon, EllipsisIcon } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import type { Publication } from '../types/publication';
import { PublicationMediaGrid } from './publication-media-grid';

type PublicationCardProps = {
  author: Pick<User, 'avatar' | 'username' | 'verified'>;
  publication: Publication;
};

export function PublicationCard({ author, publication }: PublicationCardProps) {
  return (
    <article className="flex gap-4 bg-background/50 p-4">
      <Link href={createProfileUrl(author.username)}>
        <Image src={author.avatar} alt={author.username} width={40} height={40} className="rounded-full" />
      </Link>

      <div className="w-full">
        <div className="flex w-full items-center justify-between">
          <p>
            <span className="font-semibold">{author.username}</span>
            <CheckCircle2Icon size={14} className="ml-1 inline fill-blue-800/50 text-blue-500" />
          </p>

          <ReportFormDialogTrigger origin={{ id: publication.id, type: 'publication' }} user={publication.authorId}>
            <div className="relative flex h-[1ch] w-[2.5ch] items-center justify-center">
              <button
                type="button"
                aria-label="Mais opções"
                title="Mais opções"
                className="absolute flex h-10 w-10 items-center justify-center rounded-full text-sm text-brand-50 hover:bg-brand-800/50 focus:bg-brand-800/50"
              >
                <EllipsisIcon size={16} />
              </button>
            </div>
          </ReportFormDialogTrigger>
        </div>

        <p className="mb-2 mt-1 text-wrap break-words">{publication.content}</p>

        <div>
          <time dateTime={publication.createdAt.toISOString()} className="flex items-center text-sm text-gray-500">
            {publication.createdAt.toLocaleTimeString('pt-Br', {
              hour: 'numeric',
              minute: 'numeric',
            })}
            <DotIcon size={16} />
            {publication.createdAt.toLocaleDateString('pt-Br', {
              day: 'numeric',
              month: 'short',
              year: 'numeric',
            })}
          </time>
        </div>

        {publication.medias.length > 0 && <PublicationMediaGrid medias={publication.medias} />}
      </div>
    </article>
  );
}
