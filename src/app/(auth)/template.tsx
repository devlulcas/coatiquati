'use client';
import { motion } from 'framer-motion';
import { usePathname } from 'next/navigation';

export default function AnimatedTemplate({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <motion.div
      initial={{ opacity: 0, x: pathname === '/sign-in' ? -100 : 100 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ type: 'spring', bounce: 0.25 }}
    >
      {children}
    </motion.div>
  );
}
