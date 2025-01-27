import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ mode }) => {
  // Load environment variables based on the mode (e.g., 'development' or 'production')
  const env = loadEnv(mode, process.cwd(), '')

  const port = env.VITE_PORT ? parseInt(env.VITE_PORT) : 5173

  return {
    plugins: [react()],
    server: {
      port,
      open: true, // Automatically open the browser
    },
    resolve: {
      extensions: ['.js', '.ts', '.jsx', '.tsx'],
    },
    build: {
      rollupOptions: {
        input: '/src/main.tsx',
      },
    },
    optimizeDeps: {
      include: ['@mui/x-date-pickers', 'date-fns'],
    },
  }
})
