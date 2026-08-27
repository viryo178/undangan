import { defineConfig } from 'vite'
import { copyFileSync } from 'node:fs'
import { resolve } from 'node:path'

export default defineConfig({
  plugins: [{
    name: 'github-pages-spa-fallback',
    closeBundle() {
      copyFileSync('dist/index.html', 'dist/404.html')
    },
  }],
  base: '/undangan/',
  build: {
    rollupOptions: {
      input: {
        index: resolve('index.html'),
        generator: resolve('generator.html'),
      },
    },
  },
})
