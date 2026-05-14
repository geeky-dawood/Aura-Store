'use client';

import React from 'react';
import Link from 'next/link';
import { ShoppingCart, User, Search, Menu, X, LogOut } from 'lucide-react';
import { useAuthStore } from '@/store/useAuthStore';
import { useCartStore } from '@/store/useCartStore';
import { Button } from '@/components/ui/Button';
import { motion, AnimatePresence } from 'framer-motion';

export const Navbar = () => {
  const [isOpen, setIsOpen] = React.useState(false);
  const [mounted, setMounted] = React.useState(false);
  const { user, logout } = useAuthStore();
  const cartItemsCount = useCartStore((state) => state.totalItems());

  React.useEffect(() => {
    setMounted(true);
  }, []);


  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Products', href: '/products' },
    { name: 'Categories', href: '/categories' },
  ];

  return (
    <nav className="fixed top-4 left-4 right-4 z-50 transition-all duration-300">
      <div className="mx-auto max-w-7xl liquid-glass px-4 sm:px-6 lg:px-8 shadow-2xl border-white/10">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <Link href="/" className="text-3xl font-black tracking-tighter text-primary">
              AURA
            </Link>
          </div>

          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-10">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className="text-sm font-bold tracking-widest uppercase transition-all duration-300 hover:text-accent relative group"
                >
                  {link.name}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-accent transition-all duration-300 group-hover:w-full" />
                </Link>
              ))}
            </div>
          </div>

          <div className="hidden md:block">
            <div className="ml-4 flex items-center space-x-2">
              <Button variant="ghost" size="icon" className="hover:text-accent">
                <Search className="h-5 w-5" />
              </Button>
              
              <Link href="/cart">
                <Button variant="ghost" size="icon" className="relative hover:text-accent">
                  <ShoppingCart className="h-5 w-5" />
                  {mounted && cartItemsCount > 0 && (
                    <span suppressHydrationWarning className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full gold-gradient text-[10px] text-white font-bold">
                      {cartItemsCount}
                    </span>
                  )}

                </Button>

              </Link>

              {user ? (
                <div className="flex items-center space-x-2">
                  <Link href="/profile">
                    <Button variant="ghost" size="icon" className="hover:text-accent">
                      <User className="h-5 w-5" />
                    </Button>
                  </Link>
                  <Button variant="ghost" size="icon" onClick={logout}>
                    <LogOut className="h-5 w-5 text-red-500" />
                  </Button>
                </div>
              ) : (
                <Link href="/auth/login">
                  <Button variant="cta" size="sm" className="px-6 rounded-full font-bold">Login</Button>
                </Link>
              )}
            </div>
          </div>


          <div className="flex md:hidden">
            <Button variant="ghost" size="icon" onClick={() => setIsOpen(!isOpen)}>
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden glass border-t border-border"
          >
            <div className="space-y-1 px-2 pb-3 pt-2 sm:px-3">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className="block rounded-md px-3 py-2 text-base font-medium hover:bg-secondary"
                  onClick={() => setIsOpen(false)}
                >
                  {link.name}
                </Link>
              ))}
              <Link
                href="/cart"
                className="block rounded-md px-3 py-2 text-base font-medium hover:bg-secondary"
                onClick={() => setIsOpen(false)}
              >
                Cart ({cartItemsCount})
              </Link>
              {!user && (
                <Link
                  href="/auth/login"
                  className="block rounded-md px-3 py-2 text-base font-medium text-primary"
                  onClick={() => setIsOpen(false)}
                >
                  Login
                </Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};
