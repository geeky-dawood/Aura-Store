'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { productService } from '@/api/products';
import { toast } from 'react-hot-toast';
import { ArrowLeft, Upload, Package, CheckCircle, XCircle } from 'lucide-react';

export default function AddProductPage() {
  const router = useRouter();
  const [loading, setLoading] = React.useState(false);
  const [uploadStatus, setUploadStatus] = React.useState('');
  const [imageFile, setImageFile] = React.useState<File | null>(null);
  
  const [formData, setFormData] = React.useState({
    title: '',
    description: '',
    price: '',
    category: '',
    quantity: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setImageFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setUploadStatus('Registering product assets...');

    try {
      const payload = {
        title: formData.title,
        description: formData.description,
        price: parseFloat(formData.price),
        category: formData.category,
        quantity: parseInt(formData.quantity)
      };

      // 1. Create Product
      const response = await productService.add(payload);
      
      // Safe extraction of product ID
      const responseData = response.data || response;
      const createdProduct = responseData.data || responseData;
      const productId = createdProduct.id;

      if (!productId) {
        throw new Error('Product creation succeeded but no reference ID was retrieved');
      }

      // 2. Upload Image if Selected
      if (imageFile) {
        setUploadStatus('Uploading product primary asset image...');
        await productService.uploadImage(productId, imageFile);
      }

      toast.success('Product and image registered successfully!');
      router.push('/admin');
    } catch (error: any) {
      console.error('Failed to create product asset', error);
      toast.error(error.response?.data?.message || error.message || 'Failed to list product');
    } finally {
      setLoading(false);
      setUploadStatus('');
    }
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
      <Button variant="ghost" onClick={() => router.back()} className="mb-8">
        <ArrowLeft className="mr-2 h-4 w-4" /> Back to Dashboard
      </Button>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="premium-card p-10"
      >
        <div className="mb-10 flex items-center space-x-4 border-b border-border pb-6">
          <div className="rounded-2xl bg-primary/10 p-3 text-primary">
            <Package className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight uppercase">Add New Product Asset</h1>
            <p className="text-sm text-muted-foreground">List a new high-end item in the Aura Store catalog</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <Input
                label="Product Title"
                name="title"
                required
                value={formData.title}
                onChange={handleChange}
                placeholder="e.g. iPhone 15 Pro Max"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="text-sm font-medium text-muted-foreground block mb-2">Description</label>
              <textarea
                name="description"
                required
                rows={4}
                value={formData.description}
                onChange={handleChange}
                className="flex w-full rounded-xl border border-border bg-background/50 px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                placeholder="Describe the product details..."
              />
            </div>
            <Input
              label="Price ($)"
              name="price"
              type="number"
              step="0.01"
              required
              value={formData.price}
              onChange={handleChange}
              placeholder="999.99"
            />
            <Input
              label="Initial Stock Quantity"
              name="quantity"
              type="number"
              required
              value={formData.quantity}
              onChange={handleChange}
              placeholder="50"
            />
            <div className="sm:col-span-2">
              <Input
                label="Category"
                name="category"
                required
                value={formData.category}
                onChange={handleChange}
                placeholder="e.g. Electronics"
              />
            </div>
          </div>

          {/* Interactive Dotted Drag Zone */}
          <div className="pt-6 border-t border-border">
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground block">Product Media Attachment</label>
              <div className="mb-6 flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-border p-12 text-center hover:border-accent transition-colors relative group bg-secondary/5 min-h-[180px]">
                {imageFile ? (
                  <div className="space-y-2">
                    <CheckCircle className="h-10 w-10 text-accent mx-auto animate-bounce" />
                    <p className="font-bold text-accent">{imageFile.name}</p>
                    <p className="text-xs text-muted-foreground">Size: {(imageFile.size / (1024 * 1024)).toFixed(2)} MB</p>
                    <button 
                      type="button" 
                      onClick={() => setImageFile(null)} 
                      className="text-xs text-red-500 font-bold hover:underline mt-2 block"
                    >
                      Change file selection
                    </button>
                  </div>
                ) : (
                  <label htmlFor="product-image-file" className="cursor-pointer space-y-2 flex flex-col items-center">
                    <Upload className="h-10 w-10 mb-2 text-muted-foreground group-hover:scale-115 group-hover:text-accent transition-all duration-300" />
                    <span className="font-bold block text-sm">Select Primary Product Image</span>
                    <span className="text-xs text-muted-foreground mt-1 block">PNG, JPG, or WEBP formats supported. Browse <b className="text-accent">Local Files</b></span>
                  </label>
                )}
                
                <input 
                  type="file" 
                  accept="image/*" 
                  onChange={handleFileChange}
                  className="hidden" 
                  id="product-image-file" 
                />
              </div>
            </div>
          </div>

          {/* Status Hud Upload Progress */}
          {loading && uploadStatus && (
            <div className="p-4 rounded-xl bg-accent/10 border border-accent/25 text-accent font-bold text-xs text-center animate-pulse uppercase tracking-wider">
              {uploadStatus}
            </div>
          )}

          <div className="flex justify-end space-x-4 pt-4 border-t border-border">
            <Button variant="ghost" type="button" onClick={() => router.back()}>Cancel</Button>
            <Button type="submit" isLoading={loading}>Create Product Asset</Button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
