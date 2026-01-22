/**
 * Card Component
 * 
 * Container component with consistent styling.
 */

import { type HTMLAttributes, type ReactNode } from 'react';
import { cn } from '@/lib/utils';

type CardProps = HTMLAttributes<HTMLDivElement> & {
  children: ReactNode;
};

/**
 * Card container with glassmorphism effect.
 */
export function Card({ className, children, ...props }: CardProps) {
  return (
    <div
      className={cn(
        'rounded-2xl',
        'bg-slate-800/50 backdrop-blur-lg',
        'border border-slate-700/50',
        'shadow-xl shadow-black/20',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

/**
 * Card header section.
 */
export function CardHeader({ className, children, ...props }: CardProps) {
  return (
    <div
      className={cn('px-6 py-4 border-b border-slate-700/50', className)}
      {...props}
    >
      {children}
    </div>
  );
}

/**
 * Card content section.
 */
export function CardContent({ className, children, ...props }: CardProps) {
  return (
    <div className={cn('px-6 py-4', className)} {...props}>
      {children}
    </div>
  );
}

/**
 * Card footer section.
 */
export function CardFooter({ className, children, ...props }: CardProps) {
  return (
    <div
      className={cn('px-6 py-4 border-t border-slate-700/50', className)}
      {...props}
    >
      {children}
    </div>
  );
}
