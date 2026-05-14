import * as React from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';
import { cn } from '@/utils/cn';

export interface ButtonProps extends Omit<HTMLMotionProps<'button'>, 'children'> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'cta';
  size?: 'sm' | 'md' | 'lg' | 'icon';
  isLoading?: boolean;
  children?: React.ReactNode;
}



const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', isLoading, children, ...props }, ref) => {
    const variants = {
      primary: 'bg-primary text-primary-foreground hover:opacity-90 shadow-lg',
      secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
      outline: 'border-2 border-primary bg-transparent hover:bg-primary hover:text-primary-foreground',
      ghost: 'bg-transparent hover:bg-secondary',
      danger: 'bg-red-500 text-white hover:bg-red-600',
      cta: 'gold-gradient text-white hover:opacity-90 shadow-[0_0_20px_rgba(212,175,55,0.3)] border-0',
    };

    const sizes = {
      sm: 'h-8 px-3 text-xs',
      md: 'h-10 px-6 py-2',
      lg: 'h-14 px-10 text-lg font-bold tracking-wide',
      icon: 'h-10 w-10',
    };


    return (
      <motion.button
        whileTap={{ scale: 0.98 }}
        ref={ref}
        disabled={isLoading}
        className={cn(
          'inline-flex items-center justify-center rounded-xl font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:pointer-events-none disabled:opacity-50',
          variants[variant],
          sizes[size],
          className
        )}
        {...props}
      >
        {isLoading ? (
          <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
        ) : null}
        {children}
      </motion.button>
    );
  }
);
Button.displayName = 'Button';

export { Button };
