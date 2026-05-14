'use client';

import React from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { ShoppingCart, Heart, ArrowLeft, Star, ShieldCheck, Truck } from 'lucide-react';
import { productService } from '@/api/products';
import { Product } from '@/types';
import { Button } from '@/components/ui/Button';
import { useCartStore } from '@/store/useCartStore';
import { toast } from 'react-hot-toast';

export default function ProductDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  const [product, setProduct] = React.useState<Product | null>(null);
  const [loading, setLoading] = React.useState(true);
  const addItem = useCartStore((state) => state.addItem);

  React.useEffect(() => {
    const fetchProduct = async () => {
      try {
        const { data } = await productService.getAll();
        const found = Array.isArray(data) ? data.find((p: Product) => p.id === id) : null;
        setProduct(found || null);
      } catch (error) {
        console.error('Failed to fetch product', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    if (product) {
      addItem(product);
      toast.success('Added to cart!');
    }
  };

  if (loading) return <div className="flex h-screen items-center justify-center">Loading...</div>;
  if (!product) return <div className="flex h-screen items-center justify-center text-2xl font-bold">Product not found</div>;

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <Button variant="ghost" onClick={() => router.back()} className="mb-8">
        <ArrowLeft className="mr-2 h-4 w-4" /> Back to Products
      </Button>

      <div className="grid grid-cols-1 gap-16 lg:grid-cols-2">
        {/* Image Gallery */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="relative aspect-square overflow-hidden rounded-3xl bg-secondary"
        >
          <Image
            src={product.images?.[0] || 'https://via.placeholder.com/800'}
            alt={product.title}
            fill
            className="object-cover"
          />
        </motion.div>

        {/* Info */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex flex-col"
        >
          <span className="mb-2 text-sm font-bold uppercase tracking-widest text-primary">
            {product.category}
          </span>
          <h1 className="mb-4 text-4xl font-extrabold tracking-tight sm:text-5xl">
            {product.title}
          </h1>
          
          <div className="mb-6 flex items-center space-x-4">
            <div className="flex items-center text-yellow-500">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="h-5 w-5 fill-current" />
              ))}
            </div>
            <span className="text-sm text-muted-foreground">(128 Reviews)</span>
          </div>

          <p className="mb-8 text-lg text-muted-foreground leading-relaxed">
            {product.description}
          </p>

          <div className="mb-10 flex items-center justify-between border-y border-border py-6">
            <div>
              <p className="text-sm text-muted-foreground">Total Price</p>
              <p className="text-4xl font-bold">${product.price.toFixed(2)}</p>
            </div>
            <div className="flex items-center space-x-4">
              <Button size="icon" variant="outline" className="rounded-full">
                <Heart className="h-5 w-5" />
              </Button>
              <Button size="lg" onClick={handleAddToCart} disabled={product.quantity === 0}>
                <ShoppingCart className="mr-2 h-5 w-5" />
                Add to Cart
              </Button>
            </div>
          </div>

          {/* Features */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="flex items-center space-x-3 rounded-2xl bg-secondary/50 p-4">
              <Truck className="h-6 w-6 text-primary" />
              <div className="text-sm">
                <p className="font-bold">Free Shipping</p>
                <p className="text-muted-foreground">On orders over $100</p>
              </div>
            </div>
            <div className="flex items-center space-x-3 rounded-2xl bg-secondary/50 p-4">
              <ShieldCheck className="h-6 w-6 text-primary" />
              <div className="text-sm">
                <p className="font-bold">2 Year Warranty</p>
                <p className="text-muted-foreground">100% Protection</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
