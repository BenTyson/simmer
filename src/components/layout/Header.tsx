'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Search, ShoppingCart } from 'lucide-react';
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

  // Don't show compact search on homepage (has hero search)
  const isHomepage = pathname === '/';

  return (
    <header className="sticky top-0 z-50 bg-[#fffdf7]/95 backdrop-blur-sm border-b border-neutral-200">
      <Container>
        <nav className="flex items-center justify-between py-3 md:py-4">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-9 h-9 md:w-10 md:h-10 rounded-xl bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center shadow-md group-hover:shadow-lg group-hover:shadow-primary-500/25 transition-shadow">
              <span className="text-white font-bold text-lg md:text-xl">S</span>
            </div>
            <span className="font-display text-xl md:text-2xl font-bold text-neutral-900">
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
          <div className="flex items-center gap-2">
            {/* Mobile search icon (not on homepage) */}
            {!isHomepage && (
              <Link
                href="/search"
                className="md:hidden p-2 rounded-full text-neutral-600 hover:bg-neutral-100 active:bg-neutral-200 transition-colors"
              >
                <Search className="w-5 h-5" />
                <span className="sr-only">Search</span>
              </Link>
            )}

            {/* Desktop search bar (not on homepage) */}
            {!isHomepage && (
              <Link
                href="/search"
                className="hidden md:flex items-center gap-2 px-4 py-2 rounded-full bg-neutral-100 text-neutral-500 hover:bg-neutral-200 transition-colors"
              >
                <Search className="w-4 h-4" />
                <span className="text-sm">Search recipes...</span>
              </Link>
            )}

            {/* Shopping List - desktop only (mobile has bottom nav) */}
            <Link href="/list" className="hidden md:block">
              <Button variant="ghost" size="sm" className="relative">
                <ShoppingCart className="w-5 h-5" />
                <span className="sr-only">Shopping List</span>
              </Button>
            </Link>
          </div>
        </nav>
      </Container>
    </header>
  );
}
