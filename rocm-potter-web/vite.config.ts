import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  define: {
    global: "globalThis",
    "process.env": {},
    "process.platform": JSON.stringify("browser"),
    "process.version": JSON.stringify("v20.0.0"),
    "process.cwd": "(() => '/')",
    "process.exit": "(() => {})",
  },
  resolve: {
    alias: {
      process: "process/browser",
    },
  },
  server: {
    port: 5173,
  },
});
