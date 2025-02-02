import { cn } from "@/shared/utils/cn";
import css from "./styles.module.css";

export function AnimatedBlogGridBackground() {
  return (
    <div className={cn(css.blobs, 'fixed inset-0 z-[-1]')}>
      <div className={cn(css.blobsOver, 'fixed inset-0')}>
      </div>
    </div>
  )
}
