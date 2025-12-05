// typescript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// Helper: normalize id to posix-style path for consistent checks on Windows
const normalizeId = (id: string) => id.split(path.sep).join('/');

// Extract package name from node_modules path, handling scoped packages
const getPackageName = (id: string) => {
  const parts = normalizeId(id).split('/node_modules/').pop()?.split('/') ?? [];
  if (!parts.length) return null;
  // If scoped package e.g. @scope/pkg -> return @scope/pkg
  if (parts[0].startsWith('@') && parts.length > 1) return `${parts[0]}/${parts[1]}`;
  return parts[0];
};

export default defineConfig({
  plugins: [
    react(),
    // Optional: uncomment visualizer for bundle analysis
    // visualizer({ open: true, gzipSize: true, brotliSize: true, filename: 'dist/stats.html' }),
  ],

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

  build: {
    outDir: 'dist',
    sourcemap: false,
    minify: 'terser',
    target: 'es2019',
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
      format: {
        comments: false,
      },
    },
    cssCodeSplit: true,
    chunkSizeWarningLimit: 500,
    assetsDir: 'assets',
    assetsInlineLimit: 4096,
    // Slightly faster builds by not computing compressed sizes by default
    reportCompressedSize: false,
    emptyOutDir: true,
    write: true,

    commonjsOptions: {
      transformMixedEsModules: true,
    },

    // typescript
// Replace the `rollupOptions.output` block in `vite.config.ts` with this
    rollupOptions: {
      treeshake: {
        moduleSideEffects: false,
        propertyReadSideEffects: false,
      },

      output: {
        manualChunks: (id: string) => {
          const nid = normalizeId(id);

          if (nid.includes('/node_modules/')) {
            const pkg = getPackageName(nid) ?? 'vendor';

            // split core pieces of React stack to reduce single large file
            if (nid.includes('/node_modules/react/jsx-runtime')) return 'vendor/react-jsx-runtime';
            if (nid.includes('/node_modules/scheduler')) return 'vendor/scheduler';
            if (nid.includes('/node_modules/react-dom/client')) return 'vendor/react-dom-client';
            if (nid.includes('/node_modules/react-dom/server')) return 'vendor/react-dom-server';
            if (pkg === 'react') return 'vendor/react';
            if (pkg === 'react-dom') return 'vendor/react-dom';

            if (pkg === 'react-router-dom' || pkg === 'react-router') return 'vendor/router';
            if (pkg === 'axios') return 'vendor/axios';
            const commonVendors = ['clsx', 'zustand', 'valtio', 'prop-types', 'history', 'qs'];
            if (commonVendors.includes(pkg)) return 'vendor/libs';
            return 'vendor/other';
          }

          // src/shared/components -> group by first-level component folder
          if (nid.includes('/src/shared/components/')) {
            const rel = nid.split('/src/shared/components/').pop() ?? '';
            const group = rel.split('/')[0] || 'misc';
            return `shared/components/${group}`;
          }

          // ui inside shared/components
          if (nid.includes('/src/shared/componets/ui/')) {
            const rel = nid.split('/src/shared/componets/ui/').pop() ?? '';
            const group = rel.split('/')[0] || 'ui';
            return `shared/components/ui/${group}`;
          }

          if (nid.includes('/src/shared/utils/')) {
            const rel = nid.split('/src/shared/utils/').pop() ?? '';
            const group = rel.split('/')[0] || 'utils';
            return `shared/utils/${group}`;
          }
          if (nid.includes('/src/shared/hooks/')) {
            const rel = nid.split('/src/shared/hooks/').pop() ?? '';
            const group = rel.split('/')[0] || 'hooks';
            return `shared/hooks/${group}`;
          }
          if (nid.includes('/src/shared/api/')) {
            const rel = nid.split('/src/shared/api/').pop() ?? '';
            const group = rel.split('/')[0] || 'api';
            return `shared/api/${group}`;
          }


          // sanitize id then match feature pages
          const cleanId = (raw: string) => {
            let s = raw.split('?')[0].split('#')[0]; // strip query/hash
            s = s.replace(/^\0/, '');                 // remove null-prefix for virtual ids
            s = s.replace(/^\/@fs\//, '/');           // remove Vite @fs prefix
            return normalizeId(s);
          };

          const cleaned = cleanId(id);
          const featurePages = cleaned.match(/\/src\/features\/([^/]+)\/pages\//);
          if (featurePages) {
            const featureName = featurePages[1];
            return `pages/${featureName}`;
          }

          // features -> group by feature name
          if (nid.includes('/src/features/')) {
            const rel = nid.split('/src/features/').pop() ?? '';
            const feature = rel.split('/')[0] || 'feature';
            // further split big feature parts if needed
            return `features/${feature}`;
          }

          // survey specific steps grouping (keeps separate chunks per step folder)
          if (nid.includes('/src/features/survey/components/steps/')) {
            const rel = nid.split('/src/features/survey/components/steps/').pop() ?? '';
            const step = rel.split('/')[0] || 'step';
            return `features/survey/steps/${step}`;
          }

          // pages -> group by page directory
          // Replace the incorrect `if` with this block in `vite.config.ts`
          if (nid.includes('/src/pages/')) {
            const rel = nid.includes('/src/pages/')
                ? nid.split('/src/pages/').pop() ?? ''
                : nid.split(/\/src\/features\/[^/]+\/pages\//).pop() ?? '';
            const page = rel.split('/')[0] || 'page';
            return `pages/${page}`;
          }

          if (nid.includes('/src/shared/layouts/')) {
            const rel = nid.split('/src/shared/layouts/').pop() ?? '';
            const group = rel.split('/')[0] || 'layouts';
            return `shared/layouts/${group}`;
          }

          // fallback: let Rollup decide (no explicit chunk name)
        },

        // remove the static `js/` prefix so chunk names with slashes produce real folders
        chunkFileNames: '[name]-[hash].js',
        entryFileNames: '[name]-[hash].js',

        assetFileNames: (assetInfo) => {
          const name = assetInfo.name ?? '';
          const ext = name.split('.').pop() ?? '';
          if (/png|jpe?g|svg|gif|tiff|bmp|ico/i.test(ext)) return 'assets/images/[name]-[hash][extname]';
          if (/woff2?|ttf|otf|eot/i.test(ext)) return 'assets/fonts/[name]-[hash][extname]';
          if (ext === 'css') return 'assets/css/[name]-[hash][extname]';
          return 'assets/[name]-[hash][extname]';
        },
      },
    },
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

  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-router-dom',
      'axios',
      'lodash',
      'clsx',
      'date-fns',
    ],
    exclude: [],
  },

  define: {
    __APP_VERSION__: JSON.stringify(process.env.npm_package_version),
  },
});
