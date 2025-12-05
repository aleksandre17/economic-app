/**
 * ═══════════════════════════════════════════════════════════
 * API Client Exports
 * ═══════════════════════════════════════════════════════════
 */

// Main API Client
export { default as apiClient } from './ApiClient';
export { default as ApiClient } from './ApiClient';

// Extended API Client (File operations)
export { ApiClientExtended, fileApi } from './ApiClientExtended';

// Types
export * from './types';

/**
 * ═══════════════════════════════════════════════════════════
 * Usage Examples:
 * ═══════════════════════════════════════════════════════════
 *
 * // Import main client
 * import apiClient from '@/shared/api';
 *
 * // Import with alias
 * import { apiClient as api } from '@/shared/api';
 *
 * // Import file operations
 * import { fileApi } from '@/shared/api';
 *
 * // Import types
 * import { ApiResponse, QueryParams } from '@/shared/api';
 */