'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { productService } from '@/api/products';
import { toast } from 'react-hot-toast';
import { ArrowLeft, Upload, Package } from 'lucide-react';

export default function AddProductPage() {
  const router = useRouter();
  const [loading, setLoading] = React.useState(false);
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = {
        ...formData,
        price: parseFloat(formData.price),
        quantity: parseInt(formData.quantity)
      };
      await productService.add(payload);
      toast.success('Product added successfully!');
      router.push('/admin');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to add product');
    } finally {
      setLoading(false);
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
            <h1 className="text-3xl font-bold">Add New Product</h1>
            <p className="text-sm text-muted-foreground">List a new item in your store</p>
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
              label="Initial Stock"
              name="quantity"
              type="number"
              required
              value={formData.quantity}
              onChange={handleChange}
              placeholder="50"
            />
            <Input
              label="Category"
              name="category"
              required
              value={formData.category}
              onChange={handleChange}
              placeholder="e.g. Electronics"
            />
          </div>

          <div className="pt-6 border-t border-border">
            <div className="mb-6 flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-border p-12 text-center hover:border-primary/50 transition-colors cursor-pointer group">
              <Upload className="h-10 w-10 mb-4 text-muted-foreground group-hover:text-primary transition-colors" />
              <p className="font-bold">Upload Images</p>
              <p className="text-xs text-muted-foreground mt-1">PNG, JPG, or WEBP up to 5MB</p>
            </div>
          </div>

          <div className="flex justify-end space-x-4">
            <Button variant="ghost" type="button" onClick={() => router.back()}>Cancel</Button>
            <Button type="submit" isLoading={loading}>Create Product</Button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
