'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { Trash2, Plus, Minus, ArrowRight, ShoppingBag } from 'lucide-react';
import { useCartStore } from '@/store/useCartStore';
import { Button } from '@/components/ui/Button';

export default function CartPage() {
  const { items, removeItem, updateQuantity, totalPrice } = useCartStore();

  if (items.length === 0) {
    return (
      <div className="flex min-h-[70vh] flex-col items-center justify-center px-4 text-center">
        <div className="mb-6 rounded-full bg-secondary p-8">
          <ShoppingBag className="h-16 w-16 text-muted-foreground" />
        </div>
        <h2 className="text-3xl font-bold">Your cart is empty</h2>
        <p className="mt-2 text-muted-foreground">Looks like you haven&apos;t added anything to your cart yet.</p>
        <Link href="/products" className="mt-8">
          <Button size="lg">Start Shopping</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="mb-12 text-4xl font-extrabold tracking-tight">Shopping Cart</h1>

      <div className="grid grid-cols-1 gap-12 lg:grid-cols-12">
        {/* Items List */}
        <div className="lg:col-span-8 space-y-6">
          <AnimatePresence mode="popLayout">
            {items.map((item) => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="premium-card flex flex-col items-center space-y-4 p-6 sm:flex-row sm:space-x-6 sm:space-y-0"
              >
                <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-xl bg-secondary">
                  <Image
                    src={item.images?.[0] || 'https://media.wired.com/photos/68d1e224d4f5f78f3b59aa43/4:3/w_640%2Cc_limit/iPhone%252017%2520SOURCE%2520Julian%2520Chokkattu.jpg'}

                    alt={item.title}
                    fill
                    className="object-cover"
                  />
                </div>
                
                <div className="flex-1 text-center sm:text-left">
                  <h3 className="text-lg font-bold">{item.title}</h3>
                  <p className="text-sm text-muted-foreground">{item.category}</p>
                  <p className="mt-1 font-bold text-primary">${item.price.toFixed(2)}</p>
                </div>

                <div className="flex items-center space-x-2">
                  <Button
                    size="icon"
                    variant="outline"
                    className="h-8 w-8 rounded-full"
                    onClick={() => updateQuantity(item.id, item.cartQuantity - 1)}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="w-8 text-center font-medium">{item.cartQuantity}</span>
                  <Button
                    size="icon"
                    variant="outline"
                    className="h-8 w-8 rounded-full"
                    onClick={() => updateQuantity(item.id, item.cartQuantity + 1)}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>

                <Button
                  size="icon"
                  variant="ghost"
                  className="text-red-500 hover:bg-red-50 hover:text-red-600"
                  onClick={() => removeItem(item.id)}
                >
                  <Trash2 className="h-5 w-5" />
                </Button>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Summary */}
        <div className="lg:col-span-4">
          <div className="premium-card sticky top-24 p-8">
            <h2 className="mb-6 text-xl font-bold">Order Summary</h2>
            <div className="space-y-4 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal</span>
                <span>${totalPrice().toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Shipping</span>
                <span className="text-green-500">Free</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Estimated Tax</span>
                <span>$0.00</span>
              </div>
              <div className="border-t border-border pt-4 flex justify-between text-lg font-bold">
                <span>Total</span>
                <span className="text-primary">${totalPrice().toFixed(2)}</span>
              </div>
            </div>
            <Link href="/checkout" className="mt-8 block">
              <Button size="lg" className="w-full">
                Checkout <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
