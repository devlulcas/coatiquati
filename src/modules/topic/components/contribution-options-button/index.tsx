'use client';

import { NewImageContentDialogTrigger } from '@/modules/content/components/new-image-content-dialog-trigger';
import { NewVideoContentDialogTrigger } from '@/modules/content/components/new-video-content-dialog-trigger';
import { Button } from '@/shared/components/ui/button';
import { AnimatePresence, motion, useCycle } from 'framer-motion';
import { ScrollTextIcon } from 'lucide-react';
import Link from 'next/link';
import { createTopicUrl } from '../../lib/create-topic-url';

type ContributionOptionsButtonProps = {
  trailId: number;
  topicId: number;
};

export function ContributionOptionsButton({ topicId, trailId }: ContributionOptionsButtonProps) {
  const [isOpen, toggleOpen] = useCycle(false, true);

  const url = createTopicUrl(topicId, trailId);

  return (
    <div className="flex gap-1 w-fit">
      <Button className="z-10" onClick={() => toggleOpen()}>
        Contribuir
      </Button>

      <AnimatePresence>
        {isOpen && (
          <motion.ul
            key="contribution-options"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex gap-2 ml-3"
          >
            <motion.li
              initial={{ x: -100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -100, opacity: 0 }}
              transition={{ duration: 0.2, delay: 0.1 }}
            >
              <Button className="flex gap-2 items-center justify-center" asChild>
                <Link href={url + '/contribute/post'}>
                  <ScrollTextIcon />
                  Postagem
                </Link>
              </Button>
            </motion.li>

            <motion.li
              initial={{ x: -100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -100, opacity: 0 }}
              transition={{ duration: 0.2, delay: 0.2 }}
            >
              <NewImageContentDialogTrigger />
            </motion.li>

            <motion.li
              initial={{ x: -100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -100, opacity: 0 }}
              transition={{ duration: 0.2, delay: 0.2 }}
            >
              <NewVideoContentDialogTrigger />
            </motion.li>
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}
