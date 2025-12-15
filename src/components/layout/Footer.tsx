import Link from 'next/link';
import { Container } from './Container';

const footerLinks = {
  browse: [
    { name: 'All Recipes', href: '/search' },
    { name: 'Breakfast', href: '/category/breakfast' },
    { name: 'Dinner', href: '/category/dinner' },
    { name: 'Desserts', href: '/category/dessert' },
  ],
  cuisines: [
    { name: 'Italian', href: '/cuisine/italian' },
    { name: 'Mexican', href: '/cuisine/mexican' },
    { name: 'Asian', href: '/cuisine/asian' },
    { name: 'Mediterranean', href: '/cuisine/mediterranean' },
  ],
  diets: [
    { name: 'Vegetarian', href: '/diet/vegetarian' },
    { name: 'Vegan', href: '/diet/vegan' },
    { name: 'Gluten-Free', href: '/diet/gluten-free' },
    { name: 'Keto', href: '/diet/keto' },
  ],
  about: [
    { name: 'About Simmer', href: '/about' },
    { name: 'How It Works', href: '/about#how-it-works' },
    { name: 'Privacy Policy', href: '/about#privacy' },
    { name: 'Terms of Use', href: '/about#terms' },
  ],
};

export function Footer() {
  return (
    <footer className="bg-neutral-50 border-t border-neutral-200 mt-auto">
      <Container>
        <div className="py-12">
          {/* Main footer content */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 lg:gap-12">
            {/* Browse */}
            <div>
              <h3 className="font-display font-bold text-neutral-900 mb-4">Browse</h3>
              <ul className="space-y-3">
                {footerLinks.browse.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-neutral-600 hover:text-primary-600 transition-colors"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Cuisines */}
            <div>
              <h3 className="font-display font-bold text-neutral-900 mb-4">Cuisines</h3>
              <ul className="space-y-3">
                {footerLinks.cuisines.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-neutral-600 hover:text-primary-600 transition-colors"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Diets */}
            <div>
              <h3 className="font-display font-bold text-neutral-900 mb-4">Diets</h3>
              <ul className="space-y-3">
                {footerLinks.diets.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-neutral-600 hover:text-primary-600 transition-colors"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* About */}
            <div>
              <h3 className="font-display font-bold text-neutral-900 mb-4">About</h3>
              <ul className="space-y-3">
                {footerLinks.about.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-neutral-600 hover:text-primary-600 transition-colors"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Bottom section */}
          <div className="mt-12 pt-8 border-t border-neutral-200">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              {/* Logo and tagline */}
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center">
                  <span className="text-white font-bold text-sm">S</span>
                </div>
                <div>
                  <span className="font-display font-bold text-neutral-900">Simmer</span>
                  <span className="text-neutral-400 mx-2">·</span>
                  <span className="text-neutral-500 text-sm">Let it simmer</span>
                </div>
              </div>

              {/* Copyright */}
              <p className="text-sm text-neutral-500">
                &copy; {new Date().getFullYear()} Simmer. All recipes link to their original sources.
              </p>
            </div>
          </div>
        </div>
      </Container>
    </footer>
  );
}
