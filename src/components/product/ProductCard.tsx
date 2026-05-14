'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ShoppingCart, Heart, Eye } from 'lucide-react';
import { Product } from '@/types';
import { Button } from '@/components/ui/Button';
import { useCartStore } from '@/store/useCartStore';
import { toast } from 'react-hot-toast';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const addItem = useCartStore((state) => state.addItem);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    addItem(product);
    toast.success('Added to cart!');
  };

  return (
    <motion.div
      whileHover={{ y: -8 }}
      className="group relative flex flex-col overflow-hidden rounded-2xl bg-background border border-border shadow-sm transition-all hover:shadow-xl"
    >
      <div className="relative aspect-square overflow-hidden">
        <Link href={`/products/${product.id}`} className="block h-full w-full">
          <Image
            src={product.images?.[0] || 'https://media.wired.com/photos/68d1e224d4f5f78f3b59aa43/4:3/w_640%2Cc_limit/iPhone%252017%2520SOURCE%2520Julian%2520Chokkattu.jpg'}

            alt={product.title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover transition-transform duration-500 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-black/5 opacity-0 transition-opacity group-hover:opacity-100" />
        </Link>
        
        {/* Quick Actions Overlay */}
        <div className="absolute right-4 top-4 flex flex-col space-y-2 translate-x-12 opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100">
          <Button size="icon" variant="secondary" className="rounded-full shadow-lg">
            <Heart className="h-5 w-5" />
          </Button>
          <Link href={`/products/${product.id}`}>
            <Button size="icon" variant="secondary" className="rounded-full shadow-lg">
              <Eye className="h-5 w-5" />
            </Button>
          </Link>
        </div>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <div className="mb-1 flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-primary">
            {product.category}
          </span>
          <span className="text-xs text-muted-foreground">
            {product.quantity > 0 ? 'In Stock' : 'Out of Stock'}
          </span>
        </div>
        <Link href={`/products/${product.id}`} className="mb-2 block">
          <h3 className="font-bold text-lg leading-tight group-hover:text-primary transition-colors">
            {product.title}
          </h3>
        </Link>
        <p className="mb-4 text-sm text-muted-foreground line-clamp-2">
          {product.description}
        </p>
        
        <div className="mt-auto flex items-center justify-between">
          <span className="text-xl font-bold">${product.price.toFixed(2)}</span>
          <Button size="sm" onClick={handleAddToCart} disabled={product.quantity === 0}>
            <ShoppingCart className="mr-2 h-4 w-4" />
            Add
          </Button>
        </div>
      </div>
    </motion.div>

  );
};
