import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  // ⚡️ Vercel ke liye base ki zarurat nahi hai
})

