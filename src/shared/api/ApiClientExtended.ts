import apiClient from './ApiClient';
import type {FileUploadResponse, ProgressCallback} from './types';

/**
 * ═══════════════════════════════════════════════════════════
 * Extended API Client with File Operations
 * ═══════════════════════════════════════════════════════════
 */

export class ApiClientExtended {
    /**
     * ⭐ Upload single file
     */
    static async uploadFile(
        endpoint: string,
        file: File,
        onProgress?: ProgressCallback,
        metadata?: Record<string, any>
    ): Promise<FileUploadResponse> {
        const formData = new FormData();
        formData.append('file', file);

        // Add metadata if provided
        if (metadata) {
            Object.entries(metadata).forEach(([key, value]) => {
                formData.append(key, String(value));
            });
        }

        try {
            const response = await apiClient.post<FileUploadResponse>(endpoint, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
                onUploadProgress: (progressEvent) => {
                    if (onProgress && progressEvent.total) {
                        const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                        onProgress(progress);
                    }
                },
            });

            console.log('✅ File uploaded successfully:', response.data);
            return response.data;
        } catch (error: any) {
            console.error('❌ File upload failed:', error);
            throw error;
        }
    }

    /**
     * ⭐ Upload multiple files
     */
    static async uploadMultipleFiles(
        endpoint: string,
        files: File[],
        onProgress?: ProgressCallback,
        metadata?: Record<string, any>
    ): Promise<FileUploadResponse[]> {
        const formData = new FormData();

        files.forEach((file, index) => {
            formData.append(`files`, file); // or `files[${index.ts}]`
        });

        if (metadata) {
            Object.entries(metadata).forEach(([key, value]) => {
                formData.append(key, String(value));
            });
        }

        try {
            const response = await apiClient.post<FileUploadResponse[]>(endpoint, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
                onUploadProgress: (progressEvent) => {
                    if (onProgress && progressEvent.total) {
                        const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                        onProgress(progress);
                    }
                },
            });

            console.log('✅ Files uploaded successfully:', response.data);
            return response.data;
        } catch (error: any) {
            console.error('❌ File upload failed:', error);
            throw error;
        }
    }

    /**
     * ⭐ Download file
     */
    static async downloadFile(
        endpoint: string,
        filename?: string,
        onProgress?: ProgressCallback
    ): Promise<void> {
        try {
            const response = await apiClient.get(endpoint, {
                responseType: 'blob',
                onDownloadProgress: (progressEvent) => {
                    if (onProgress && progressEvent.total) {
                        const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                        onProgress(progress);
                    }
                },
            });

            // Create download link
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;

            // Extract filename from response headers or use provided filename
            const contentDisposition = response.headers['content-disposition'];
            const extractedFilename = contentDisposition
                ? contentDisposition.split('filename=')[1]?.replace(/"/g, '')
                : filename || 'download';

            link.setAttribute('download', extractedFilename);
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(url);

            console.log('✅ File downloaded successfully:', extractedFilename);
        } catch (error: any) {
            console.error('❌ File download failed:', error);
            throw error;
        }
    }

    /**
     * ⭐ Upload file with preview (for images)
     */
    static async uploadImageWithPreview(
        endpoint: string,
        file: File,
        onProgress?: ProgressCallback
    ): Promise<{ upload: FileUploadResponse; preview: string }> {
        // Create preview
        const preview = await this.createImagePreview(file);

        // Upload file
        const upload = await this.uploadFile(endpoint, file, onProgress);

        return { upload, preview };
    }

    /**
     * ⭐ Create image preview (base64)
     */
    static createImagePreview(file: File): Promise<string> {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();

            reader.onload = (e) => {
                if (e.target?.result) {
                    resolve(e.target.result as string);
                } else {
                    reject(new Error('Failed to read file'));
                }
            };

            reader.onerror = () => {
                reject(new Error('Failed to read file'));
            };

            reader.readAsDataURL(file);
        });
    }

    /**
     * ⭐ Validate file size
     */
    static validateFileSize(file: File, maxSizeMB: number): boolean {
        const maxSizeBytes = maxSizeMB * 1024 * 1024;
        return file.size <= maxSizeBytes;
    }

    /**
     * ⭐ Validate file type
     */
    static validateFileType(file: File, allowedTypes: string[]): boolean {
        return allowedTypes.includes(file.type);
    }

    /**
     * ⭐ Get file extension
     */
    static getFileExtension(filename: string): string {
        return filename.slice(((filename.lastIndexOf('.') - 1) >>> 0) + 2);
    }

    /**
     * ⭐ Format file size
     */
    static formatFileSize(bytes: number): string {
        if (bytes === 0) return '0 Bytes';

        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));

        return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
    }
}

// Export convenience methods
export const fileApi = {
    upload: ApiClientExtended.uploadFile,
    uploadMultiple: ApiClientExtended.uploadMultipleFiles,
    download: ApiClientExtended.downloadFile,
    uploadImage: ApiClientExtended.uploadImageWithPreview,
    createPreview: ApiClientExtended.createImagePreview,
    validateSize: ApiClientExtended.validateFileSize,
    validateType: ApiClientExtended.validateFileType,
    getExtension: ApiClientExtended.getFileExtension,
    formatSize: ApiClientExtended.formatFileSize,
};