'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import { GlassCard } from '@/components/ui/GlassCard';
import { ArrowRight, ShoppingBag, Zap, ShieldCheck, Globe, Star } from 'lucide-react';

import { productService } from '@/api/products';
import { Product } from '@/types';
import { ProductCard } from '@/components/product/ProductCard';

export default function Home() {
  const [products, setProducts] = React.useState<Product[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchTrending = async () => {
      try {
        const { data } = await productService.getAll();
        setProducts(Array.isArray(data.data) ? data.data.slice(0, 4) : []);
      } catch (error) {
        console.error('Failed to fetch trending products', error);
      } finally {
        setLoading(false);
      }
    };
    fetchTrending();
  }, []);

  const features = [

    { icon: <Zap className="h-6 w-6" />, title: 'Instant Fulfillment', desc: 'Experience the fastest shipping in the luxury market.' },
    { icon: <ShieldCheck className="h-6 w-6" />, title: 'Secure Vault', desc: 'Encrypted transactions for your peace of mind.' },
    { icon: <Globe className="h-6 w-6" />, title: 'Global Concierge', desc: 'Sourcing authentic pieces from around the world.' },
  ];

  return (
    <div className="flex flex-col relative">
      {/* Morphing Background Elements */}
      <div className="absolute top-0 left-0 w-full h-screen overflow-hidden pointer-events-none -z-10">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 90, 0],
            x: [0, 50, 0],
            y: [0, -50, 0]
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute -top-[10%] -left-[10%] w-[50%] h-[50%] bg-accent/10 blur-[120px] rounded-full"
        />
        <motion.div
          animate={{
            scale: [1.2, 1, 1.2],
            rotate: [0, -90, 0],
            x: [0, -50, 0],
            y: [0, 50, 0]
          }}
          transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
          className="absolute top-[40%] -right-[10%] w-[40%] h-[40%] bg-primary/5 blur-[100px] rounded-full"
        />
      </div>

      {/* Hero Section - Minimal Single Column Pattern */}
      <section className="relative min-h-[85vh] flex flex-col items-center justify-center text-center px-4 pt-20">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1 }}
          className="max-w-4xl space-y-8"
        >
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center space-x-2 px-4 py-2 rounded-full border border-accent/30 bg-accent/5 text-accent text-sm font-bold tracking-widest uppercase"
          >
            <Star className="h-4 w-4 fill-accent" />
            <span>Exclusivity Defined</span>
          </motion.div>

          <h1 className="text-6xl md:text-8xl font-black tracking-tighter leading-tight">
            THE NEW <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-accent to-primary animate-gradient">STANDARD</span>
          </h1>

          <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Curated collections for the modern connoisseur. Discover high-end fashion
            and precision electronics designed to elevate your daily life.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6 pt-4">
            <Link href="/products">
              <Button size="lg" variant="cta" className="group">
                Enter Collection <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
            <Link href="/categories">
              <Button size="lg" variant="outline">
                View Curations
              </Button>
            </Link>
          </div>
        </motion.div>

        {/* Hero Image / Element */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 1 }}
          className="mt-20 w-full max-w-6xl aspect-[21/9] relative rounded-3xl overflow-hidden shadow-2xl border border-white/10"
        >
          <Image
            src="/hero.jpg"
            alt="Premium Collection"
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 100vw, 100vw"
            className="object-cover transition-transform duration-1000 hover:scale-105"
            priority
          />

          <div className="absolute inset-0  from-background via-transparent to-transparent" />
        </motion.div>
      </section>

      {/* Features Section - Liquid Glass Cards */}
      <section className="py-32 relative">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
              >
                <GlassCard className="h-full flex flex-col items-center text-center group">
                  <div className="mb-6 rounded-2xl gold-gradient p-5 text-white shadow-lg shadow-accent/20 transition-transform group-hover:rotate-12">
                    {feature.icon}
                  </div>
                  <h3 className="mb-3 text-2xl font-bold tracking-tight">{feature.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{feature.desc}</p>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Trending Products - Live Data */}
      <section className="py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-16 flex items-end justify-between">
            <div>
              <h2 className="text-4xl md:text-5xl font-black tracking-tighter mb-4 uppercase">Trending Now</h2>
              <div className="h-1.5 w-24 gold-gradient rounded-full" />
            </div>
            <Link href="/products" className="text-sm font-black tracking-widest uppercase text-accent hover:underline group">
              Explore All <ArrowRight className="inline h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="aspect-[3/4] w-full animate-pulse rounded-3xl bg-secondary/50" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Featured Categories - Visual Excellence */}

      <section className="py-32 bg-secondary/20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-16 text-center">
            <h2 className="text-4xl md:text-5xl font-black tracking-tighter mb-4">CURATED COLLECTIONS</h2>
            <div className="h-1.5 w-24 gold-gradient mx-auto rounded-full" />
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
            {[
              { name: 'Aura Wear', img: '/fashion.jpg' },
              { name: 'Elite Tech', img: '/electronics.jpg' },
              { name: 'Sanctuary', img: '/home.jpg' },
              { name: 'Essentials', img: '/acc.jpg' }
            ].map((cat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -10 }}
                className="relative aspect-[3/4] overflow-hidden rounded-3xl cursor-pointer group shadow-xl"
              >
                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors z-10" />
                <div className="absolute inset-0 flex flex-col items-center justify-end p-8 z-20">
                  <h3 className="text-xl font-black text-white tracking-widest uppercase mb-4 translate-y-4 group-hover:translate-y-0 transition-transform">{cat.name}</h3>
                  <div className="h-1 w-0 group-hover:w-full bg-accent transition-all duration-300 rounded-full" />
                </div>
                <div className="h-full w-full bg-neutral-900 overflow-hidden">
                  <div className="w-full h-full bg-accent/5 animate-pulse" />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 overflow-hidden relative">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 text-center">
          <GlassCard hoverEffect={false} className="py-20 px-8 md:px-20 border-accent/20 bg-accent/[0.02]">
            <h2 className="text-4xl md:text-6xl font-black tracking-tighter mb-8 leading-tight">
              JOIN THE <span className="text-accent">INNER CIRCLE</span>
            </h2>
            <p className="text-xl text-muted-foreground mb-12 max-w-2xl mx-auto">
              Get exclusive access to limited drops and members-only events.
              Elevate your status with Aura.
            </p>
            <div className="flex flex-col sm:flex-row justify-center items-stretch sm:items-center space-y-4 sm:space-y-0 sm:space-x-4">
              <input
                type="email"
                placeholder="Enter your email"
                className="px-6 py-4 rounded-xl bg-background border border-border focus:border-accent outline-none transition-colors min-w-[300px]"
              />
              <Button variant="cta" size="lg">Subscribe</Button>
            </div>
          </GlassCard>
        </div>
      </section>
    </div>
  );
}

