'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Search, ShoppingCart, Grid3X3 } from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import { useShoppingList } from '@/store/shopping-list';
import { useEffect, useState } from 'react';

const navItems = [
  { name: 'Home', href: '/', icon: Home },
  { name: 'Search', href: '/search', icon: Search },
  { name: 'List', href: '/list', icon: ShoppingCart, showBadge: true },
  { name: 'Browse', href: '/category/dinner', icon: Grid3X3 },
];

export function BottomNav() {
  const pathname = usePathname();
  const { items } = useShoppingList();
  const [mounted, setMounted] = useState(false);

  // Prevent hydration mismatch with shopping list count
  useEffect(() => {
    setMounted(true);
  }, []);

  const uncheckedCount = mounted ? items.filter((i) => !i.checked).length : 0;

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-white/95 backdrop-blur-sm border-t border-neutral-200 pb-safe">
      <div className="flex items-center justify-around h-16">
        {navItems.map((item) => {
          // Check if this nav item is active
          const isActive =
            item.href === '/'
              ? pathname === '/'
              : pathname === item.href ||
                pathname.startsWith(item.href.split('/').slice(0, 2).join('/'));

          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                'flex flex-col items-center justify-center flex-1 h-full gap-0.5',
                'transition-colors active:bg-neutral-100',
                isActive ? 'text-primary-600' : 'text-neutral-500'
              )}
            >
              <div className="relative">
                <item.icon
                  className={cn('w-6 h-6', isActive && 'stroke-[2.5]')}
                />
                {item.showBadge && uncheckedCount > 0 && (
                  <span className="absolute -top-1.5 -right-2 min-w-[18px] h-[18px] flex items-center justify-center text-[10px] font-bold text-white bg-primary-500 rounded-full px-1">
                    {uncheckedCount > 99 ? '99+' : uncheckedCount}
                  </span>
                )}
              </div>
              <span
                className={cn('text-[10px] font-medium', isActive && 'font-bold')}
              >
                {item.name}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
