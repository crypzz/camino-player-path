import { ReactNode } from 'react';

interface Props {
  children: ReactNode;
  className?: string;
}

/**
 * Editorial italic-serif accent word — the single move that signals premium
 * (Linear, Vercel, Whoop, Arc all do this).
 */
export function SerifAccent({ children, className = '' }: Props) {
  return (
    <span
      className={`font-serif italic font-normal text-primary ${className}`}
      style={{ letterSpacing: '-0.01em' }}
    >
      {children}
    </span>
  );
}
