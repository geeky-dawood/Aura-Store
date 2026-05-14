'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { XCircle, RefreshCcw, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export default function PaymentFailurePage() {
  return (
    <div className="flex min-h-[80vh] flex-col items-center justify-center px-4 text-center">
      <motion.div
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="mb-8 rounded-full bg-red-100 p-8 text-red-600"
      >
        <XCircle className="h-20 w-20" />
      </motion.div>
      
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="max-w-md space-y-4"
      >
        <h1 className="text-4xl font-extrabold tracking-tight">Payment Failed</h1>
        <p className="text-lg text-muted-foreground">
          We couldn&apos;t process your payment. Please check your card details and try again.
        </p>
        
        <div className="rounded-xl bg-orange-50 border border-orange-200 p-4 flex items-start space-x-3 text-left">
          <AlertTriangle className="h-5 w-5 text-orange-600 shrink-0 mt-0.5" />
          <p className="text-sm text-orange-800 font-medium">
            Common reasons: Insufficient funds, incorrect CVV, or card expired.
          </p>
        </div>
        
        <div className="pt-8 flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 justify-center">
          <Link href="/checkout">
            <Button className="w-full sm:w-auto">
              <RefreshCcw className="mr-2 h-4 w-4" /> Try Again
            </Button>
          </Link>
          <Link href="/support">
            <Button variant="ghost" className="w-full sm:w-auto">
              Contact Support
            </Button>
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
