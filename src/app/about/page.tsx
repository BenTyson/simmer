import Link from 'next/link';
import { ExternalLink, Scale, ShoppingCart, Clock, Heart } from 'lucide-react';
import { Container } from '@/components/layout/Container';
import { Button } from '@/components/ui/Button';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About Simmer',
  description:
    'Learn how Simmer works, our commitment to recipe attribution, and how we make cooking easier.',
};

export default function AboutPage() {
  return (
    <div className="py-12 md:py-20">
      <Container size="md">
        {/* Hero */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-display font-bold text-neutral-900 mb-6">
            About Simmer
          </h1>
          <p className="text-xl text-neutral-600 max-w-2xl mx-auto">
            We built Simmer because we were tired of scrolling past life stories just to find a
            recipe. Our mission is simple: get you cooking faster.
          </p>
        </div>

        {/* How it works */}
        <section className="mb-16" id="how-it-works">
          <h2 className="text-2xl font-display font-bold text-neutral-900 mb-6">How It Works</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-6 rounded-2xl bg-neutral-50">
              <div className="w-12 h-12 rounded-xl bg-primary-100 text-primary-600 flex items-center justify-center mb-4">
                <Scale className="w-6 h-6" />
              </div>
              <h3 className="font-display font-bold text-lg mb-2">We Aggregate</h3>
              <p className="text-neutral-600">
                We collect recipes from across the web using publicly available structured data
                (schema.org). This is the same data that Google uses to show recipes in search
                results.
              </p>
            </div>
            <div className="p-6 rounded-2xl bg-neutral-50">
              <div className="w-12 h-12 rounded-xl bg-secondary-100 text-secondary-600 flex items-center justify-center mb-4">
                <Clock className="w-6 h-6" />
              </div>
              <h3 className="font-display font-bold text-lg mb-2">We Clean Up</h3>
              <p className="text-neutral-600">
                We strip away the fluff and present just the recipe: ingredients, instructions,
                and the info you need. No ads, no popups, no endless scrolling.
              </p>
            </div>
            <div className="p-6 rounded-2xl bg-neutral-50">
              <div className="w-12 h-12 rounded-xl bg-accent-100 text-accent-600 flex items-center justify-center mb-4">
                <ShoppingCart className="w-6 h-6" />
              </div>
              <h3 className="font-display font-bold text-lg mb-2">We Add Value</h3>
              <p className="text-neutral-600">
                Scale ingredients with a click, convert between metric and imperial, and build
                shopping lists you can send straight to your grocery app.
              </p>
            </div>
          </div>
        </section>

        {/* Attribution */}
        <section className="mb-16">
          <h2 className="text-2xl font-display font-bold text-neutral-900 mb-6">
            Recipe Attribution
          </h2>
          <div className="p-6 rounded-2xl bg-primary-50 border border-primary-100">
            <div className="flex items-start gap-4">
              <Heart className="w-6 h-6 text-primary-500 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-display font-bold text-lg text-primary-900 mb-2">
                  We Credit Every Recipe
                </h3>
                <p className="text-primary-800 mb-4">
                  Every recipe on Simmer links directly to its original source. We believe the
                  people who create recipes deserve credit for their work. When you find a recipe
                  you love, click through to show the creator some appreciation.
                </p>
                <p className="text-primary-700 text-sm">
                  We never copy photos (they&apos;re copyrighted) or the personal stories that
                  bloggers write. We only use the structured recipe data that&apos;s publicly
                  published for search engines to index.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Legal */}
        <section className="mb-16" id="legal">
          <h2 className="text-2xl font-display font-bold text-neutral-900 mb-6">
            Legal Information
          </h2>
          <div className="prose prose-neutral max-w-none">
            <h3 id="privacy">Privacy Policy</h3>
            <p>
              Simmer respects your privacy. We use privacy-focused analytics (Plausible) that
              don&apos;t track you across the web. Your shopping lists are stored locally in your
              browser - we never see them.
            </p>
            <p>We may use cookies for:</p>
            <ul>
              <li>Remembering your unit preferences (metric/imperial)</li>
              <li>Basic analytics to understand how people use Simmer</li>
            </ul>

            <h3 id="terms">Terms of Use</h3>
            <p>
              Simmer is provided as-is. While we do our best to ensure recipe accuracy, we
              aggregate data from third-party sources and cannot guarantee its correctness. Always
              use your judgment when cooking, especially regarding food safety.
            </p>

            <h3>Affiliate Disclosure</h3>
            <p>
              Simmer may earn a commission when you purchase groceries through our affiliate
              links (Instacart, Amazon). This helps us keep the service free. Affiliate
              relationships never affect which recipes we show or how we present them.
            </p>
          </div>
        </section>

        {/* Contact */}
        <section className="mb-16">
          <h2 className="text-2xl font-display font-bold text-neutral-900 mb-6">Contact</h2>
          <p className="text-neutral-600 mb-4">
            Have questions, feedback, or want to report an issue with a recipe? We&apos;d love to
            hear from you.
          </p>
          <p className="text-neutral-600">
            Email us at:{' '}
            <a
              href="mailto:hello@simmer.recipes"
              className="text-primary-600 hover:text-primary-700"
            >
              hello@simmer.recipes
            </a>
          </p>
        </section>

        {/* CTA */}
        <div className="text-center">
          <Link href="/search">
            <Button size="lg">Start searching recipes</Button>
          </Link>
        </div>
      </Container>
    </div>
  );
}
