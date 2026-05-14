'use client';

import React from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useCartStore } from '@/store/useCartStore';
import { useAuthStore } from '@/store/useAuthStore';
import { Button } from '@/components/ui/Button';
import { orderService } from '@/api/orders';
import { paymentService } from '@/api/payment';
import { toast } from 'react-hot-toast';
import { Shield, ShoppingBag, ArrowRight } from 'lucide-react';

export default function CheckoutPage() {
  const router = useRouter();
  const { items, totalPrice, clearCart } = useCartStore();
  const { user } = useAuthStore();
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    if (!user) {
      toast.error('Please login to checkout');
      router.push('/auth/login?redirect=/checkout');
    }
  }, [user, router]);

  const handlePlaceOrder = async () => {
    if (!user) return;
    if (items.length === 0) {
      toast.error('Your cart is empty');
      return;
    }
    
    setLoading(true);
    try {
      const orderItems = items.map(item => ({
        product_id: item.id,
        quantity: item.cartQuantity
      }));
      
      const { data: orderData } = await orderService.create(user.id, orderItems);
      // API response structure is { data: { id: ... } }
      const orderId = orderData.data?.id || orderData.id;

      if (!orderId) {
        throw new Error('Could not generate Order ID');
      }

      const { data: paymentData } = await paymentService.checkout({
        order_id: String(orderId),

        amount: Math.round(totalPrice() * 100),
        currency: 'usd',
        description: `Order ${orderId} for ${user.email}`
      });

      toast.success('Redirecting to secure payment...');
      
      if (paymentData.checkout_url) {
        window.location.href = paymentData.checkout_url;
      } else {
        toast.error('Could not initiate payment. Please try again.');
      }

    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to place order');
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;

  return (
    <div className="mx-auto max-w-4xl px-4 py-20 sm:px-6 lg:px-8">
      <div className="mb-12 text-center">
        <h1 className="text-4xl md:text-5xl font-black tracking-tighter uppercase mb-4">Complete Purchase</h1>
        <p className="text-muted-foreground">Review your selection and proceed to secure checkout.</p>
      </div>

      <div className="premium-card overflow-hidden shadow-2xl">
        <div className="p-8 border-b border-border bg-secondary/10 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <ShoppingBag className="h-6 w-6 text-accent" />
            <span className="font-bold text-lg">Your Selection</span>
          </div>
          <span className="px-3 py-1 rounded-full bg-accent/10 text-accent text-xs font-black uppercase tracking-widest">
            {items.length} {items.length === 1 ? 'Item' : 'Items'}
          </span>
        </div>

        <div className="p-8 space-y-6 max-h-[400px] overflow-y-auto">
          {items.map((item) => (
            <div key={item.id} className="flex items-center space-x-6 group">
              <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-2xl bg-secondary border border-border group-hover:border-accent/50 transition-colors">
                <Image 
                  src={item.images?.[0] || 'https://media.wired.com/photos/68d1e224d4f5f78f3b59aa43/4:3/w_640%2Cc_limit/iPhone%252017%2520SOURCE%2520Julian%2520Chokkattu.jpg'} 
                  alt={item.title} 
                  fill 
                  sizes="80px"
                  className="object-cover" 
                />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-lg group-hover:text-accent transition-colors">{item.title}</h3>
                <p className="text-sm text-muted-foreground">Quantity: {item.cartQuantity}</p>
              </div>
              <div className="text-right">
                <p className="font-black text-lg">${(item.price * item.cartQuantity).toFixed(2)}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="p-8 bg-secondary/5 border-t border-border">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground uppercase tracking-widest font-black">Total Payable</p>
              <p className="text-4xl font-black text-accent">${totalPrice().toFixed(2)}</p>
            </div>
            
            <div className="flex-1 max-w-sm w-full space-y-4">
              <Button 
                onClick={handlePlaceOrder} 
                size="lg" 
                variant="cta" 
                className="w-full h-16 text-xl group" 
                isLoading={loading}
              >
                Pay Now <ArrowRight className="ml-2 h-6 w-6 transition-transform group-hover:translate-x-1" />
              </Button>
              <div className="flex items-center justify-center space-x-2 text-xs text-muted-foreground uppercase font-black tracking-widest">
                <Shield className="h-4 w-4 text-green-500" />
                <span>SSL Secured Checkout</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
