'use client';

import React from 'react';
import { ProductCard } from '@/components/product/ProductCard';
import { productService } from '@/api/products';
import { Product } from '@/types';
import { Search, SlidersHorizontal } from 'lucide-react';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';

export default function ProductsPage() {
  const [products, setProducts] = React.useState<Product[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [search, setSearch] = React.useState('');

  React.useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data } = await productService.getAll();
        // The API returns { data: Product[], meta: ... }
        setProducts(Array.isArray(data.data) ? data.data : []);
      } catch (error) {
        console.error('Failed to fetch products', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const filteredProducts = products.filter(p => 
    p.title.toLowerCase().includes(search.toLowerCase()) || 
    p.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="flex flex-col space-y-8">
        {/* Header & Filter */}
        <div className="flex flex-col justify-between space-y-4 md:flex-row md:items-center md:space-y-0">
          <div>
            <h1 className="text-4xl font-extrabold tracking-tight">Our Collection</h1>
            <p className="mt-2 text-muted-foreground">Browse our range of high-quality products</p>
          </div>
          <div className="flex space-x-4">
            <div className="relative w-full md:w-64">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                className="flex h-11 w-full rounded-xl border border-border bg-background/50 pl-10 pr-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                placeholder="Search products..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <Button variant="outline">
              <SlidersHorizontal className="mr-2 h-4 w-4" />
              Filters
            </Button>
          </div>
        </div>

        {/* Grid */}
        {loading ? (
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="aspect-square w-full animate-pulse rounded-2xl bg-secondary" />
            ))}
          </div>
        ) : filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="flex h-64 flex-col items-center justify-center rounded-2xl border-2 border-dashed border-border p-12 text-center">
            <h3 className="text-xl font-bold">No products found</h3>
            <p className="mt-2 text-muted-foreground">Try adjusting your search or filters.</p>
          </div>
        )}
      </div>
    </div>
  );
}
