import { cn } from '@/lib/utils/cn';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md';
}

export function Badge({
  className,
  variant = 'default',
  size = 'sm',
  children,
  ...props
}: BadgeProps) {
  return (
    <span
      className={cn(
        // Base styles
        'inline-flex items-center font-medium rounded-full',
        'transition-colors duration-150',

        // Variants
        {
          'bg-neutral-100 text-neutral-700': variant === 'default',
          'bg-primary-100 text-primary-700': variant === 'primary',
          'bg-secondary-100 text-secondary-700': variant === 'secondary',
          'border border-neutral-300 bg-transparent text-neutral-600': variant === 'outline',
        },

        // Sizes
        {
          'px-2.5 py-0.5 text-xs': size === 'sm',
          'px-3 py-1 text-sm': size === 'md',
        },

        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}

// Predefined category badges with colors
export function CategoryBadge({ category }: { category: string }) {
  const categoryColors: Record<string, string> = {
    breakfast: 'bg-amber-100 text-amber-700',
    lunch: 'bg-emerald-100 text-emerald-700',
    dinner: 'bg-red-100 text-red-700',
    dessert: 'bg-purple-100 text-purple-700',
    snack: 'bg-orange-100 text-orange-700',
    appetizer: 'bg-pink-100 text-pink-700',
    'side dish': 'bg-teal-100 text-teal-700',
    salad: 'bg-green-100 text-green-700',
    soup: 'bg-yellow-100 text-yellow-700',
    beverage: 'bg-blue-100 text-blue-700',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center px-2.5 py-0.5 text-xs font-medium rounded-full',
        categoryColors[category.toLowerCase()] || 'bg-neutral-100 text-neutral-700'
      )}
    >
      {category}
    </span>
  );
}

// Diet badges
export function DietBadge({ diet }: { diet: string }) {
  const dietColors: Record<string, string> = {
    vegetarian: 'bg-green-100 text-green-700',
    vegan: 'bg-green-100 text-green-700',
    'gluten-free': 'bg-amber-100 text-amber-700',
    'dairy-free': 'bg-blue-100 text-blue-700',
    keto: 'bg-purple-100 text-purple-700',
    paleo: 'bg-orange-100 text-orange-700',
    'low-carb': 'bg-cyan-100 text-cyan-700',
    whole30: 'bg-rose-100 text-rose-700',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center px-2.5 py-0.5 text-xs font-medium rounded-full',
        dietColors[diet.toLowerCase()] || 'bg-neutral-100 text-neutral-700'
      )}
    >
      {diet}
    </span>
  );
}
