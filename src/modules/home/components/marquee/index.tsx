import { cn } from '@/shared/utils/cn';
import { type ClassValue } from 'clsx';
import css from './marquee.module.css';

type MarqueeProps = {
  words: string[];
  className?: ClassValue;
};

export function Marquee({ words, className }: MarqueeProps) {
  return (
    <div className={cn(css.scrollContainer, className)}>
      <div className={css.scroll}>
        {words.map(word => (
          <span key={word}>{word}</span>
        ))}

        {words.map(word => (
          <span key={word}>{word}</span>
        ))}
      </div>
    </div>
  );
}
