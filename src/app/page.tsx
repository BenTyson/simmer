import Link from 'next/link';
import { ChefHat, Clock, Scale, ShoppingCart, ArrowRight } from 'lucide-react';
import { Container } from '@/components/layout/Container';
import { SearchBar } from '@/components/search/SearchBar';
import { Button } from '@/components/ui/Button';

const popularSearches = [
  'Chicken Dinner',
  'Quick Pasta',
  '30 Minute Meals',
  'Healthy Breakfast',
  'Easy Desserts',
  'Vegetarian',
];

const features = [
  {
    icon: ChefHat,
    title: 'Just the Recipe',
    description: 'No life stories. No scrolling past ads. Just the ingredients and instructions you need.',
  },
  {
    icon: Scale,
    title: 'Easy Scaling',
    description: 'Cooking for 2 or 20? Adjust serving sizes with a click and watch ingredients update.',
  },
  {
    icon: Clock,
    title: 'Unit Conversion',
    description: 'Switch between metric and imperial units instantly. No more Googling conversions.',
  },
  {
    icon: ShoppingCart,
    title: 'Shopping Lists',
    description: 'Add ingredients to your list and send them straight to Instacart or your grocery app.',
  },
];

const categories = [
  { name: 'Breakfast', href: '/category/breakfast', color: 'bg-amber-100 text-amber-700 hover:bg-amber-200' },
  { name: 'Lunch', href: '/category/lunch', color: 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200' },
  { name: 'Dinner', href: '/category/dinner', color: 'bg-red-100 text-red-700 hover:bg-red-200' },
  { name: 'Desserts', href: '/category/dessert', color: 'bg-purple-100 text-purple-700 hover:bg-purple-200' },
  { name: 'Appetizers', href: '/category/appetizer', color: 'bg-pink-100 text-pink-700 hover:bg-pink-200' },
  { name: 'Soups', href: '/category/soup', color: 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200' },
];

export default function HomePage() {
  return (
    <>
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-20 left-10 w-72 h-72 bg-primary-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse" />
          <div className="absolute top-40 right-10 w-72 h-72 bg-secondary-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse delay-1000" />
          <div className="absolute bottom-20 left-1/3 w-72 h-72 bg-accent-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse delay-500" />
        </div>

        <Container>
          <div className="py-20 md:py-32 text-center">
            {/* Tagline badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-100 text-primary-700 text-sm font-medium mb-6 animate-fade-in">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary-500"></span>
              </span>
              Recipe search, simplified
            </div>

            {/* Main heading */}
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-display font-bold text-neutral-900 mb-6 animate-slide-up">
              Find recipes
              <br />
              <span className="text-primary-500">without the bloat</span>
            </h1>

            {/* Subheading */}
            <p className="text-lg md:text-xl text-neutral-600 max-w-2xl mx-auto mb-10 animate-slide-up">
              Skip the life stories and endless scrolling. Get straight to cooking with clean recipes,
              easy scaling, and built-in shopping lists.
            </p>

            {/* Search bar */}
            <div className="animate-scale-in">
              <SearchBar
                variant="hero"
                placeholder="What do you want to cook today?"
                autoFocus
              />
            </div>

            {/* Popular searches */}
            <div className="mt-6 flex flex-wrap justify-center gap-2 animate-fade-in">
              <span className="text-sm text-neutral-500">Popular:</span>
              {popularSearches.map((search) => (
                <Link
                  key={search}
                  href={`/search?q=${encodeURIComponent(search)}`}
                  className="text-sm text-primary-600 hover:text-primary-700 hover:underline"
                >
                  {search}
                </Link>
              ))}
            </div>
          </div>
        </Container>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <Container>
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-display font-bold text-neutral-900 mb-4">
              Cooking made simple
            </h2>
            <p className="text-lg text-neutral-600 max-w-2xl mx-auto">
              We pull recipes from across the web and add the features you actually need.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div
                key={feature.title}
                className="group p-6 rounded-2xl bg-neutral-50 hover:bg-white hover:shadow-xl hover:shadow-neutral-200/50 transition-all duration-300 hover:-translate-y-1"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="w-12 h-12 rounded-xl bg-primary-100 text-primary-600 flex items-center justify-center mb-4 group-hover:bg-primary-500 group-hover:text-white transition-colors">
                  <feature.icon className="w-6 h-6" />
                </div>
                <h3 className="font-display font-bold text-lg text-neutral-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-neutral-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* Categories Section */}
      <section className="py-20">
        <Container>
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl md:text-3xl font-display font-bold text-neutral-900">
              Browse by category
            </h2>
            <Link href="/search" className="hidden sm:block">
              <Button variant="ghost" size="sm">
                View all
                <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {categories.map((category) => (
              <Link
                key={category.name}
                href={category.href}
                className={`${category.color} rounded-2xl p-6 text-center font-semibold transition-all duration-200 hover:-translate-y-1 hover:shadow-lg`}
              >
                {category.name}
              </Link>
            ))}
          </div>

          <div className="sm:hidden mt-6 text-center">
            <Link href="/search">
              <Button variant="outline">
                View all categories
                <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </Link>
          </div>
        </Container>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-primary-500 to-primary-600">
        <Container>
          <div className="text-center">
            <h2 className="text-3xl md:text-4xl font-display font-bold text-white mb-4">
              Ready to start cooking?
            </h2>
            <p className="text-lg text-primary-100 max-w-2xl mx-auto mb-8">
              Search through thousands of recipes, scale them to your needs, and create your shopping list in seconds.
            </p>
            <Link href="/search">
              <Button
                variant="secondary"
                size="lg"
                className="bg-white text-primary-600 hover:bg-neutral-100"
              >
                Search recipes
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
          </div>
        </Container>
      </section>

      {/* Attribution note */}
      <section className="py-8 bg-neutral-100">
        <Container>
          <p className="text-center text-sm text-neutral-500">
            All recipes link to their original sources. We believe in giving credit where it&apos;s due.
            <br />
            <Link href="/about" className="text-primary-600 hover:underline">
              Learn more about how Simmer works
            </Link>
          </p>
        </Container>
      </section>
    </>
  );
}
