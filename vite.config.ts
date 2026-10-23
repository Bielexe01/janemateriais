import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { renderHeadTags, renderNoscript } from './src/seo/head.ts'

/**
 * Gera title, meta description, Open Graph, Schema.org e o preload da imagem
 * principal a partir de src/config/site.ts (fonte única dos dados da loja).
 */
function siteHead(): Plugin {
  return {
    name: 'jane-site-head',
    transformIndexHtml: {
      order: 'pre',
      handler(html) {
        return html
          .replace('<!--app-head-->', renderHeadTags())
          .replace('<!--app-noscript-->', renderNoscript())
      },
    },
  }
}

export default defineConfig({
  plugins: [react(), tailwindcss(), siteHead()],
  server: { host: '127.0.0.1', port: 5173 },
  preview: { host: '127.0.0.1', port: 4173 },
  build: { target: 'es2022' },
})
