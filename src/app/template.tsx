'use client';
import { motion } from 'framer-motion';

export default function AnimatedTemplate({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{
        ease: 'easeInOut',
        duration: 0.5,
      }}
    >
      {children}
    </motion.div>
  );
}
