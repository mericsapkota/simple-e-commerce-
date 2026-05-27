import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      "/esewa-status": {
        target: "https://rc.esewa.com.np",
        changeOrigin: true,
        secure: true,
        rewrite: (path) => path.replace(/^\/esewa-status/, "/api/epay/transaction/status/"),
      },
    },
  },
});
