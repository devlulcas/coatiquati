'use client';

import { NewImageContentDialogTrigger } from '@/modules/image-content/components/new-image-content-dialog-trigger';
import { useCurrentUserDataQuery } from '@/modules/user/hooks/use-user-data-query';
import { NewVideoContentDialogTrigger } from '@/modules/video-content/components/new-video-content-dialog-trigger';
import { Button } from '@/shared/components/ui/button';
import { AnimatePresence, motion, useCycle } from 'framer-motion';
import { ImagePlusIcon, ScrollTextIcon, VideoIcon } from 'lucide-react';
import Link from 'next/link';
import { createTopicUrl } from '../../lib/create-topic-url';

type ContributionOptionsButtonProps = {
  trailId: number;
  topicId: number;
};

export function ContributionOptionsButton({ topicId, trailId }: ContributionOptionsButtonProps) {
  const [isOpen, toggleOpen] = useCycle(false, true);

  const topicUrl = createTopicUrl(topicId, trailId);

  const userDataQuery = useCurrentUserDataQuery();

  return (
    <div className="flex w-fit gap-1">
      <Button
        className="z-10"
        isLoading={userDataQuery.isLoading}
        disabled={userDataQuery.isLoading || !userDataQuery.data}
        onClick={() => toggleOpen()}
      >
        {userDataQuery.data ? (isOpen ? 'Fechar' : 'Contribuir') : 'Entre para contribuir'}
      </Button>

      <AnimatePresence>
        {isOpen && (
          <motion.ul
            key="contribution-options"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="ml-3 flex flex-wrap gap-2"
          >
            <motion.li
              initial={{ x: -100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -100, opacity: 0 }}
              transition={{ duration: 0.2, delay: 0.1 }}
            >
              <Button className="flex items-center justify-center gap-2" asChild>
                <Link href={topicUrl + '/contribute/rich_text'}>
                  <ScrollTextIcon />
                  <span className="sr-only lg:not-sr-only">Postagem</span>
                </Link>
              </Button>
            </motion.li>

            <motion.li
              initial={{ x: -100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -100, opacity: 0 }}
              transition={{ duration: 0.2, delay: 0.2 }}
            >
              <NewImageContentDialogTrigger defaultValues={{ topicId }}>
                <Button className="flex items-center justify-center gap-2">
                  <ImagePlusIcon />
                  <span className="sr-only lg:not-sr-only">Contribuir com uma imagem</span>
                </Button>
              </NewImageContentDialogTrigger>
            </motion.li>

            <motion.li
              initial={{ x: -100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -100, opacity: 0 }}
              transition={{ duration: 0.2, delay: 0.2 }}
            >
              <NewVideoContentDialogTrigger defaultValues={{ topicId }}>
                <Button className="flex items-center justify-center gap-2">
                  <VideoIcon />
                  <span className="sr-only lg:not-sr-only">Contribuir com um vídeo</span>
                </Button>
              </NewVideoContentDialogTrigger>
            </motion.li>
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}
