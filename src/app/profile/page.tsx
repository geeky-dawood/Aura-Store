'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useAuthStore } from '@/store/useAuthStore';
import { userService } from '@/api/user';
import { User, Order } from '@/types';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { orderService } from '@/api/orders';
import { toast } from 'react-hot-toast';
import { User as UserIcon, Package, MapPin, Settings, Camera } from 'lucide-react';

export default function ProfilePage() {
  const { user, setAuth } = useAuthStore();
  const [profile, setProfile] = React.useState<User | null>(null);
  const [orders, setOrders] = React.useState<Order[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [activeTab, setActiveTab] = React.useState<'profile' | 'orders' | 'addresses'>('profile');

  React.useEffect(() => {
    if (user) {
      const fetchData = async () => {
        try {
          const [{ data: profileData }, { data: ordersData }] = await Promise.all([
            userService.getProfile(),
            orderService.getByUserId(user.id)
          ]);
          setProfile(profileData);
          setOrders(ordersData.data || []);
        } catch (error) {
          console.error('Failed to fetch data', error);
        } finally {
          setLoading(false);
        }
      };
      fetchData();
    }
  }, [user]);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('Profile updated successfully!');
  };

  if (loading) return <div className="flex h-screen items-center justify-center">Loading...</div>;

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="flex flex-col gap-8 lg:flex-row">
        {/* Sidebar */}
        <aside className="w-full lg:w-64 space-y-2">
          <button
            onClick={() => setActiveTab('profile')}
            className={`flex w-full items-center space-x-3 rounded-xl p-4 transition-colors ${
              activeTab === 'profile' ? 'bg-primary text-white shadow-lg' : 'hover:bg-secondary'
            }`}
          >
            <UserIcon className="h-5 w-5" />
            <span className="font-medium">My Profile</span>
          </button>
          <button
            onClick={() => setActiveTab('orders')}
            className={`flex w-full items-center space-x-3 rounded-xl p-4 transition-colors ${
              activeTab === 'orders' ? 'bg-primary text-white shadow-lg' : 'hover:bg-secondary'
            }`}
          >
            <Package className="h-5 w-5" />
            <span className="font-medium">Order History</span>
          </button>
          <button
            onClick={() => setActiveTab('addresses')}
            className={`flex w-full items-center space-x-3 rounded-xl p-4 transition-colors ${
              activeTab === 'addresses' ? 'bg-primary text-white shadow-lg' : 'hover:bg-secondary'
            }`}
          >
            <MapPin className="h-5 w-5" />
            <span className="font-medium">Addresses</span>
          </button>
        </aside>

        {/* Content */}
        <main className="flex-1">
          {activeTab === 'profile' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="premium-card p-8"
            >
              <div className="mb-8 flex items-center space-x-6">
                <div className="relative group">
                  <div className="h-24 w-24 overflow-hidden rounded-full border-4 border-primary/20 bg-secondary">
                    {profile?.profile_picture ? (
                      <img src={profile.profile_picture} alt="Avatar" className="h-full w-full object-cover" />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-3xl font-bold text-muted-foreground">
                        {profile?.name?.charAt(0)}
                      </div>
                    )}
                  </div>
                  <button className="absolute bottom-0 right-0 rounded-full bg-primary p-2 text-white shadow-lg transition-transform hover:scale-110">
                    <Camera className="h-4 w-4" />
                  </button>
                </div>
                <div>
                  <h2 className="text-2xl font-bold">{profile?.name}</h2>
                  <p className="text-muted-foreground">{profile?.email}</p>
                </div>
              </div>

              <form onSubmit={handleUpdateProfile} className="space-y-6">
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <Input label="Full Name" defaultValue={profile?.name} />
                  <Input label="Email" defaultValue={profile?.email} disabled />
                  <Input label="Date of Birth" type="date" defaultValue={profile?.dob?.split('T')[0]} />
                  <Input label="Preferred Language" defaultValue={profile?.preferred_language} />
                </div>
                <div className="flex justify-end">
                  <Button type="submit">Save Changes</Button>
                </div>
              </form>
            </motion.div>
          )}

          {activeTab === 'orders' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <h2 className="text-2xl font-bold mb-6">Order History</h2>
              {orders.length > 0 ? (
                orders.map((order) => (
                  <div key={order.id} className="premium-card p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center">
                    <div>
                      <p className="text-xs text-muted-foreground uppercase tracking-widest">Order ID: {order.id}</p>
                      <p className="font-bold text-lg mt-1">{new Date(order.created_at).toLocaleDateString()}</p>
                      <p className="text-sm text-muted-foreground">{order.items.length} items</p>
                    </div>
                    <div className="mt-4 sm:mt-0 flex flex-col items-end">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold mb-2 ${
                        order.status === 'COMPLETED' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                      }`}>
                        {order.status}
                      </span>
                      <p className="text-xl font-bold text-primary">${order.total_amount?.toFixed(2) || '0.00'}</p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center p-12 glass rounded-2xl border-2 border-dashed border-border">
                  <Package className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-lg font-bold">No orders yet</h3>
                  <p className="text-muted-foreground">When you buy something, it will appear here.</p>
                </div>
              )}
            </motion.div>
          )}

          {activeTab === 'addresses' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Saved Addresses</h2>
                <Button variant="outline" size="sm">Add New</Button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="premium-card p-6 border-2 border-primary bg-primary/5">
                  <div className="flex justify-between items-start mb-4">
                    <span className="px-2 py-1 bg-primary text-white text-[10px] font-bold rounded uppercase tracking-widest">Home</span>
                    <Settings className="h-4 w-4 text-muted-foreground cursor-pointer" />
                  </div>
                  <p className="font-bold">John Doe</p>
                  <p className="text-sm text-muted-foreground mt-1">123 Luxury Ave, Apt 4B</p>
                  <p className="text-sm text-muted-foreground">New York, NY 10001, USA</p>
                </div>
              </div>
            </motion.div>
          )}
        </main>
      </div>
    </div>
  );
}
