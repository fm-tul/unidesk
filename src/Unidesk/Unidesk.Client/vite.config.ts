import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import mkcert from "vite-plugin-mkcert";
import checker from "vite-plugin-checker";
import tsconfigPaths from "vite-tsconfig-paths";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [tsconfigPaths(), checker({ typescript: true }), mkcert(), react()],
  server: {
    port: 3399,
    https: true,
    strictPort: true,
    proxy: {
      '/api': {
        target: 'https://localhost:3400',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api/, '/api'),
      },
    },
  },
});
