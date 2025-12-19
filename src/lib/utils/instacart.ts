/**
 * Instacart integration utilities
 *
 * Once approved for Instacart Developer Platform:
 * 1. Add INSTACART_PARTNER_ID to env
 * 2. Tracking will automatically be applied to all links
 */

// Partner ID will be set once approved for Instacart Developer Platform
const PARTNER_ID = process.env.NEXT_PUBLIC_INSTACART_PARTNER_ID || '';

// Affiliate tracking params for Impact attribution
const TRACKING_PARAMS = PARTNER_ID ? {
  utm_campaign: 'instacart-idp',
  utm_medium: 'affiliate',
  utm_source: 'instacart_idp',
  utm_term: 'partnertype-mediapartner',
  utm_content: `campaignid-20313_partnerid-${PARTNER_ID}`,
} : {};

/**
 * Generate Instacart search URL with affiliate tracking
 */
export function generateInstacartSearchUrl(query: string): string {
  const baseUrl = 'https://www.instacart.com/store/search';
  const url = new URL(baseUrl);

  url.searchParams.set('q', query);

  // Add tracking params if we have a partner ID
  Object.entries(TRACKING_PARAMS).forEach(([key, value]) => {
    url.searchParams.set(key, value);
  });

  return url.toString();
}

/**
 * Generate Instacart URL for multiple items
 * Opens search with all items as a comma-separated query
 */
export function generateInstacartListUrl(items: string[]): string {
  // Clean items: extract just the ingredient name without quantities for better search
  const cleanedItems = items.map(item => extractIngredientName(item));
  const query = cleanedItems.join(', ');

  return generateInstacartSearchUrl(query);
}

/**
 * Extract ingredient name from formatted shopping list text
 * "Carrots (2)" -> "carrots"
 * "Olive oil (1 cup)" -> "olive oil"
 * "Ground cumin" -> "ground cumin"
 */
function extractIngredientName(text: string): string {
  // Remove quantity in parentheses at the end
  const withoutQty = text.replace(/\s*\([^)]+\)\s*$/, '');

  // Lowercase for better search results
  return withoutQty.toLowerCase().trim();
}

/**
 * Open Instacart with shopping list items
 */
export function openInstacartWithItems(items: { text: string; checked: boolean }[]): void {
  const uncheckedItems = items
    .filter(item => !item.checked)
    .map(item => item.text);

  if (uncheckedItems.length === 0) {
    alert('No items to shop for! Uncheck some items first.');
    return;
  }

  const url = generateInstacartListUrl(uncheckedItems);
  window.open(url, '_blank', 'noopener,noreferrer');
}

/**
 * Check if Instacart affiliate is configured
 */
export function isInstacartConfigured(): boolean {
  return Boolean(PARTNER_ID);
}
