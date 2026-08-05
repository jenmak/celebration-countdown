import path from 'node:path'
import { fileURLToPath } from 'node:url'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import tsconfigPaths from 'vite-tsconfig-paths'

const root = fileURLToPath(new URL('.', import.meta.url))

export default defineConfig({
  plugins: [react(), tsconfigPaths()],
  resolve: {
    alias: {
      '@': path.resolve(root, 'src'),
      '@components': path.resolve(root, 'src/components'),
      '@hooks': path.resolve(root, 'src/hooks'),
      '@routes': path.resolve(root, 'src/routes'),
      '@utils': path.resolve(root, 'src/utils'),
      '@views': path.resolve(root, 'src/views'),
    },
  },
  server: {
    port: 3000,
  },
})
