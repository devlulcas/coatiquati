import { cn } from '@/shared/utils/cn';
import css from './marquee.module.css';

type MarqueeProps = {
  words: string[];
  className?: string;
};

export function Marquee({ words, className }: MarqueeProps) {
  return (
    <div className={cn(css.scrollContainer, className)}>
      <div className={css.scroll}>
        {words.map((word) => (
          <span key={word}>{word}</span>
        ))}
      </div>
    </div>
  );
}
