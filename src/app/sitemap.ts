import { MetadataRoute } from 'next';
import { createServerClient } from '@/lib/db/client';

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://simmer-production.up.railway.app';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const supabase = createServerClient();

  // Fetch all recipes
  const { data: recipes } = await supabase
    .from('recipes')
    .select('slug, updated_at')
    .eq('is_deleted', false)
    .order('updated_at', { ascending: false });

  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${BASE_URL}/search`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/list`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.5,
    },
    {
      url: `${BASE_URL}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.3,
    },
  ];

  // Recipe pages
  const recipePages: MetadataRoute.Sitemap = (recipes || []).map((recipe) => ({
    url: `${BASE_URL}/recipe/${recipe.slug}`,
    lastModified: new Date(recipe.updated_at),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  return [...staticPages, ...recipePages];
}
