import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
const PACKAGE = require('./package.json')

const prodUrl = PACKAGE.production.url + '/' + PACKAGE.name + '@' + PACKAGE.version +  '/dist/'
// https://vite.dev/config/


export default defineConfig({
  plugins: [
    vue(),
    vueDevTools(),
  ],
  envPrefix: 'SSO_',
  experimental: {
	  renderBuiltUrl(filename, hostType) {
	      return prodUrl + filename
	  }
  },
  build: {
    rollupOptions: {
      output: {
        entryFileNames: `assets/[name].js`,
        chunkFileNames: `assets/[name].js`,
        assetFileNames: `assets/[name].[ext]`,
      }
    }
  },
  server: {
      port: 3000
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
  },
})
