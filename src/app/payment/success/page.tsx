'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { CheckCircle, ArrowRight, Package } from 'lucide-react';
import { Button } from '@/components/ui/Button';

import { useCartStore } from '@/store/useCartStore';

export default function PaymentSuccessPage() {
  const clearCart = useCartStore((state) => state.clearCart);

  React.useEffect(() => {
    clearCart();
  }, [clearCart]);

  return (

    <div className="flex min-h-[80vh] flex-col items-center justify-center px-4 text-center">
      <motion.div
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', damping: 15 }}
        className="mb-8 rounded-full bg-green-100 p-8 text-green-600"
      >
        <CheckCircle className="h-20 w-20" />
      </motion.div>
      
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="max-w-md space-y-4"
      >
        <h1 className="text-4xl font-extrabold tracking-tight">Payment Successful!</h1>
        <p className="text-lg text-muted-foreground">
          Thank you for your purchase. Your order has been placed and is being processed.
        </p>
        
        <div className="pt-8 flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 justify-center">
          <Link href="/profile">
            <Button variant="outline" className="w-full sm:w-auto">
              <Package className="mr-2 h-4 w-4" /> View My Orders
            </Button>
          </Link>
          <Link href="/products">
            <Button className="w-full sm:w-auto">
              Continue Shopping <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
