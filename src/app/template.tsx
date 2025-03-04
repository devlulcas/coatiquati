'use client';
import { motion } from 'framer-motion';

export default function AnimatedTemplate({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ type: 'spring', bounce: 0.25 }}
    >
      {children}
    </motion.div>
  );
}
