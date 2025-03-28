'use client';
import { BookOpenIcon, ClockIcon, CodeIcon, GlobeIcon, PencilIcon } from 'lucide-react';
import { useState } from 'react';

import { ResourceCard } from '@/modules/tools/components/resource-card';
import { Button } from '@/shared/components/ui/button';

export default function ResourcesPage() {
  const [filter, setFilter] = useState<string | null>(null);

  const resources = [
    {
      title: 'Pomodoro',
      description: 'Técnica de gerenciamento de tempo para aumentar a produtividade',
      icon: <ClockIcon className="h-5 w-5" />,
      link: '/pomodoro',
      category: 'Produtividade',
      isExternal: false,
    },
    {
      title: 'Excalidraw',
      description: 'Quadro branco virtual para desenhar diagramas com aparência desenhada à mão',
      icon: <PencilIcon className="h-5 w-5" />,
      link: 'https://excalidraw.com/',
      category: 'Design',
      isExternal: true,
    },
    {
      title: 'Figma',
      description: 'Ferramenta de design de interface colaborativa baseada na web',
      icon: <PencilIcon className="h-5 w-5" />,
      link: 'https://www.figma.com/',
      category: 'Design',
      isExternal: true,
    },
    {
      title: 'Canva',
      description: 'Plataforma de design gráfico para criar apresentações, posts para redes sociais e mais',
      icon: <PencilIcon className="h-5 w-5" />,
      link: 'https://www.canva.com/pt_br/',
      category: 'Design',
      isExternal: true,
    },
    {
      title: 'Google Academy',
      description: 'Cursos gratuitos do Google para desenvolver habilidades digitais',
      icon: <BookOpenIcon className="h-5 w-5" />,
      link: 'https://skillshop.withgoogle.com/intl/pt-BR/',
      category: 'Educação',
      isExternal: true,
    },
    {
      title: 'Khan Academy',
      description: 'Plataforma de aprendizado com milhares de exercícios, vídeos e artigos',
      icon: <BookOpenIcon className="h-5 w-5" />,
      link: 'https://pt.khanacademy.org/',
      category: 'Educação',
      isExternal: true,
    },
    {
      title: 'Coursera',
      description: 'Cursos online de universidades e empresas de todo o mundo',
      icon: <BookOpenIcon className="h-5 w-5" />,
      link: 'https://www.coursera.org/',
      category: 'Educação',
      isExternal: true,
    },
    {
      title: 'Alura',
      description: 'Plataforma brasileira de cursos de tecnologia e programação',
      icon: <CodeIcon className="h-5 w-5" />,
      link: 'https://www.alura.com.br/',
      category: 'Programação',
      isExternal: true,
    },
    {
      title: 'Digital Innovation One',
      description: 'Plataforma de educação gratuita com bootcamps e cursos de tecnologia',
      icon: <CodeIcon className="h-5 w-5" />,
      link: 'https://www.dio.me/',
      category: 'Programação',
      isExternal: true,
    },
    {
      title: 'MDN Web Docs',
      description: 'Documentação para desenvolvedores web, com conteúdo em português',
      icon: <GlobeIcon className="h-5 w-5" />,
      link: 'https://developer.mozilla.org/pt-BR/',
      category: 'Documentação',
      isExternal: true,
    },
  ];

  const categories = ['Todos', 'Interna', ...Array.from(new Set(resources.map(resource => resource.category)))];

  const filteredResources = resources.filter(resource => {
    if (filter === null) {
      return true;
    }

    return resource.category === filter || (filter === 'Interna' && !resource.isExternal);
  });

  return (
    <div className="h-[--view-height] w-full overflow-y-scroll py-8">
      <div className="mx-auto max-w-7xl space-y-8 lg:space-y-12">
        <div className="space-y-2 text-left">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-50">Recursos & Ferramentas</h1>
          <p className="text-xl text-gray-700 dark:text-gray-300">
            Uma coleção de recursos úteis e ferramentas educacionais
          </p>
        </div>

        {/* Filter Section */}
        <div className="flex flex-wrap gap-4">
          {categories.map(category => (
            <Button
              key={category}
              onClick={() => setFilter(category === 'Todos' ? null : category)}
              variant={filter === category || (category === 'Todos' && filter === null) ? 'brand' : 'secondary'}
            >
              {category}
            </Button>
          ))}
        </div>

        {/* Resources Section */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredResources.map(resource => (
            <ResourceCard
              key={resource.title}
              title={resource.title}
              description={resource.description}
              icon={resource.icon}
              link={resource.link}
              category={resource.category}
              isExternal={resource.isExternal}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
