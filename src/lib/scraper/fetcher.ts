/**
 * HTTP fetcher with retry logic and rate limiting
 */

const DEFAULT_USER_AGENT =
  process.env.SCRAPE_USER_AGENT ||
  'EmberWhiskBot/1.0 (+https://emberwhisk.co/about; recipe aggregator)';

const DEFAULT_TIMEOUT = 10000; // 10 seconds
const MAX_RETRIES = 3;
const RETRY_DELAY_MS = 1000;

interface FetchOptions {
  userAgent?: string;
  timeout?: number;
  maxRetries?: number;
}

/**
 * Fetch a URL with retry logic
 */
export async function fetchWithRetry(
  url: string,
  options: FetchOptions = {}
): Promise<string> {
  const {
    userAgent = DEFAULT_USER_AGENT,
    timeout = DEFAULT_TIMEOUT,
    maxRetries = MAX_RETRIES,
  } = options;

  let lastError: Error | null = null;

  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), timeout);

      const response = await fetch(url, {
        headers: {
          'User-Agent': userAgent,
          Accept:
            'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
          'Accept-Language': 'en-US,en;q=0.5',
        },
        signal: controller.signal,
        redirect: 'follow',
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const html = await response.text();
      return html;
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));
      console.error(`Fetch attempt ${attempt + 1} failed for ${url}:`, lastError.message, lastError.cause);

      // Don't retry on 4xx errors (except 429)
      if (
        lastError.message.startsWith('HTTP 4') &&
        !lastError.message.startsWith('HTTP 429')
      ) {
        throw lastError;
      }

      // Wait before retry (exponential backoff)
      if (attempt < maxRetries - 1) {
        await sleep(RETRY_DELAY_MS * Math.pow(2, attempt));
      }
    }
  }

  throw lastError || new Error('Failed to fetch after retries');
}

/**
 * Sleep for specified milliseconds
 */
function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Rate limiter for per-domain throttling
 */
export class RateLimiter {
  private lastRequest: Map<string, number> = new Map();
  private defaultDelayMs: number;

  constructor(defaultDelayMs: number = 5000) {
    this.defaultDelayMs = defaultDelayMs;
  }

  /**
   * Wait if needed before making request to domain
   */
  async throttle(domain: string, delayMs?: number): Promise<void> {
    const delay = delayMs ?? this.defaultDelayMs;
    const lastTime = this.lastRequest.get(domain) || 0;
    const elapsed = Date.now() - lastTime;

    if (elapsed < delay) {
      await sleep(delay - elapsed);
    }

    this.lastRequest.set(domain, Date.now());
  }

  /**
   * Get time until next request is allowed
   */
  getWaitTime(domain: string, delayMs?: number): number {
    const delay = delayMs ?? this.defaultDelayMs;
    const lastTime = this.lastRequest.get(domain) || 0;
    const elapsed = Date.now() - lastTime;

    return Math.max(0, delay - elapsed);
  }
}

// Global rate limiter instance
export const rateLimiter = new RateLimiter(
  parseInt(process.env.SCRAPE_RATE_LIMIT_MS || '5000', 10)
);
