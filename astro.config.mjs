import react from "@astrojs/react";
import { defineConfig } from "astro/config";

export default defineConfig({
  integrations: [react()],
  server: {
    host: "127.0.0.1",
    port: 4231
  },
  vite: {
    server: {
      hmr: {
        host: "127.0.0.1",
        port: 4231,
        protocol: "ws"
      }
    }
  }
});
