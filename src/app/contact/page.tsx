import { GithubIcon, GlobeIcon } from 'lucide-react';
import Link from 'next/link';

export default function ContactPage() {
  return (
    <main className="grid h-[--view-height] w-full place-items-center">
      <ul className="flex flex-col gap-2 rounded border bg-background/50 p-4">
        <li>
          <Link
            className="flex items-center gap-2 rounded bg-foreground/10 p-4 text-foreground hover:bg-foreground/20"
            href="https://lucasrego.tech"
          >
            <GlobeIcon size={18} /> lucasrego.tech
          </Link>
        </li>

        <li>
          <Link
            className="flex items-center gap-2 rounded bg-foreground/10 p-4 text-foreground hover:bg-foreground/20"
            href="https://github.com/devlulcas"
          >
            <GithubIcon size={18} /> devlulcas
          </Link>
        </li>
      </ul>
    </main>
  );
}
