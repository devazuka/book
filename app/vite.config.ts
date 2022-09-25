import { defineConfig } from 'vite'
import solidPlugin from 'vite-plugin-solid'
import { viteSingleFile } from 'vite-plugin-singlefile'
import { createHtmlPlugin } from 'vite-plugin-html'
import viteCompression from 'vite-plugin-compression'
import WindiCSS from 'vite-plugin-windicss'

const page = process.env.PAGE || 'index'

export default defineConfig({
  plugins: [
    solidPlugin(),
    WindiCSS({ config: { attributify: { prefix: 'w' }} }),
    viteSingleFile(),
    createHtmlPlugin({
      minify: true,
      pages: [
        { entry: `src/${page}.tsx`, template: `${page}.html`, filename: `${page}.html` },
      ]
    }),
    viteCompression({ ext: '.br', algorithm: 'brotliCompress' }),
  ],
  server: { port: 3000 },
  build: {
    minify: 'terser',
    polyfillModulePreload: false,
    cssCodeSplit: false,
    outDir: '../pb_public',
    assetsInlineLimit: 2**16,
  },
})
