'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuthStore } from '@/store/useAuthStore';
import { useRouter } from 'next/navigation';
import { productService } from '@/api/products';
import { orderService } from '@/api/orders';
import { Product, Order, OrderStatus } from '@/types';
import { Button } from '@/components/ui/Button';
import { GlassCard } from '@/components/ui/GlassCard';
import { Plus, Package, ShoppingCart, TrendingUp, Trash2, Edit, CheckCircle, Clock, XCircle, RotateCcw } from 'lucide-react';
import { toast } from 'react-hot-toast';

export default function AdminDashboard() {
  const { user } = useAuthStore();
  const router = useRouter();
  const [products, setProducts] = React.useState<Product[]>([]);
  const [orders, setOrders] = React.useState<Order[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [activeTab, setActiveTab] = React.useState<'products' | 'orders'>('products');
  const [orderFilter, setOrderFilter] = React.useState<OrderStatus>('PENDING');

  const fetchData = React.useCallback(async () => {
    setLoading(true);
    try {
      const [{ data: pResponse }, { data: oResponse }] = await Promise.all([
        productService.getAll(),
        orderService.getAll(orderFilter)
      ]);
      
      // Handle nested data structure
      const pData = pResponse.data || pResponse;
      const oData = oResponse.data || oResponse;
      
      setProducts(Array.isArray(pData) ? pData : []);
      setOrders(Array.isArray(oData) ? oData : []);
    } catch (error) {
      console.error('Admin fetch error', error);
      toast.error('Failed to sync dashboard data');
    } finally {
      setLoading(false);
    }
  }, [orderFilter]);

  React.useEffect(() => {
    if (!user || user.role !== 'ADMIN') {
      toast.error('Admin access required');
      router.push('/');
      return;
    }
    fetchData();
  }, [user, router, fetchData]);

  const handleUpdateOrderStatus = async (orderId: string, status: OrderStatus) => {
    try {
      await orderService.updateStatus(orderId, status);
      toast.success(`Order ${status.toLowerCase()}`);
      fetchData(); // Refresh data
    } catch (error) {
      toast.error('Failed to update order status');
    }
  };

  const handleDeleteProduct = async (id: string) => {
    if (confirm('Are you sure you want to permanently delete this product?')) {
      try {
        await productService.delete(id);
        toast.success('Product removed');
        fetchData();
      } catch (error) {
        toast.error('Deletion failed');
      }
    }
  };

  const getStatusIcon = (status: OrderStatus) => {
    switch (status) {
      case 'PENDING': return <Clock className="h-4 w-4 text-orange-500" />;
      case 'CONFIRMED': return <CheckCircle className="h-4 w-4 text-blue-500" />;
      case 'COMPLETED': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'CANCELLED': return <XCircle className="h-4 w-4 text-red-500" />;
      default: return null;
    }
  };

  if (!user || user.role !== 'ADMIN') {
    return (
      <div className="flex min-h-[80vh] items-center justify-center px-4">
        <GlassCard className="max-w-md p-10 text-center border-red-500/20">
          <div className="mb-6 mx-auto w-20 h-20 rounded-full bg-red-500/10 flex items-center justify-center text-red-500">
            <XCircle className="h-10 w-10" />
          </div>
          <h2 className="text-3xl font-black uppercase tracking-tighter mb-4">Secure Access Only</h2>
          <p className="text-muted-foreground mb-8">
            This terminal is reserved for administrative personnel. Your current role ({user?.role || 'Guest'}) does not have the required clearance.
          </p>
          <Button onClick={() => router.push('/')} className="w-full">
            Return to Store
          </Button>
        </GlassCard>
      </div>
    );
  }


  return (
    <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
      {/* Dashboard Header */}
      <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-5xl font-black tracking-tighter uppercase mb-2">Command Center</h1>
          <p className="text-muted-foreground">Premium Inventory & Order Management System</p>
        </div>
        <div className="flex items-center space-x-4">
          <Button 
            variant={activeTab === 'products' ? 'primary' : 'ghost'} 
            onClick={() => setActiveTab('products')}
            className="rounded-full"
          >
            Inventory
          </Button>
          <Button 
            variant={activeTab === 'orders' ? 'primary' : 'ghost'} 
            onClick={() => setActiveTab('orders')}
            className="rounded-full"
          >
            Fulfillment
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-16">
        {[
          { label: 'Revenue', val: '$42.8k', icon: <TrendingUp />, color: 'from-green-500/20 to-green-500/5' },
          { label: 'Active Orders', val: orders.length, icon: <ShoppingCart />, color: 'from-blue-500/20 to-blue-500/5' },
          { label: 'Products', val: products.length, icon: <Package />, color: 'from-purple-500/20 to-purple-500/5' },
          { label: 'Growth', val: '+12%', icon: <TrendingUp />, color: 'from-accent/20 to-accent/5' },
        ].map((stat, i) => (
          <GlassCard key={i} className={`p-6 bg-gradient-to-br ${stat.color} border-none`}>
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 rounded-xl bg-background shadow-sm text-accent">
                {stat.icon}
              </div>
              <span className="text-xs font-black text-green-500">+4.5%</span>
            </div>
            <p className="text-sm font-black uppercase tracking-widest text-muted-foreground mb-1">{stat.label}</p>
            <p className="text-3xl font-black">{stat.val}</p>
          </GlassCard>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {activeTab === 'products' ? (
          <motion.section
            key="products"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <div className="mb-8 flex items-center justify-between">
              <h2 className="text-3xl font-black uppercase tracking-tight">Active Inventory</h2>
              <Button onClick={() => router.push('/admin/products/add')} variant="cta">
                <Plus className="mr-2 h-4 w-4" /> New Asset
              </Button>
            </div>
            
            <GlassCard className="overflow-hidden border-accent/10">
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-secondary/20 text-xs font-black uppercase tracking-widest text-muted-foreground">
                    <tr>
                      <th className="px-8 py-6">Asset</th>
                      <th className="px-8 py-6">Category</th>
                      <th className="px-8 py-6">Value</th>
                      <th className="px-8 py-6">Stock</th>
                      <th className="px-8 py-6 text-right">Control</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {products.map((product) => (
                      <tr key={product.id} className="hover:bg-accent/5 transition-colors group">
                        <td className="px-8 py-6">
                          <div className="flex items-center space-x-4">
                            <div className="h-12 w-12 overflow-hidden rounded-xl bg-secondary border border-border">
                              <img src={product.images?.[0] || 'https://via.placeholder.com/150'} alt="" className="h-full w-full object-cover" />
                            </div>
                            <span className="font-black text-lg">{product.title}</span>
                          </div>
                        </td>
                        <td className="px-8 py-6">
                          <span className="px-3 py-1 rounded-full bg-secondary text-[10px] font-black uppercase tracking-widest border border-border">
                            {product.category}
                          </span>
                        </td>
                        <td className="px-8 py-6 font-black text-accent">${product.price.toLocaleString()}</td>
                        <td className="px-8 py-6">
                          <div className="flex items-center space-x-2">
                            <div className={`h-2 w-2 rounded-full ${product.quantity > 5 ? 'bg-green-500' : 'bg-red-500'}`} />
                            <span className="font-bold">{product.quantity} Units</span>
                          </div>
                        </td>
                        <td className="px-8 py-6">
                          <div className="flex justify-end space-x-2">
                            <Button variant="ghost" size="icon" className="h-10 w-10 text-muted-foreground hover:text-accent">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="h-10 w-10 text-muted-foreground hover:text-red-500"
                              onClick={() => handleDeleteProduct(product.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </GlassCard>
          </motion.section>
        ) : (
          <motion.section
            key="orders"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <h2 className="text-3xl font-black uppercase tracking-tight">Fulfillment Pipeline</h2>
              <div className="flex items-center space-x-2 bg-secondary/20 p-1 rounded-xl">
                {(['PENDING', 'CONFIRMED', 'COMPLETED', 'CANCELLED'] as OrderStatus[]).map((status) => (
                  <button
                    key={status}
                    onClick={() => setOrderFilter(status)}
                    className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${
                      orderFilter === status ? 'bg-background text-accent shadow-sm' : 'text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    {status}
                  </button>
                ))}
              </div>
            </div>

            <GlassCard className="overflow-hidden border-accent/10">
              {loading ? (
                <div className="p-20 text-center text-muted-foreground font-black uppercase tracking-widest animate-pulse">Syncing orders...</div>
              ) : orders.length === 0 ? (
                <div className="p-20 text-center space-y-4">
                  <ShoppingCart className="h-12 w-12 mx-auto text-muted-foreground opacity-20" />
                  <p className="text-muted-foreground font-black uppercase tracking-widest">No {orderFilter.toLowerCase()} orders found</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead className="bg-secondary/20 text-xs font-black uppercase tracking-widest text-muted-foreground">
                      <tr>
                        <th className="px-8 py-6">Order ID</th>
                        <th className="px-8 py-6">Customer</th>
                        <th className="px-8 py-6">Status</th>
                        <th className="px-8 py-6">Total</th>
                        <th className="px-8 py-6 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {orders.map((order) => (
                        <tr key={order.id} className="hover:bg-accent/5 transition-colors group">
                          <td className="px-8 py-6 font-mono text-xs text-muted-foreground">
                            {order.id.slice(0, 8)}...
                          </td>
                          <td className="px-8 py-6">
                            <span className="font-bold">{order.user_id.slice(0, 8)}</span>
                          </td>
                          <td className="px-8 py-6">
                            <div className="flex items-center space-x-2">
                              {getStatusIcon(order.status)}
                              <span className="text-[10px] font-black uppercase tracking-widest">{order.status}</span>
                            </div>
                          </td>
                          <td className="px-8 py-6 font-black text-accent">${order.total_amount.toLocaleString()}</td>
                          <td className="px-8 py-6">
                            <div className="flex justify-end space-x-2">
                              {order.status === 'PENDING' && (
                                <Button 
                                  size="sm" 
                                  variant="outline" 
                                  onClick={() => handleUpdateOrderStatus(order.id, 'CONFIRMED')}
                                  className="h-8 px-3 text-[10px] uppercase font-black tracking-widest"
                                >
                                  Confirm
                                </Button>
                              )}
                              {order.status === 'CONFIRMED' && (
                                <Button 
                                  size="sm" 
                                  variant="primary" 
                                  onClick={() => handleUpdateOrderStatus(order.id, 'COMPLETED')}
                                  className="h-8 px-3 text-[10px] uppercase font-black tracking-widest"
                                >
                                  Complete
                                </Button>
                              )}
                              {['PENDING', 'CONFIRMED'].includes(order.status) && (
                                <Button 
                                  size="sm" 
                                  variant="ghost" 
                                  onClick={() => handleUpdateOrderStatus(order.id, 'CANCELLED')}
                                  className="h-8 px-3 text-[10px] uppercase font-black tracking-widest text-red-500 hover:bg-red-500/10"
                                >
                                  Cancel
                                </Button>
                              )}
                              {order.status === 'CANCELLED' && (
                                <Button 
                                  size="sm" 
                                  variant="ghost" 
                                  onClick={() => handleUpdateOrderStatus(order.id, 'PENDING')}
                                  className="h-8 px-3 text-[10px] uppercase font-black tracking-widest"
                                >
                                  <RotateCcw className="h-3 w-3 mr-1" /> Reset
                                </Button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </GlassCard>
          </motion.section>
        )}
      </AnimatePresence>
    </div>
  );
}
