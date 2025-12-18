import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import tailwindcss from "@tailwindcss/vite";
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      "/api": {
        target: "http://190.119.200.124:54420",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ""),
      },
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          react: ["react", "react-dom"],
          framer: ["framer-motion"],
          mui: ["@mui/material", "@emotion/react", "@emotion/styled"],
          charts: ["recharts", "react-charts"],
        },
      },
    },
    chunkSizeWarningLimit: 1500,
  },
});
