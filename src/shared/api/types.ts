/**
 * ═══════════════════════════════════════════════════════════
 * Common API Response Types
 * ═══════════════════════════════════════════════════════════
 */

export interface ApiResponse<T = any> {
    success: boolean;
    data?: T;
    message?: string;
    error?: string;
}

export interface PaginatedResponse<T = any> {
    data: T[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}

export interface ApiError {
    message: string;
    code?: string;
    status?: number;
    details?: any;
}

/**
 * ═══════════════════════════════════════════════════════════
 * Query Parameters Types
 * ═══════════════════════════════════════════════════════════
 */

export interface PaginationParams {
    page?: number;
    limit?: number;
}

export interface SortParams {
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
}

export interface SearchParams {
    query?: string;
    fields?: string[];
}

export interface DateRangeParams {
    dateFrom?: string;
    dateTo?: string;
}

export type QueryParams = PaginationParams & SortParams & SearchParams & DateRangeParams;

/**
 * ═══════════════════════════════════════════════════════════
 * HTTP Status Codes
 * ═══════════════════════════════════════════════════════════
 */

export enum HttpStatus {
    OK = 200,
    CREATED = 201,
    NO_CONTENT = 204,
    BAD_REQUEST = 400,
    UNAUTHORIZED = 401,
    FORBIDDEN = 403,
    NOT_FOUND = 404,
    CONFLICT = 409,
    UNPROCESSABLE_ENTITY = 422,
    INTERNAL_SERVER_ERROR = 500,
    BAD_GATEWAY = 502,
    SERVICE_UNAVAILABLE = 503,
}

/**
 * ═══════════════════════════════════════════════════════════
 * Upload Progress Callback
 * ═══════════════════════════════════════════════════════════
 */

export type ProgressCallback = (progress: number) => void;

/**
 * ═══════════════════════════════════════════════════════════
 * File Upload Types
 * ═══════════════════════════════════════════════════════════
 */

export interface FileUploadResponse {
    fileId: string;
    fileName: string;
    fileSize: number;
    mimeType: string;
    url: string;
    uploadedAt: string;
}

export interface FileUploadParams {
    file: File;
    onProgress?: ProgressCallback;
    metadata?: Record<string, any>;
}