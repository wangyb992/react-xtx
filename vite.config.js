import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import { fileURLToPath } from 'node:url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, __dirname, '')

  return {
    base: env.VITE_CDN_BASE_URL || '/',
    plugins: [react()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'src'),
        '@components': path.resolve(__dirname, 'src/components'),
        '@assets': path.resolve(__dirname, 'src/assets'),
        '@views': path.resolve(__dirname, 'src/views'),
        '@router': path.resolve(__dirname, 'src/router'),
        '@api': path.resolve(__dirname, 'src/api'),
        '@utils': path.resolve(__dirname, 'src/utils'),
      }
    },
    build: {
      cssCodeSplit: true,
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (!id.includes('node_modules')) return
            if (id.includes('antd') || id.includes('@ant-design') || id.includes('rc-')) return 'antd'
            if (id.includes('@ant-design/icons') || id.includes('react-icons') || id.includes('@tabler/icons-react')) return 'icons'
            if (id.includes('react-router')) return 'router'
            if (id.includes('zustand')) return 'state'
            if (id.includes('axios') || id.includes('dayjs')) return 'request'
            if (id.includes('react-dom') || id.includes('react/jsx-runtime') || id.endsWith('/react/index.js')) return 'react-core'
            if (id.includes('react-use') || id.includes('@reactuses')) return 'react-hooks'
            return 'vendor'
          }
        }
      }
    }
  }
})
