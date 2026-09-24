import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// El proxy reenvía /api al backend: el navegador ve un solo origen y se evitan problemas de CORS.
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      "/api": "http://localhost:3000",
    },
  },
});
