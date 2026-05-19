'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useCartStore } from '@/store/useCartStore';
import { toast } from 'react-hot-toast';

export default function PaymentSuccessPage() {
  const clearCart = useCartStore((state) => state.clearCart);
  const router = useRouter();

  React.useEffect(() => {
    // 1. Clear the cart
    clearCart();
    
    // 2. Alert payment completed
    toast.success('Payment has been done!');
    
    // 3. Reroute back to home
    router.push('/');
  }, [clearCart, router]);

  return (
    <div className="flex min-h-[85vh] flex-col items-center justify-center px-4 text-center">
      <div className="animate-pulse font-black text-accent uppercase tracking-widest text-lg">
        Processing Payment Clearances...
      </div>
    </div>
  );
}
