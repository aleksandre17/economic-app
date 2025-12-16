// vite.config.ts

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { visualizer } from 'rollup-plugin-visualizer';
import path from 'path';

export default defineConfig({
  plugins: [
    react(),
    visualizer({
      open: true,
      gzipSize: true,
      brotliSize: true,
      filename: './dist/stats.html',
    }),
  ],

  publicDir: 'public',

  build: {
    target: 'es2020',

    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
        pure_funcs: ['console.log', 'console.info', 'console.debug'],
        passes: 2,
      },
      mangle: {
        safari10: true,
      },
    },

    cssCodeSplit: true,
    chunkSizeWarningLimit: 400,

    rollupOptions: {
      output: {
        manualChunks: (id) => {
          // React ecosystem
          if (id.includes('node_modules')) {
            if (id.includes('react/') && !id.includes('react-dom') && !id.includes('react-router')) {
              return 'vendor-react-core';
            }
            if (id.includes('react-dom')) {
              return 'vendor-react-dom';
            }
            if (id.includes('react-router')) {
              return 'vendor-router';
            }
            if (id.includes('react-hook-form')) {
              return 'vendor-rhf';
            }
            if (id.includes('zod')) {
              return 'vendor-zod';
            }
            if (id.includes('@hookform/resolvers')) {
              return 'vendor-resolvers';
            }
            return 'vendor-utils';
          }

          // Packages
          if (id.includes('/packages/classifiers')) {
            return 'pkg-classifiers';
          }
          if (id.includes('/packages/notifications')) {
            return 'pkg-notifications';
          }
          if (id.includes('/packages/SearchableSelect') || id.includes('/packages/searchable-select')) {
            return 'pkg-searchable-select';
          }

          // Survey steps
          if (id.includes('/src/features/survey/components/steps/Step1')) {
            return 'survey-step1';
          }
          if (id.includes('/src/features/survey/components/steps/Step2')) {
            return 'survey-step2';
          }
          if (id.includes('/src/features/survey/components/steps/Step3')) {
            return 'survey-step3';
          }
          if (id.includes('/src/features/survey/components/steps/Step4')) {
            return 'survey-step4';
          }
          if (id.includes('/src/features/survey/components/steps/Step5')) {
            return 'survey-step5';
          }
          if (id.includes('/src/features/survey/schemas')) {
            return 'survey-schemas';
          }
          if (id.includes('/src/features/survey/config')) {
            return 'survey-config';
          }
          if (id.includes('/src/features/survey/components/navigation')) {
            return 'survey-navigation';
          }
          if (id.includes('/src/features/survey')) {
            return 'survey-common';
          }

          // Auth
          if (id.includes('/src/features/auth')) {
            return 'feature-auth';
          }

          // Shared
          if (id.includes('/src/shared/componets/ui')) {
            return 'shared-ui';
          }
          if (id.includes('/src/shared/utils')) {
            return 'shared-utils';
          }
          if (id.includes('/src/shared/hooks')) {
            return 'shared-hooks';
          }
        },

        // ✅ JS chunks in assets/js/
        chunkFileNames: (chunkInfo) => {
          const name = chunkInfo.name;

          if (name.startsWith('pkg-')) {
            return 'assets/js/packages/[name]-[hash].js';
          }
          if (name.startsWith('vendor-')) {
            return 'assets/js/vendor/[name]-[hash].js';
          }
          if (name.startsWith('survey-step')) {
            return 'assets/js/survey/steps/[name]-[hash].js';
          }
          if (name.startsWith('survey-')) {
            return 'assets/js/survey/[name]-[hash].js';
          }
          if (name.startsWith('feature-')) {
            return 'assets/js/features/[name]-[hash].js';
          }
          if (name.startsWith('shared-')) {
            return 'assets/js/shared/[name]-[hash].js';
          }

          return 'assets/js/chunks/[name]-[hash].js';
        },

        // ✅ Entry files in assets/js/
        entryFileNames: 'assets/js/[name]-[hash].js',

        // ✅ All other assets in assets/ with subfolders
        assetFileNames: (assetInfo) => {
          const name = assetInfo.name || '';
          const ext = name.split('.').pop() || '';

          // Images
          if (/png|jpe?g|svg|gif|tiff|bmp|ico|webp/i.test(ext)) {
            return 'assets/images/[name]-[hash][extname]';
          }

          // Fonts
          if (/woff|woff2|eot|ttf|otf/i.test(ext)) {
            return 'assets/fonts/[name]-[hash][extname]';
          }

          // CSS
          if (/css/i.test(ext)) {
            return 'assets/css/[name]-[hash][extname]';
          }

          // Other assets
          return 'assets/other/[name]-[hash][extname]';
        },
      },
    },

    sourcemap: false,
    assetsInlineLimit: 2048,
    emptyOutDir: true,
    copyPublicDir: true,
  },

  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@components': path.resolve(__dirname, './src/shared/components'),
      '@ui': path.resolve(__dirname, './src/shared/components/ui'),
      '@features': path.resolve(__dirname, './src/features'),
      '@pages': path.resolve(__dirname, './src/pages'),
      '@shared': path.resolve(__dirname, './src/shared'),
      '@hooks': path.resolve(__dirname, './src/shared/hooks'),
      '@api': path.resolve(__dirname, './src/shared/api'),
      '@layouts': path.resolve(__dirname, './src/shared/layouts'),
      '@styles': path.resolve(__dirname, './src/styles'),
      '@assets': path.resolve(__dirname, './src/assets'),
      '@utils': path.resolve(__dirname, './src/shared/utils'),
      '@icons': path.resolve(__dirname, './src/shared/icons'),
    },
  },

  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-router-dom',
      'react-hook-form',
      'zod',
    ],
  },

  server: {
    port: 5173,
    strictPort: false,
    host: true,
    open: true,
  },

  preview: {
    port: 4173,
    strictPort: false,
    host: true,
    open: true,
  },
})