import Link from 'next/link';

export const Footer = () => {
  return (
    <footer className="bg-secondary/30 py-20 border-t border-border">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-4">
          <div className="space-y-6">
            <h3 className="text-3xl font-black tracking-tighter text-primary">AURA</h3>
            <p className="text-base text-muted-foreground leading-relaxed">
              Redefining the digital shopping experience with curated luxury and state-of-the-art precision.
            </p>
          </div>
          <div>
            <h4 className="mb-6 text-xs font-black uppercase tracking-widest text-primary">Collections</h4>
            <ul className="space-y-4 text-sm text-muted-foreground">
              <li><Link href="/products" className="hover:text-accent transition-all duration-300">New Arrivals</Link></li>
              <li><Link href="/categories" className="hover:text-accent transition-all duration-300">Elite Tech</Link></li>
              <li><Link href="/categories" className="hover:text-accent transition-all duration-300">Aura Wear</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="mb-6 text-xs font-black uppercase tracking-widest text-primary">Concierge</h4>
            <ul className="space-y-4 text-sm text-muted-foreground">
              <li><Link href="/faq" className="hover:text-accent transition-all duration-300">Shipping Policy</Link></li>
              <li><Link href="/returns" className="hover:text-accent transition-all duration-300">Global Returns</Link></li>
              <li><Link href="/support" className="hover:text-accent transition-all duration-300">24/7 Support</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="mb-6 text-xs font-black uppercase tracking-widest text-primary">Connect</h4>
            <ul className="space-y-4 text-sm text-muted-foreground">
              <li className="hover:text-accent transition-all duration-300 cursor-pointer">Instagram</li>
              <li className="hover:text-accent transition-all duration-300 cursor-pointer">Twitter</li>
              <li className="hover:text-accent transition-all duration-300 cursor-pointer">LinkedIn</li>
            </ul>
          </div>
        </div>
        <div className="mt-20 pt-8 border-t border-border/50 flex flex-col md:flex-row justify-between items-center text-xs font-bold tracking-widest text-muted-foreground uppercase space-y-4 md:space-y-0">
          <div>© {new Date().getFullYear()} AURA GLOBAL LTD.</div>
          <div className="flex space-x-8">
            <Link href="/privacy" className="hover:text-accent transition-colors">Privacy</Link>
            <Link href="/terms" className="hover:text-accent transition-colors">Terms</Link>
          </div>
        </div>
      </div>
    </footer>

  );
};
