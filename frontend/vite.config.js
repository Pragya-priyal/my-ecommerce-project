import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // Forward all /api requests to backend
      "/api": {
        target: "http://localhost:5000",
        changeOrigin: true,
      },
      // Forward uploads requests (for images)
      "/uploads": {
        target: "http://localhost:5000",
        changeOrigin: true,
      },
    },
  },
});
