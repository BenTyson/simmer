import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Ember Whisk - Recipe Search Without the Bloat',
    short_name: 'Ember Whisk',
    description: 'Find recipes without the life stories. Clean recipes with scaling and shopping lists.',
    start_url: '/',
    display: 'standalone',
    background_color: '#fffdf7',
    theme_color: '#ff6b35',
    orientation: 'portrait-primary',
    categories: ['food', 'lifestyle', 'utilities'],
    icons: [
      {
        src: '/icon-192',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/icon-512',
        sizes: '512x512',
        type: 'image/png',
      },
      {
        src: '/icon-512',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable',
      },
    ],
  };
}
