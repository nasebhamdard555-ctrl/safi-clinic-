import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

// Relative base so the built app also works when served from any folder or preview host.
export default defineConfig({
  base: './',
  plugins: [react(), tailwindcss()],
});
