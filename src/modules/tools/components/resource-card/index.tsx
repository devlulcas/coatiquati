import { ExternalLink } from 'lucide-react';
import Link from 'next/link';
import type React from 'react';

import { Badge } from '@/shared/components/ui/badge';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/shared/components/ui/card';

type ResourceCardProps = {
  title: string;
  description: string;
  icon: React.ReactNode;
  link: string;
  category: string;
  isExternal: boolean;
}

export function ResourceCard({ title, description, icon, link, category, isExternal }: ResourceCardProps) {
  return (
    <Card className="overflow-hidden transition-all duration-300 hover:shadow-lg border border-white/10 bg-white/70 dark:bg-gray-950/70 backdrop-blur-md group">
      <CardHeader className="bg-card/50 backdrop-blur-sm transition-colors duration-300 border-b">
        <div className="flex justify-between items-start w-full gap-2">
          <CardTitle className="text-card-foreground truncate h-[1.5lh]">{title}</CardTitle>
          <Badge
            variant="outline"
            className="bg-card/30 text-brand-500 dark:text-brand-400 border-brand-200/50 dark:border-brand-700/50"
          >
            {category}
          </Badge>
        </div>

        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="p-4">
        <div className="flex items-center justify-center p-4">
          <div className="w-12 h-12 rounded-full bg-card-foreground/10 flex items-center justify-center text-brand-500 dark:text-brand-400 shadow-sm">
            {icon}
          </div>
        </div>
      </CardContent>
      <CardFooter className="bg-card/50 backdrop-blur-sm p-4 border-t">
        {isExternal ? (
          <a
            href={link}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full flex items-center justify-center gap-2 py-2 rounded-md bg-gradient-to-r from-brand-500 to-brand-700 hover:from-brand-600 hover:to-brand-700 text-white transition-all duration-200 shadow-md hover:shadow-brand-500/20"
          >
            Acessar <ExternalLink className="h-4 w-4" />
          </a>
        ) : (
          <Link
            href={link}
            className="w-full flex items-center justify-center gap-2 py-2 rounded-md bg-gradient-to-r from-brand-500 to-brand-700 hover:from-brand-600 hover:to-brand-700 text-white transition-all duration-200 shadow-md hover:shadow-brand-500/20"
          >
            Acessar
          </Link>
        )}
      </CardFooter>
    </Card>
  )
}
