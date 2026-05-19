'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuthStore } from '@/store/useAuthStore';
import { userService, addressService } from '@/api/user';
import { orderService } from '@/api/orders';
import { User, Order, Address } from '@/types';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { GlassCard } from '@/components/ui/GlassCard';
import { toast } from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { 
  User as UserIcon, 
  Package, 
  MapPin, 
  Settings, 
  Camera, 
  Trash2, 
  Globe, 
  Plus, 
  X, 
  CheckCircle,
  HelpCircle,
  AlertTriangle
} from 'lucide-react';

const AVATAR_PRESETS = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&h=150&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&h=150&q=80',
  'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=150&h=150&q=80',
  'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=150&h=150&q=80',
];

export default function ProfilePage() {
  const { user, setAuth, logout } = useAuthStore();
  const router = useRouter();
  const [profile, setProfile] = React.useState<User | null>(null);
  const [orders, setOrders] = React.useState<Order[]>([]);
  const [addresses, setAddresses] = React.useState<Address[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [activeTab, setActiveTab] = React.useState<'profile' | 'orders' | 'addresses'>('profile');
  
  // Modals & Forms State
  const [showAvatarModal, setShowAvatarModal] = React.useState(false);
  const [selectedAvatarUrl, setSelectedAvatarUrl] = React.useState('');
  const [avatarInputUrl, setAvatarInputUrl] = React.useState('');
  const [showAddressModal, setShowAddressModal] = React.useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = React.useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = React.useState('');
  const [isDeletingAccount, setIsDeletingAccount] = React.useState(false);

  // Address Form State
  const [addressForm, setAddressForm] = React.useState({
    country: 'Pakistan',
    state: 'Punjab',
    city: 'Lahore',
    zip_code: '54000',
    address: 'Johar Town, Lahore',
    address_line_1: 'House 123, Block A',
    address_line_2: 'Near Emporium Mall',
    tag: 'Home',
    longitude: 74.3587,
    latitude: 31.5204,
  });

  // Stylized Vector Map Ref
  const mapRef = React.useRef<HTMLDivElement>(null);

  const fetchData = React.useCallback(async () => {
    if (!user) return;
    try {
      const [{ data: profileDataRes }, { data: ordersData }] = await Promise.all([
        userService.getProfile(),
        orderService.getByUserId(user.id)
      ]);
      const profileData = (profileDataRes as any).data || profileDataRes;
      setProfile(profileData);
      setAddresses(profileData.addresses || []);
      setOrders(ordersData.data || []);
      if (profileData.profile_picture) {
        setSelectedAvatarUrl(profileData.profile_picture);
      }
    } catch (error) {
      console.error('Failed to fetch profile/orders data', error);
      toast.error('Failed to load profile details');
    } finally {
      setLoading(false);
    }
  }, [user]);

  React.useEffect(() => {
    if (!user) {
      router.push('/auth/login?redirect=/profile');
      return;
    }
    fetchData();
  }, [user, router, fetchData]);

  const handleUpdateProfile = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const name = formData.get('name') as string;
    const dob = formData.get('dob') as string;
    const preferred_language = formData.get('preferred_language') as string;

    setLoading(true);
    try {
      const payload = {
        dob: dob ? new Date(dob).toISOString() : undefined,
        preferred_language,
        profile_picture: selectedAvatarUrl,
      };

      await userService.updateProfile(payload);

      // Re-fetch profile to sync state
      const { data: updatedProfileRes } = await userService.getProfile();
      const updatedProfile = (updatedProfileRes as any).data || updatedProfileRes;
      setProfile(updatedProfile);

      if (user) {
        setAuth({
          ...user,
          name: name || user.name,
          profile_picture: selectedAvatarUrl,
          dob: updatedProfile.dob,
          preferred_language: updatedProfile.preferred_language,
        }, localStorage.getItem('access_token') || '');
      }

      toast.success('Profile updated successfully!');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleAvatarSelect = (url: string) => {
    setSelectedAvatarUrl(url);
    setShowAvatarModal(false);
    toast.success('Avatar selected! Save changes to apply.');
  };

  const handleAvatarInputSubmit = () => {
    if (avatarInputUrl.startsWith('http')) {
      setSelectedAvatarUrl(avatarInputUrl);
      setShowAvatarModal(false);
      toast.success('Custom avatar loaded! Save changes to apply.');
    } else {
      toast.error('Please enter a valid image URL');
    }
  };

  // Click on vector map to position pin and set coordinates
  const handleMapClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!mapRef.current) return;
    const rect = mapRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // Normalize to mock Lahore area bounding box coordinates
    // Lahore: ~31.5204 N, 74.3587 E
    const normalizedLat = 31.4000 + (1 - y / rect.height) * 0.2;
    const normalizedLong = 74.2000 + (x / rect.width) * 0.2;

    setAddressForm(prev => ({
      ...prev,
      latitude: parseFloat(normalizedLat.toFixed(4)),
      longitude: parseFloat(normalizedLong.toFixed(4))
    }));
    toast.success(`Coordinates logged: ${normalizedLat.toFixed(4)}, ${normalizedLong.toFixed(4)}`);
  };

  const handleCreateAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data: newAddress } = await addressService.create(addressForm);
      setAddresses(prev => [...prev, newAddress]);
      setShowAddressModal(false);
      toast.success('New address registered!');
      
      // Refresh user profile
      fetchData();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to create address');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAddress = async (addressId: string) => {
    if (confirm('Remove this address?')) {
      try {
        await addressService.delete(addressId);
        setAddresses(prev => prev.filter(addr => addr.id !== addressId));
        toast.success('Address deleted');
        fetchData();
      } catch (error) {
        toast.error('Failed to remove address');
      }
    }
  };

  const handleDeleteAccount = async () => {
    if (deleteConfirmText !== 'DELETE') {
      toast.error('Please type DELETE to confirm');
      return;
    }
    setIsDeletingAccount(true);
    try {
      await userService.deleteProfile();
      toast.success('Your profile has been removed. Goodbye.');
      logout();
      router.push('/');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to delete profile');
    } finally {
      setIsDeletingAccount(false);
      setShowDeleteConfirm(false);
    }
  };

  if (loading && !profile) return <div className="flex h-screen items-center justify-center font-bold text-accent animate-pulse uppercase tracking-widest text-lg">Syncing profile terminal...</div>;

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="flex flex-col gap-8 lg:flex-row">
        {/* Sidebar */}
        <aside className="w-full lg:w-64 space-y-2">
          <button
            onClick={() => setActiveTab('profile')}
            className={`flex w-full items-center space-x-3 rounded-xl p-4 transition-colors font-bold uppercase tracking-wider text-sm ${
              activeTab === 'profile' ? 'gold-gradient text-white shadow-lg shadow-accent/20' : 'hover:bg-secondary border border-border/30'
            }`}
          >
            <UserIcon className="h-5 w-5" />
            <span>My Profile</span>
          </button>
          <button
            onClick={() => setActiveTab('orders')}
            className={`flex w-full items-center space-x-3 rounded-xl p-4 transition-colors font-bold uppercase tracking-wider text-sm ${
              activeTab === 'orders' ? 'gold-gradient text-white shadow-lg shadow-accent/20' : 'hover:bg-secondary border border-border/30'
            }`}
          >
            <Package className="h-5 w-5" />
            <span>Order History</span>
          </button>
          <button
            onClick={() => setActiveTab('addresses')}
            className={`flex w-full items-center space-x-3 rounded-xl p-4 transition-colors font-bold uppercase tracking-wider text-sm ${
              activeTab === 'addresses' ? 'gold-gradient text-white shadow-lg shadow-accent/20' : 'hover:bg-secondary border border-border/30'
            }`}
          >
            <MapPin className="h-5 w-5" />
            <span>Addresses</span>
          </button>
        </aside>

        {/* Content */}
        <main className="flex-1">
          {activeTab === 'profile' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="premium-card p-8 space-y-8"
            >
              {/* Profile Header & Avatar Picker */}
              <div className="flex items-center space-x-6 border-b border-border pb-6">
                <div className="relative group">
                  <div className="h-24 w-24 overflow-hidden rounded-full border-4 border-accent/20 bg-secondary flex items-center justify-center">
                    {selectedAvatarUrl ? (
                      <img src={selectedAvatarUrl} alt="Avatar" className="h-full w-full object-cover" />
                    ) : (
                      <div className="text-3xl font-black text-accent">
                        {profile?.name?.charAt(0).toUpperCase()}
                      </div>
                    )}
                  </div>
                  <button 
                    onClick={() => setShowAvatarModal(true)}
                    className="absolute bottom-0 right-0 rounded-full bg-primary p-2 text-primary-foreground shadow-lg border border-white/10 hover:bg-accent hover:text-white transition-colors"
                  >
                    <Camera className="h-4 w-4" />
                  </button>
                </div>
                <div>
                  <h2 className="text-3xl font-black tracking-tight">{profile?.name}</h2>
                  <p className="text-muted-foreground">{profile?.email}</p>
                  <span className="inline-block mt-2 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-accent/15 text-accent border border-accent/20">
                    {profile?.role} Clearance
                  </span>
                </div>
              </div>

              {/* Profile Details Form */}
              <form onSubmit={handleUpdateProfile} className="space-y-6">
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <Input label="Full Name" name="name" defaultValue={profile?.name} placeholder="Name" required />
                  <Input label="Email Address" name="email" defaultValue={profile?.email} disabled />
                  <Input label="Date of Birth" name="dob" type="date" defaultValue={profile?.dob ? profile.dob.split('T')[0] : ''} />
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground">Preferred Language</label>
                    <select
                      name="preferred_language"
                      defaultValue={profile?.preferred_language || 'EN'}
                      className="flex h-11 w-full rounded-xl border border-border bg-background/50 px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                    >
                      <option value="EN">English</option>
                      <option value="ES">Spanish</option>
                      <option value="FR">French</option>
                    </select>
                  </div>
                </div>
                <div className="flex justify-end pt-4 border-t border-border">
                  <Button type="submit">Save Changes</Button>
                </div>
              </form>

              {/* Danger Zone */}
              <div className="pt-8 border-t border-red-500/20">
                <h3 className="text-lg font-black text-red-500 uppercase tracking-widest mb-4">Danger Zone</h3>
                <div className="rounded-2xl border border-red-500/20 bg-red-500/5 p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div>
                    <h4 className="font-bold text-red-500">Deactivate Profile</h4>
                    <p className="text-sm text-muted-foreground mt-1">Permanently remove your account and all order records from our systems.</p>
                  </div>
                  <Button variant="danger" onClick={() => setShowDeleteConfirm(true)} className="rounded-full px-6 font-bold uppercase tracking-wider text-xs">
                    Terminate Account
                  </Button>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'orders' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <h2 className="text-3xl font-black uppercase tracking-tight mb-8">Order History</h2>
              {orders.length > 0 ? (
                orders.map((order) => (
                  <GlassCard key={order.id} className="p-6 border-accent/10 hover:border-accent/30">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                      <div>
                        <p className="text-xs font-mono text-muted-foreground uppercase tracking-widest">Order Reference</p>
                        <p className="font-mono text-sm text-accent font-bold mt-1">{order.id}</p>
                        <div className="flex items-center space-x-4 mt-2">
                          <p className="text-xs text-muted-foreground">{new Date(order.created_at).toLocaleDateString()}</p>
                          <span className="h-1.5 w-1.5 rounded-full bg-border" />
                          <p className="text-xs text-muted-foreground">{order.items.length} Curated Assets</p>
                        </div>
                      </div>
                      <div className="flex flex-col sm:items-end gap-2">
                        <span className={`inline-flex px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                          order.status === 'COMPLETED' 
                            ? 'bg-green-500/10 text-green-500 border border-green-500/20' 
                            : order.status === 'CANCELLED'
                            ? 'bg-red-500/10 text-red-500 border border-red-500/20'
                            : 'bg-orange-500/10 text-orange-500 border border-orange-500/20'
                        }`}>
                          {order.status}
                        </span>
                        <p className="text-2xl font-black text-foreground">${order.total_amount?.toLocaleString() || '0.00'}</p>
                      </div>
                    </div>
                  </GlassCard>
                ))
              ) : (
                <div className="text-center p-20 glass rounded-3xl border-2 border-dashed border-border flex flex-col items-center space-y-4">
                  <Package className="h-16 w-16 text-muted-foreground opacity-20 animate-pulse" />
                  <h3 className="text-xl font-bold uppercase tracking-widest">No order files found</h3>
                  <p className="text-muted-foreground">Any high-end acquisitions will be logged inside this terminal.</p>
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
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-3xl font-black uppercase tracking-tight">Saved Addresses</h2>
                <Button onClick={() => setShowAddressModal(true)} variant="cta" className="rounded-full">
                  <Plus className="mr-2 h-4 w-4" /> Add Address
                </Button>
              </div>
              
              {addresses.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {addresses.map((address) => (
                    <GlassCard key={address.id} className="p-6 border-accent/15">
                      <div className="flex justify-between items-start mb-4">
                        <span className="px-3 py-1 bg-accent/10 border border-accent/25 text-accent text-[10px] font-black rounded-full uppercase tracking-widest">
                          {address.tag || 'Home'}
                        </span>
                        <button 
                          onClick={() => handleDeleteAddress(address.id)}
                          className="p-2 rounded-lg bg-red-500/10 text-red-500 hover:bg-red-500/20 transition-colors"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                      <h4 className="font-black text-lg text-foreground">{address.address}</h4>
                      <p className="text-sm text-muted-foreground mt-2">{address.address_line_1}</p>
                      {address.address_line_2 && <p className="text-sm text-muted-foreground">{address.address_line_2}</p>}
                      <p className="text-sm text-muted-foreground">{address.city}, {address.state} - {address.zip_code}</p>
                      <p className="text-sm text-accent/80 font-mono mt-3 text-xs flex items-center space-x-1">
                        <Globe className="h-3.5 w-3.5 mr-1" />
                        <span>Lat: {address.latitude} / Long: {address.longitude}</span>
                      </p>
                    </GlassCard>
                  ))}
                </div>
              ) : (
                <div className="text-center p-20 glass rounded-3xl border-2 border-dashed border-border flex flex-col items-center space-y-4">
                  <MapPin className="h-16 w-16 text-muted-foreground opacity-20 animate-pulse" />
                  <h3 className="text-xl font-bold uppercase tracking-widest">No address assets</h3>
                  <p className="text-muted-foreground">Register shipping address credentials to access high-speed checkout routes.</p>
                </div>
              )}
            </motion.div>
          )}
        </main>
      </div>

      {/* Avatar Picker Modal */}
      <AnimatePresence>
        {showAvatarModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="premium-card max-w-md w-full p-8 space-y-6 relative border border-white/10"
            >
              <button 
                onClick={() => setShowAvatarModal(false)}
                className="absolute top-4 right-4 text-muted-foreground hover:text-foreground"
              >
                <X className="h-6 w-6" />
              </button>
              
              <div className="text-center">
                <h3 className="text-2xl font-black uppercase tracking-tight">Select Profile Avatar</h3>
                <p className="text-sm text-muted-foreground mt-1">Pick a stunning preset image or supply a custom link</p>
              </div>

              {/* Presets Grid */}
              <div className="grid grid-cols-4 gap-4">
                {AVATAR_PRESETS.map((url, idx) => (
                  <button 
                    key={idx}
                    onClick={() => handleAvatarSelect(url)}
                    className="aspect-square rounded-full overflow-hidden border-2 border-transparent hover:border-accent hover:scale-105 transition-all duration-300 relative group"
                  >
                    <img src={url} alt={`Preset ${idx}`} className="h-full w-full object-cover" />
                  </button>
                ))}
              </div>

              <div className="flex items-center space-x-2 my-4">
                <div className="h-px bg-border flex-1" />
                <span className="text-xs text-muted-foreground uppercase font-black tracking-widest">OR</span>
                <div className="h-px bg-border flex-1" />
              </div>

              {/* URL Custom Input */}
              <div className="space-y-4">
                <Input 
                  label="Custom Image URL" 
                  placeholder="https://example.com/avatar.jpg" 
                  value={avatarInputUrl}
                  onChange={(e) => setAvatarInputUrl(e.target.value)}
                />
                <Button onClick={handleAvatarInputSubmit} className="w-full">
                  Apply Custom Image URL
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Account Deletion Confirmation Modal */}
      <AnimatePresence>
        {showDeleteConfirm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="premium-card max-w-md w-full p-8 space-y-6 relative border border-red-500/30 bg-background/90"
            >
              <button 
                onClick={() => setShowDeleteConfirm(false)}
                className="absolute top-4 right-4 text-muted-foreground hover:text-foreground"
              >
                <X className="h-6 w-6" />
              </button>
              
              <div className="text-center space-y-2">
                <div className="mx-auto w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center text-red-500 mb-2">
                  <AlertTriangle className="h-6 w-6" />
                </div>
                <h3 className="text-2xl font-black text-red-500 uppercase tracking-tight">Confirm Termination</h3>
                <p className="text-sm text-muted-foreground">
                  This operation is irreversible. Your profile, account settings, and transaction records will be permanently erased.
                </p>
              </div>

              <div className="space-y-4">
                <Input 
                  label='Type "DELETE" to authorize account erasure' 
                  placeholder="DELETE" 
                  value={deleteConfirmText}
                  onChange={(e) => setDeleteConfirmText(e.target.value)}
                />
                <div className="flex gap-4">
                  <Button variant="ghost" onClick={() => setShowDeleteConfirm(false)} className="flex-1">
                    Cancel
                  </Button>
                  <Button variant="danger" onClick={handleDeleteAccount} isLoading={isDeletingAccount} className="flex-1">
                    Delete Permanently
                  </Button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Add Address Modal */}
      <AnimatePresence>
        {showAddressModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md overflow-y-auto">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="premium-card max-w-2xl w-full p-8 space-y-6 relative border border-white/10 my-8"
            >
              <button 
                onClick={() => setShowAddressModal(false)}
                className="absolute top-4 right-4 text-muted-foreground hover:text-foreground"
              >
                <X className="h-6 w-6" />
              </button>

              <div>
                <h3 className="text-2xl font-black uppercase tracking-tight">Register Delivery Address</h3>
                <p className="text-sm text-muted-foreground mt-1">Configure shipping parameters and coordinates selector</p>
              </div>

              {/* Coordinates Interactive Map */}
              <div className="space-y-2">
                <label className="text-sm font-black uppercase tracking-widest text-muted-foreground flex justify-between">
                  <span>Interactive Coordinate Map Selector</span>
                  <span className="text-accent font-mono">Click grid to drop location pin</span>
                </label>
                <div 
                  ref={mapRef}
                  onClick={handleMapClick}
                  className="bg-neutral-900 border border-white/10 rounded-2xl relative overflow-hidden aspect-video select-none cursor-crosshair group shadow-inner"
                >
                  {/* Styled Grid Satelite Overlay */}
                  <svg className="absolute inset-0 w-full h-full opacity-20 pointer-events-none">
                    <defs>
                      <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                        <path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="0.5" />
                      </pattern>
                    </defs>
                    <rect width="100%" height="100%" fill="url(#grid)" />
                    {/* Golden Curvy Luxury Highways */}
                    <path d="M-50,150 Q150,50 350,250 T750,150" fill="none" stroke="#D4AF37" strokeWidth="2" strokeDasharray="5,5" />
                    <path d="M100,-20 Q250,180 150,350 T400,500" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="4" />
                    {/* Aesthetic Luxury Rivers */}
                    <path d="M-10,300 C200,280 150,450 700,420" fill="none" stroke="#4a5568" strokeWidth="12" className="opacity-40" />
                  </svg>

                  {/* Stylized Location Pin with Pulse */}
                  <div 
                    className="absolute transition-all duration-300 -translate-x-1/2 -translate-y-full flex flex-col items-center pointer-events-none"
                    style={{
                      // Inverse normalize Lahores area back to percent representation for map marker placement
                      left: `${((addressForm.longitude - 74.2000) / 0.2) * 100}%`,
                      top: `${((1 - (addressForm.latitude - 31.4000) / 0.2)) * 100}%`
                    }}
                  >
                    <span className="absolute inline-flex h-8 w-8 rounded-full bg-accent/30 animate-ping -bottom-4" />
                    <MapPin className="h-8 w-8 text-accent fill-accent/20 animate-bounce" />
                    <span className="px-2 py-0.5 rounded bg-black/85 text-[8px] font-bold border border-accent/40 text-accent uppercase mt-1 tracking-wider whitespace-nowrap shadow-md">
                      Pin Active
                    </span>
                  </div>

                  {/* Aesthetic Map Coordinates Dashboard Hud overlay */}
                  <div className="absolute bottom-3 left-3 px-3 py-1.5 rounded-xl bg-black/85 border border-white/15 text-[10px] font-mono text-white/90 uppercase tracking-widest flex items-center space-x-4 shadow-lg backdrop-blur-sm pointer-events-none">
                    <span className="text-accent font-bold animate-pulse">SYSTEM ACTIVE</span>
                    <span>LAT: <b className="text-accent">{addressForm.latitude}</b></span>
                    <span>LONG: <b className="text-accent">{addressForm.longitude}</b></span>
                  </div>
                </div>
              </div>

              {/* Details Fields Form */}
              <form onSubmit={handleCreateAddress} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <Input 
                    label="Street Address / Area" 
                    value={addressForm.address} 
                    onChange={e => setAddressForm({...addressForm, address: e.target.value})}
                    placeholder="Johar Town, Lahore"
                    required
                  />
                  <Input 
                    label="Address Line 1" 
                    value={addressForm.address_line_1} 
                    onChange={e => setAddressForm({...addressForm, address_line_1: e.target.value})}
                    placeholder="House 123, Block A"
                    required
                  />
                  <Input 
                    label="Address Line 2" 
                    value={addressForm.address_line_2} 
                    onChange={e => setAddressForm({...addressForm, address_line_2: e.target.value})}
                    placeholder="Near Emporium Mall"
                  />
                  <Input 
                    label="City" 
                    value={addressForm.city} 
                    onChange={e => setAddressForm({...addressForm, city: e.target.value})}
                    placeholder="Lahore"
                    required
                  />
                  <Input 
                    label="State / Province" 
                    value={addressForm.state} 
                    onChange={e => setAddressForm({...addressForm, state: e.target.value})}
                    placeholder="Punjab"
                    required
                  />
                  <Input 
                    label="Zip Code" 
                    value={addressForm.zip_code} 
                    onChange={e => setAddressForm({...addressForm, zip_code: e.target.value})}
                    placeholder="54000"
                    required
                  />
                  <Input 
                    label="Country" 
                    value={addressForm.country} 
                    onChange={e => setAddressForm({...addressForm, country: e.target.value})}
                    placeholder="Pakistan"
                    required
                  />
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground">Address Tag</label>
                    <select
                      value={addressForm.tag}
                      onChange={e => setAddressForm({...addressForm, tag: e.target.value})}
                      className="flex h-11 w-full rounded-xl border border-border bg-background/50 px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                    >
                      <option value="Home">Home</option>
                      <option value="Office">Office</option>
                      <option value="Apartment">Apartment</option>
                      <option value="Warehouse">Warehouse</option>
                    </select>
                  </div>
                </div>

                <div className="flex gap-4 pt-4 border-t border-border">
                  <Button variant="ghost" type="button" onClick={() => setShowAddressModal(false)} className="flex-1">
                    Cancel
                  </Button>
                  <Button type="submit" className="flex-1">
                    Save Address credentials
                  </Button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
