import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    fs: {
      allow: ['..']
    }
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            // React core + ecosystem
            if (
              id.includes('react') ||
              id.includes('react-dom') ||
              id.includes('react-router-dom')
            ) {
              return 'react-vendor';
            }

            // Markdown-related libraries
            if (
              id.includes('react-markdown') ||
              id.includes('react-markdown-editor-lite') ||
              id.includes('markdown-it') ||
              id.includes('rehype-raw')
            ) {
              return 'markdown-vendor';
            }

            // Everything else
            return 'vendor';
          }
        }
      },
      // Suppress eval warning from gray-matter (third-party library)
      onwarn(warning, warn) {
        // Ignore eval warnings from gray-matter
        if (warning.code === 'EVAL' && warning.id.includes('gray-matter')) {
          return;
        }
        // Let Rollup handle other warnings normally
        warn(warning);
      }
    },
    // Set chunk size warning limit to 1000 kb
    chunkSizeWarningLimit: 1000
  }
})
