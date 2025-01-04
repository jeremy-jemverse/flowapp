import axios, { AxiosError, AxiosRequestConfig } from 'axios';
import { retryWithBackoff } from '@/lib/utils/retry';
import { safeSerialize } from '@/lib/utils/serialization';

interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export class ApiService {
  private static readonly BASE_URL = 'https://flownodes.onrender.com/api/nodes';
  private static readonly DEFAULT_TIMEOUT = 30000;
  private static readonly MAX_RETRIES = 3;
  private static readonly INITIAL_RETRY_DELAY = 1000;
  private static readonly MAX_RETRY_DELAY = 5000;

  static async post<T>(endpoint: string, data: any, config: Partial<AxiosRequestConfig> = {}): Promise<ApiResponse<T>> {
    const url = `${this.BASE_URL}${endpoint}`;
    const sanitizedData = this.sanitizeData(data);

    return retryWithBackoff(
      async (attempt) => {
        try {
          console.log(`ApiService.post: Attempt ${attempt}`, { 
            url, 
            data: sanitizedData,
            attempt 
          });

          const response = await axios.post<ApiResponse<T>>(
            url,
            safeSerialize(data),
            {
              headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
              },
              timeout: this.DEFAULT_TIMEOUT,
              ...config
            }
          );

          if (!response.data) {
            throw new Error('Empty response received');
          }

          return {
            success: true,
            data: response.data.data || response.data as T,
            message: response.data.message
          };
        } catch (error) {
          throw this.handleError(error);
        }
      },
      {
        maxRetries: this.MAX_RETRIES,
        initialDelay: this.INITIAL_RETRY_DELAY,
        maxDelay: this.MAX_RETRY_DELAY,
        shouldRetry: (error) => this.shouldRetry(error),
        onRetry: (error, attempt, delay) => {
          console.log(`ApiService.post: Retry attempt ${attempt} in ${delay}ms`, error);
        }
      }
    );
  }

  private static shouldRetry(error: any): boolean {
    if (error instanceof AxiosError) {
      // Retry on network errors or 5xx server errors
      return !error.response || (error.response.status >= 500 && error.response.status < 600);
    }
    return false;
  }

  private static handleError(error: any): Error {
    if (error instanceof AxiosError) {
      const status = error.response?.status;
      const data = error.response?.data;
      
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
    const sanitized = { ...data };
    // Remove sensitive data from logs
    if (sanitized.connectionDetails?.password) {
      sanitized.connectionDetails.password = '***';
    }
    if (sanitized.connectionDetails?.conn_password) {
      sanitized.connectionDetails.conn_password = '***';
    }
    if (sanitized.api_key) {
      sanitized.api_key = '***';
    }
    return sanitized;
  }
}