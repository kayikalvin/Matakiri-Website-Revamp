// import { defineConfig } from 'vite'
// import react from '@vitejs/plugin-react'
// import path from 'path'

// // https://vitejs.dev/config/
// export default defineConfig({
//   plugins: [react()],
//   server: {
//     port: 3002,
//     strictPort: true,
//     open: false, // Don't open browser automatically
//     host: true,  // Allow access from other devices on network
//     proxy: {
//       '/api': {
//         target: 'https://matakiri-website-revamp-backend.vercel.app/' || 'http://localhost:5000',
//         changeOrigin: true,
//         secure: false,
//         rewrite: (path) => path.replace(/^\/api/, '')
//       }
//     }
//   },
//   resolve: {
//     alias: {
//       '@': path.resolve(__dirname, './src'),
//     },
//   },
//   build: {
//     outDir: 'dist',
//     sourcemap: true,
//     rollupOptions: {
//       output: {
//         manualChunks: {
//           vendor: ['react', 'react-dom', 'react-router-dom'],
//           ui: ['@heroicons/react', 'react-hot-toast', 'framer-motion'],
//           forms: ['react-hook-form', 'yup', '@hookform/resolvers']
//         }
//       }
//     }
//   }
// })

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3002,
    strictPort: true,
    open: false,
    host: true,
    proxy: {
      '/api': {
        target: 'https://matakiri-website-revamp-backend.vercel.app/' || 'http://localhost:5000',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api/, '')
      }
    }
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
    // Add base URL if deploying to custom domain/subpath
    base: process.env.NODE_ENV === 'production' ? '/' : '/',
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
          ui: ['@heroicons/react', 'react-hot-toast', 'framer-motion'],
          forms: ['react-hook-form', 'yup', '@hookform/resolvers']
        }
      }
    }
  },
  // Optional: Configure preview server
  preview: {
    port: 3002,
    host: true
  }
})