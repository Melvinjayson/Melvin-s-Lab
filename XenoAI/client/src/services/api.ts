import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { ApiResponse, RequestOptions, ApiError } from '../types/api';

/**
 * API client for making HTTP requests
 */
class ApiClient {
  private client: AxiosInstance;
  private baseURL: string;

  constructor() {
    this.baseURL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';
    
    this.client = axios.create({
      baseURL: this.baseURL,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    });

    // Add request interceptor for authentication
    this.client.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('token');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Add response interceptor for error handling
    this.client.interceptors.response.use(
      (response) => response,
      (error) => {
        // Handle session expiration
        if (error.response?.status === 401) {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          window.location.href = '/login';
        }
        return Promise.reject(error);
      }
    );
  }

  /**
   * Make a GET request
   */
  public async get<T>(url: string, options?: RequestOptions): Promise<ApiResponse<T>> {
    try {
      const config: AxiosRequestConfig = {
        params: options?.params,
        headers: options?.headers,
        withCredentials: options?.withCredentials,
        signal: options?.signal,
      };

      const response: AxiosResponse<ApiResponse<T>> = await this.client.get(url, config);
      return response.data;
    } catch (error) {
      return this.handleError<T>(error);
    }
  }

  /**
   * Make a POST request
   */
  public async post<T>(url: string, data: any, options?: RequestOptions): Promise<ApiResponse<T>> {
    try {
      const config: AxiosRequestConfig = {
        headers: options?.headers,
        withCredentials: options?.withCredentials,
        signal: options?.signal,
      };

      const response: AxiosResponse<ApiResponse<T>> = await this.client.post(url, data, config);
      return response.data;
    } catch (error) {
      return this.handleError<T>(error);
    }
  }

  /**
   * Make a PUT request
   */
  public async put<T>(url: string, data: any, options?: RequestOptions): Promise<ApiResponse<T>> {
    try {
      const config: AxiosRequestConfig = {
        headers: options?.headers,
        withCredentials: options?.withCredentials,
        signal: options?.signal,
      };

      const response: AxiosResponse<ApiResponse<T>> = await this.client.put(url, data, config);
      return response.data;
    } catch (error) {
      return this.handleError<T>(error);
    }
  }

  /**
   * Make a PATCH request
   */
  public async patch<T>(url: string, data: any, options?: RequestOptions): Promise<ApiResponse<T>> {
    try {
      const config: AxiosRequestConfig = {
        headers: options?.headers,
        withCredentials: options?.withCredentials,
        signal: options?.signal,
      };

      const response: AxiosResponse<ApiResponse<T>> = await this.client.patch(url, data, config);
      return response.data;
    } catch (error) {
      return this.handleError<T>(error);
    }
  }

  /**
   * Make a DELETE request
   */
  public async delete<T>(url: string, options?: RequestOptions): Promise<ApiResponse<T>> {
    try {
      const config: AxiosRequestConfig = {
        headers: options?.headers,
        withCredentials: options?.withCredentials,
        signal: options?.signal,
      };

      const response: AxiosResponse<ApiResponse<T>> = await this.client.delete(url, config);
      return response.data;
    } catch (error) {
      return this.handleError<T>(error);
    }
  }

  /**
   * Handle API errors
   */
  private handleError<T>(error: any): ApiResponse<T> {
    const apiError: ApiError = {
      message: 'An unexpected error occurred',
      status: 500,
    };

    if (axios.isAxiosError(error)) {
      apiError.message = error.response?.data?.error?.message || error.message;
      apiError.status = error.response?.status || 500;
      apiError.stack = error.response?.data?.error?.stack;
    } else if (error instanceof Error) {
      apiError.message = error.message;
      apiError.stack = error.stack;
    }

    console.error('API Error:', apiError);

    return {
      success: false,
      error: {
        message: apiError.message,
        stack: process.env.NODE_ENV === 'development' ? apiError.stack : undefined,
      },
    };
  }
}

// Export a singleton instance
export const api = new ApiClient();

// Export default for testing
export default ApiClient;