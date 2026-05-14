'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { GlassCard } from '@/components/ui/GlassCard';
import { ArrowRight, ShoppingBag, Laptop, Shirt, Home as HomeIcon, Watch } from 'lucide-react';

export default function CategoriesPage() {
  const categories = [
    { name: 'Elite Tech', desc: 'Precision electronics for the modern age.', icon: <Laptop className="h-8 w-8" />, href: '/products?category=Electronics', count: 12 },
    { name: 'Aura Wear', desc: 'Curated fashion that defines status.', icon: <Shirt className="h-8 w-8" />, href: '/products?category=Fashion', count: 24 },
    { name: 'Sanctuary', desc: 'Transform your home into a masterpiece.', icon: <HomeIcon className="h-8 w-8" />, href: '/products?category=Home Decor', count: 8 },
    { name: 'Essentials', desc: 'The finishing touches for your lifestyle.', icon: <Watch className="h-8 w-8" />, href: '/products?category=Accessories', count: 15 },
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-20 text-center"
      >
        <h1 className="text-5xl md:text-7xl font-black tracking-tighter mb-6 uppercase">Collections</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Explore our meticulously curated categories, designed for those who demand nothing but the best.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
        {categories.map((cat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
          >
            <Link href={cat.href}>
              <GlassCard className="group relative overflow-hidden h-64 flex flex-col justify-between p-10 border-accent/10 hover:border-accent/40">
                <div className="flex justify-between items-start">
                  <div className="p-4 rounded-2xl gold-gradient text-white shadow-lg group-hover:rotate-12 transition-transform">
                    {cat.icon}
                  </div>
                  <span className="text-sm font-black tracking-widest text-accent uppercase">{cat.count} Items</span>
                </div>
                
                <div>
                  <h2 className="text-3xl font-black tracking-tight mb-2 group-hover:text-accent transition-colors">{cat.name}</h2>
                  <p className="text-muted-foreground max-w-xs">{cat.desc}</p>
                </div>

                <div className="absolute bottom-10 right-10 translate-x-4 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all">
                  <ArrowRight className="h-6 w-6 text-accent" />
                </div>
              </GlassCard>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
