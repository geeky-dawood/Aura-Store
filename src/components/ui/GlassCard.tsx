'use client';

import React from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';
import { cn } from '@/utils/cn';

interface GlassCardProps extends HTMLMotionProps<'div'> {
  children: React.ReactNode;
  className?: string;
  hoverEffect?: boolean;
}

export const GlassCard: React.FC<GlassCardProps> = ({ 
  children, 
  className, 
  hoverEffect = true,
  ...props 
}) => {
  return (
    <motion.div
      whileHover={hoverEffect ? { 
        y: -5, 
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        borderColor: 'rgba(212, 175, 55, 0.3)' 
      } : {}}
      className={cn(
        'liquid-glass p-6 relative overflow-hidden group cursor-pointer',
        className
      )}
      {...props}
    >
      {/* Subtle shine effect on hover */}
      {hoverEffect && (
        <div className="absolute inset-0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/5 to-transparent pointer-events-none" />
      )}
      {children}
    </motion.div>
  );
};
