interface RetryConfig {
  maxRetries: number;
  initialDelay: number;
  maxDelay: number;
  shouldRetry?: (error: any, attempt: number) => boolean;
  onRetry?: (error: any, attempt: number, delay: number) => void;
}

export async function retryWithBackoff<T>(
  fn: (attempt: number) => Promise<T>,
  config: RetryConfig
): Promise<T> {
  let attempt = 1;
  let delay = config.initialDelay;

  while (attempt <= config.maxRetries) {
    try {
      return await fn(attempt);
    } catch (error) {
      const shouldRetry = config.shouldRetry?.(error, attempt) ?? true;

      if (attempt === config.maxRetries || !shouldRetry) {
        throw error;
      }

      if (config.onRetry) {
        config.onRetry(error, attempt, delay);
      }
      
      await new Promise(resolve => setTimeout(resolve, delay));
      
      // Exponential backoff with jitter and max delay
      const jitter = 0.5 + Math.random();
      delay = Math.min(delay * 2 * jitter, config.maxDelay);
      attempt++;
    }
  }

  throw new Error('Max retries exceeded');
}