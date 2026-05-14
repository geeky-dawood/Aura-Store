'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { authService } from '@/api/auth';
import { toast } from 'react-hot-toast';

export default function RegisterPage() {
  const [formData, setFormData] = React.useState({
    name: '',
    email: '',
    password: '',
    dob: '',
    role: 'USER',
    preferred_language: 'EN',
  });
  const [isLoading, setIsLoading] = React.useState(false);
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await authService.signup(formData);
      toast.success('Registration successful! Please login.');
      router.push('/auth/login');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to register');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-[80vh] items-center justify-center px-4 py-12">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md space-y-8 premium-card p-10"
      >
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight">Create Account</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Join VOGUE for a premium experience
          </p>
        </div>
        <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
          <Input
            label="Full Name"
            name="name"
            required
            value={formData.name}
            onChange={handleChange}
            placeholder="John Doe"
          />
          <Input
            label="Email Address"
            name="email"
            type="email"
            required
            value={formData.email}
            onChange={handleChange}
            placeholder="john@example.com"
          />
          <Input
            label="Password"
            name="password"
            type="password"
            required
            value={formData.password}
            onChange={handleChange}
            placeholder="••••••••"
          />
          <Input
            label="Date of Birth"
            name="dob"
            type="date"
            required
            value={formData.dob}
            onChange={handleChange}
          />
          
          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground">Preferred Language</label>
            <select
              name="preferred_language"
              className="flex h-11 w-full rounded-xl border border-border bg-background/50 px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              value={formData.preferred_language}
              onChange={handleChange}
            >
              <option value="EN">English</option>
              <option value="ES">Spanish</option>
              <option value="FR">French</option>
            </select>
          </div>

          <Button type="submit" className="w-full mt-6" isLoading={isLoading}>
            Sign Up
          </Button>
        </form>

        <p className="text-center text-sm text-muted-foreground">
          Already have an account?{' '}
          <Link href="/auth/login" className="font-medium text-primary hover:underline">
            Login here
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
