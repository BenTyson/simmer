import type { RecipeWithDetails } from '@/types/recipe';

interface RecipeSchemaProps {
  recipe: RecipeWithDetails;
}

/**
 * JSON-LD structured data for SEO
 * This helps search engines understand the recipe content
 */
export function RecipeSchema({ recipe }: RecipeSchemaProps) {
  const schema = {
    '@context': 'https://schema.org/',
    '@type': 'Recipe',
    name: recipe.name,
    description: recipe.description,
    recipeIngredient: recipe.ingredients.map((ing) => ing.originalText),
    recipeInstructions: recipe.instructions.map((inst) => ({
      '@type': 'HowToStep',
      text: inst.text,
    })),
    prepTime: recipe.prepTime ? `PT${recipe.prepTime}M` : undefined,
    cookTime: recipe.cookTime ? `PT${recipe.cookTime}M` : undefined,
    totalTime: recipe.totalTime ? `PT${recipe.totalTime}M` : undefined,
    recipeYield: recipe.servings
      ? `${recipe.servings} ${recipe.servingsUnit || 'servings'}`
      : undefined,
    recipeCategory: recipe.category,
    recipeCuisine: recipe.cuisine,
    keywords: recipe.dietTags?.join(', '),
    nutrition: recipe.nutrition
      ? {
          '@type': 'NutritionInformation',
          calories: recipe.nutrition.calories
            ? `${recipe.nutrition.calories} calories`
            : undefined,
          proteinContent: recipe.nutrition.proteinGrams
            ? `${recipe.nutrition.proteinGrams}g`
            : undefined,
          carbohydrateContent: recipe.nutrition.carbsGrams
            ? `${recipe.nutrition.carbsGrams}g`
            : undefined,
          fatContent: recipe.nutrition.fatGrams
            ? `${recipe.nutrition.fatGrams}g`
            : undefined,
          fiberContent: recipe.nutrition.fiberGrams
            ? `${recipe.nutrition.fiberGrams}g`
            : undefined,
        }
      : undefined,
    // Attribution - links to original source
    isBasedOn: recipe.sourceUrl,
    publisher: {
      '@type': 'Organization',
      name: recipe.sourceName || recipe.sourceDomain,
      url: `https://${recipe.sourceDomain}`,
    },
  };

  // Remove undefined values
  const cleanSchema = JSON.parse(
    JSON.stringify(schema, (_, value) => (value === undefined ? undefined : value))
  );

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(cleanSchema) }}
    />
  );
}
