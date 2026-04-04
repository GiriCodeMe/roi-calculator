import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import istanbul from 'vite-plugin-istanbul'

export default defineConfig({
  plugins: [
    react(),
    istanbul({
      include: ['src/components/**', 'src/utils/**'],
      exclude: ['node_modules', 'src/test/**'],
      extension: ['.js', '.jsx'],
      requireEnv: true,           // only instruments when VITE_COVERAGE=true
      forceBuildInstrument: true, // instrument production builds too
    }),
  ],
  test: {
    environment: 'jsdom',
    setupFiles: './src/test/setup.js',
    globals: true,
    exclude: ['**/node_modules/**', '**/e2e/**'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html', 'json-summary', 'lcov'],
      include: ['src/components/**/*.{js,jsx}', 'src/utils/**/*.{js,jsx}'],
      exclude: ['src/test/**'],
      thresholds: {
        lines: 95,
        functions: 95,
        branches: 95,
        statements: 95,
      },
    },
  },
})
