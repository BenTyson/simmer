import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ExternalLink, Clock, Users, ChefHat } from 'lucide-react';
import { Container } from '@/components/layout/Container';
import { Badge, CategoryBadge, DietBadge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { getRecipeBySlug } from '@/lib/db/recipes';
import { RecipeControls } from '@/components/recipe/RecipeControls';
import { IngredientList } from '@/components/recipe/IngredientList';
import { Instructions } from '@/components/recipe/Instructions';
import { SourceAttribution } from '@/components/recipe/SourceAttribution';
import { RecipeSchema } from '@/components/recipe/RecipeSchema';
import type { Metadata } from 'next';

interface RecipePageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: RecipePageProps): Promise<Metadata> {
  const { slug } = await params;
  const recipe = await getRecipeBySlug(slug);

  if (!recipe) {
    return { title: 'Recipe Not Found' };
  }

  return {
    title: recipe.name,
    description: recipe.description || `Recipe for ${recipe.name} from ${recipe.sourceName || recipe.sourceDomain}`,
    openGraph: {
      title: recipe.name,
      description: recipe.description || undefined,
      type: 'article',
    },
  };
}

export default async function RecipePage({ params }: RecipePageProps) {
  const { slug } = await params;
  const recipe = await getRecipeBySlug(slug);

  if (!recipe) {
    // Show demo recipe for now since we don't have data yet
    return <DemoRecipe />;
  }

  return (
    <>
      <RecipeSchema recipe={recipe} />
      <div className="py-8 md:py-12">
        <Container size="md">
          {/* Header */}
          <header className="mb-8">
            {/* Categories */}
            {recipe.category && recipe.category.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-4">
                {recipe.category.map((cat) => (
                  <Link key={cat} href={`/category/${cat.toLowerCase()}`}>
                    <CategoryBadge category={cat} />
                  </Link>
                ))}
              </div>
            )}

            {/* Title */}
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold text-neutral-900 mb-4">
              {recipe.name}
            </h1>

            {/* Description */}
            {recipe.description && (
              <p className="text-lg text-neutral-600 mb-6">{recipe.description}</p>
            )}

            {/* Meta info */}
            <div className="flex flex-wrap items-center gap-4 text-neutral-600 mb-6">
              {recipe.prepTime && (
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-neutral-400" />
                  <span>
                    <strong>{recipe.prepTime}</strong> min prep
                  </span>
                </div>
              )}
              {recipe.cookTime && (
                <div className="flex items-center gap-2">
                  <ChefHat className="w-5 h-5 text-neutral-400" />
                  <span>
                    <strong>{recipe.cookTime}</strong> min cook
                  </span>
                </div>
              )}
              {recipe.servings && (
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-neutral-400" />
                  <span>
                    <strong>{recipe.servings}</strong> {recipe.servingsUnit || 'servings'}
                  </span>
                </div>
              )}
            </div>

            {/* Diet tags */}
            {recipe.dietTags && recipe.dietTags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-6">
                {recipe.dietTags.map((tag) => (
                  <Link key={tag} href={`/diet/${tag.toLowerCase()}`}>
                    <DietBadge diet={tag} />
                  </Link>
                ))}
              </div>
            )}

            {/* Source attribution - always visible */}
            <SourceAttribution
              sourceUrl={recipe.sourceUrl}
              sourceName={recipe.sourceName}
              sourceDomain={recipe.sourceDomain}
            />
          </header>

          {/* Recipe Controls */}
          <RecipeControls defaultServings={recipe.servings || 4} />

          {/* Two column layout on desktop */}
          <div className="grid lg:grid-cols-[1fr_2fr] gap-8 lg:gap-12">
            {/* Ingredients */}
            <div>
              <h2 className="text-xl font-display font-bold text-neutral-900 mb-4">Ingredients</h2>
              <IngredientList
                ingredients={recipe.ingredients}
                recipeId={recipe.id}
                recipeName={recipe.name}
              />
            </div>

            {/* Instructions */}
            <div>
              <h2 className="text-xl font-display font-bold text-neutral-900 mb-4">Instructions</h2>
              <Instructions instructions={recipe.instructions} />
            </div>
          </div>

          {/* Nutrition info if available */}
          {recipe.nutrition && (
            <div className="mt-12 p-6 rounded-2xl bg-neutral-50">
              <h2 className="text-xl font-display font-bold text-neutral-900 mb-4">
                Nutrition (per serving)
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {recipe.nutrition.calories && (
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary-600">
                      {recipe.nutrition.calories}
                    </div>
                    <div className="text-sm text-neutral-500">Calories</div>
                  </div>
                )}
                {recipe.nutrition.proteinGrams && (
                  <div className="text-center">
                    <div className="text-2xl font-bold text-secondary-600">
                      {recipe.nutrition.proteinGrams}g
                    </div>
                    <div className="text-sm text-neutral-500">Protein</div>
                  </div>
                )}
                {recipe.nutrition.carbsGrams && (
                  <div className="text-center">
                    <div className="text-2xl font-bold text-accent-600">
                      {recipe.nutrition.carbsGrams}g
                    </div>
                    <div className="text-sm text-neutral-500">Carbs</div>
                  </div>
                )}
                {recipe.nutrition.fatGrams && (
                  <div className="text-center">
                    <div className="text-2xl font-bold text-neutral-600">
                      {recipe.nutrition.fatGrams}g
                    </div>
                    <div className="text-sm text-neutral-500">Fat</div>
                  </div>
                )}
              </div>
            </div>
          )}
        </Container>
      </div>
    </>
  );
}

// Demo recipe for development/preview
function DemoRecipe() {
  return (
    <div className="py-8 md:py-12">
      <Container size="md">
        <div className="text-center py-16">
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-primary-100 flex items-center justify-center">
            <ChefHat className="w-10 h-10 text-primary-500" />
          </div>
          <h1 className="text-3xl font-display font-bold text-neutral-900 mb-4">
            Recipe Coming Soon
          </h1>
          <p className="text-neutral-600 max-w-md mx-auto mb-8">
            We&apos;re still building our recipe database. Once recipes are scraped, you&apos;ll see
            them here with full ingredients, instructions, and scaling controls.
          </p>
          <Link href="/search">
            <Button>Browse Recipes</Button>
          </Link>
        </div>
      </Container>
    </div>
  );
}
