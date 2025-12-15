'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { Menu, X, Search, ShoppingCart } from 'lucide-react';
import { Container } from './Container';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils/cn';

const navigation = [
  { name: 'Home', href: '/' },
  { name: 'Categories', href: '/category/dinner' },
  { name: 'Cuisines', href: '/cuisine/italian' },
  { name: 'Diets', href: '/diet/vegetarian' },
];

export function Header() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Don't show compact search on homepage (has hero search)
  const isHomepage = pathname === '/';

  return (
    <header className="sticky top-0 z-50 bg-[#fffdf7]/95 backdrop-blur-sm border-b border-neutral-200">
      <Container>
        <nav className="flex items-center justify-between py-4">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center shadow-md group-hover:shadow-lg group-hover:shadow-primary-500/25 transition-shadow">
              <span className="text-white font-bold text-xl">S</span>
            </div>
            <span className="font-display text-2xl font-bold text-neutral-900 hidden sm:block">
              Simmer
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  'px-4 py-2 rounded-full text-sm font-medium transition-colors',
                  pathname === item.href || pathname.startsWith(item.href.split('/').slice(0, 2).join('/'))
                    ? 'bg-primary-100 text-primary-700'
                    : 'text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900'
                )}
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* Right side actions */}
          <div className="flex items-center gap-3">
            {/* Compact search (not on homepage) */}
            {!isHomepage && (
              <Link
                href="/search"
                className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-full bg-neutral-100 text-neutral-500 hover:bg-neutral-200 transition-colors"
              >
                <Search className="w-4 h-4" />
                <span className="text-sm">Search recipes...</span>
              </Link>
            )}

            {/* Shopping List */}
            <Link href="/list">
              <Button variant="ghost" size="sm" className="relative">
                <ShoppingCart className="w-5 h-5" />
                <span className="sr-only">Shopping List</span>
              </Button>
            </Link>

            {/* Mobile menu button */}
            <button
              type="button"
              className="md:hidden p-2 rounded-full hover:bg-neutral-100 transition-colors"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6 text-neutral-600" />
              ) : (
                <Menu className="w-6 h-6 text-neutral-600" />
              )}
              <span className="sr-only">Toggle menu</span>
            </button>
          </div>
        </nav>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden pb-4 animate-slide-up">
            <div className="flex flex-col gap-1">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    'px-4 py-3 rounded-xl text-base font-medium transition-colors',
                    pathname === item.href
                      ? 'bg-primary-100 text-primary-700'
                      : 'text-neutral-600 hover:bg-neutral-100'
                  )}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              {/* Mobile search */}
              {!isHomepage && (
                <Link
                  href="/search"
                  className="flex items-center gap-2 px-4 py-3 rounded-xl text-base font-medium text-neutral-600 hover:bg-neutral-100 transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Search className="w-5 h-5" />
                  Search recipes
                </Link>
              )}
            </div>
          </div>
        )}
      </Container>
    </header>
  );
}
