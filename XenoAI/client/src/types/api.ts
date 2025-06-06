/**
 * API response interface
 */
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    message: string;
    stack?: string;
  };
}

/**
 * Pagination parameters interface
 */
export interface PaginationParams {
  limit?: number;
  offset?: number;
  page?: number;
  before?: string;
  after?: string;
}

/**
 * Pagination metadata interface
 */
export interface PaginationMeta {
  total: number;
  limit: number;
  offset?: number;
  page?: number;
  pages?: number;
  hasMore?: boolean;
}

/**
 * Paginated response interface
 */
export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  meta: PaginationMeta;
  error?: {
    message: string;
    stack?: string;
  };
}

/**
 * API error interface
 */
export interface ApiError {
  message: string;
  status: number;
  stack?: string;
}

/**
 * Query parameters interface
 */
export interface QueryParams {
  [key: string]: string | number | boolean | undefined;
}

/**
 * Request options interface
 */
export interface RequestOptions {
  headers?: Record<string, string>;
  params?: QueryParams;
  withCredentials?: boolean;
  signal?: AbortSignal;
}

/**
 * API client interface
 */
export interface ApiClient {
  get: <T>(url: string, options?: RequestOptions) => Promise<ApiResponse<T>>;
  post: <T>(url: string, data: any, options?: RequestOptions) => Promise<ApiResponse<T>>;
  put: <T>(url: string, data: any, options?: RequestOptions) => Promise<ApiResponse<T>>;
  patch: <T>(url: string, data: any, options?: RequestOptions) => Promise<ApiResponse<T>>;
  delete: <T>(url: string, options?: RequestOptions) => Promise<ApiResponse<T>>;
}