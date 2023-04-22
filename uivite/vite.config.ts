import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
        //Focus here
        '/api': {
            target: 'http://localhost:8080',
            changeOrigin: true,
            rewrite: (path) => { console.log(path.replace('/api/', '/')); return path.replace('/api/', '/') }
        }
    }
}
})
