import axios, { AxiosError, AxiosRequestConfig } from 'axios';
import { ApiResponse } from './types';
import { retryWithBackoff } from '@/lib/utils/retry';

export class HttpClient {
  private static readonly DEFAULT_TIMEOUT = 60000; // Increased to 60 seconds
  private static readonly MAX_RETRIES = 3;
  private static readonly INITIAL_RETRY_DELAY = 1000;
  private static readonly MAX_RETRY_DELAY = 10000;

  static async post<T>(url: string, data: any, config: Partial<AxiosRequestConfig> = {}): Promise<ApiResponse<T>> {
    const sanitizedData = this.sanitizeData(data);

    return retryWithBackoff(
      async (attempt) => {
        try {
          console.log(`HttpClient.post: Attempt ${attempt}`, { 
            url, 
            data: sanitizedData,
            attempt,
            timeout: config.timeout || this.DEFAULT_TIMEOUT
          });

          const response = await axios.post<ApiResponse<T>>(
            url,
            data,
            {
              headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
              },
              timeout: config.timeout || this.DEFAULT_TIMEOUT,
              ...config
            }
          );

          if (!response.data) {
            throw new Error('Empty response received');
          }

          return {
            success: true,
            data: response.data.data || response.data,
            message: response.data.message
          };
        } catch (error) {
          console.error('HttpClient.post: Error', {
            url,
            error: this.sanitizeError(error)
          });
          throw this.handleError(error);
        }
      },
      {
        maxRetries: this.MAX_RETRIES,
        initialDelay: this.INITIAL_RETRY_DELAY,
        maxDelay: this.MAX_RETRY_DELAY,
        shouldRetry: (error) => this.shouldRetry(error),
        onRetry: (error, attempt, delay) => {
          console.log(`HttpClient.post: Retry attempt ${attempt} in ${delay}ms`, {
            url,
            error: this.sanitizeError(error)
          });
        }
      }
    );
  }

  private static shouldRetry(error: any): boolean {
    if (error instanceof AxiosError) {
      // Retry on network errors, timeouts, or 5xx server errors
      if (error.code === 'ECONNABORTED') {
        return true; // Retry on timeouts
      }
      const status = error.response?.status;
      return !error.response || (status && status >= 500 && status < 600);
    }
    return false;
  }

  private static handleError(error: any): Error {
    if (error instanceof AxiosError) {
      const status = error.response?.status;
      const data = error.response?.data;
      
      if (error.code === 'ECONNABORTED') {
        return new Error('Request timed out - the server is taking too long to respond');
      }
      
      if (status === 404) {
        return new Error('API endpoint not found');
      }
      
      if (status === 401) {
        return new Error('Unauthorized - please check your credentials');
      }
      
      if (status === 400) {
        return new Error(`Bad request: ${data?.message || 'Invalid input'}`);
      }
      
      if (status === 429) {
        return new Error('Too many requests - please try again later');
      }
      
      if (status >= 500) {
        return new Error(`Server error: ${data?.message || 'Internal server error'}`);
      }
      
      if (!error.response) {
        return new Error('Network error - please check your connection');
      }
      
      return new Error(data?.message || error.message || 'API request failed');
    }
    
    return error instanceof Error ? error : new Error('Unknown error occurred');
  }

  private static sanitizeData(data: any): any {
    if (!data) return data;

    const sanitized = { ...data };
    
    // Recursively sanitize nested objects
    if (typeof data === 'object') {
      Object.keys(data).forEach(key => {
        if (typeof data[key] === 'object') {
          sanitized[key] = this.sanitizeData(data[key]);
        } else if (this.isSensitiveField(key)) {
          sanitized[key] = '***';
        }
      });
    }

    return sanitized;
  }

  private static isSensitiveField(key: string): boolean {
    const sensitiveFields = [
      'password',
      'conn_password',
      'api_key',
      'api_secret',
      'token',
      'secret'
    ];
    return sensitiveFields.some(field => key.toLowerCase().includes(field));
  }

  private static sanitizeError(error: any): any {
    if (error instanceof AxiosError) {
      return {
        message: error.message,
        code: error.code,
        status: error.response?.status,
        data: this.sanitizeData(error.response?.data)
      };
    }
    return error instanceof Error ? error.message : 'Unknown error';
  }
}