'use client';

import { memo, useMemo } from 'react';

type CircularProgressProps = {
  max?: number;
  value?: number;
  width?: number;
  className?: string;
  size?: number;
};

function InnerCircularProgress({ max = 100, value = 50, className, size = 34, width = 8 }: CircularProgressProps) {
  const progress = useMemo(() => Math.min((value / max) * 100, 101), [value, max]);

  const [c, r, circumference] = useMemo(() => {
    const c = size / 2;
    const r = c - width / 2;
    const circumference = 2 * Math.PI * r;
    return [c, r, circumference];
  }, [size, width]);

  const offset = useMemo(() => circumference * ((100 - progress) / 100), [circumference, progress]);

  return (
    <svg
      width={size}
      height={size}
      viewBox={`"0 0 ${size} ${size}"`}
      className={className}
      style={{ transform: 'rotate(-90deg)' }}
    >
      <circle r={r} cx={c} cy={c} fill="transparent" stroke="rgb(250 250 249)" stroke-width={width + 'px'}></circle>
      <circle
        r={r}
        cx={c}
        cy={c}
        fill="transparent"
        stroke={getProgressColor(progress)}
        stroke-width={width - 2 + 'px'}
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        strokeLinecap="round"
      ></circle>
    </svg>
  );
}

export const CircularProgress = memo(InnerCircularProgress);

function getProgressColor(progress: number) {
  const errorColor = 'rgb(239 68 68)';
  const warningColor = 'rgb(251 191 36)';
  const successColor = 'rgb(34 197 94)';

  if (progress < 10) {
    return errorColor;
  }

  if (progress < 75) {
    return successColor;
  }

  if (progress <= 100) {
    return warningColor;
  }

  return errorColor;
}
