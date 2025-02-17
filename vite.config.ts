import path from 'path';

import react from '@vitejs/plugin-react';
import graphql from '@rollup/plugin-graphql';

import { defineConfig } from 'vite';

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    graphql(),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
