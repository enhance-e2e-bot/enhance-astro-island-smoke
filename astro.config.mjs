import react from "@astrojs/react";
import { defineConfig } from "astro/config";

export default defineConfig({
  integrations: [react()],
  server: {
    host: "127.0.0.1",
    port: 4231,
    // Bind exactly 4231 (the port the e2e harness points the playground at).
    // Without this Astro silently increments to the next free port on a busy
    // 4231, which would leave the test waiting on a port nothing serves.
    strictPort: true
  },
  vite: {
    server: {
      port: 4231,
      strictPort: true,
      hmr: {
        host: "127.0.0.1",
        port: 4231,
        protocol: "ws"
      }
    }
  }
});
