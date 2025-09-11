import { defineConfig } from "vite";
import path from "path";
import react from "@vitejs/plugin-react";
import crypto from "crypto";

export default defineConfig({
  plugins: [react()],
  // Alias for src folder
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  // Updating naming convention for SCSS/CSS Modules class names
  css: {
    modules: {
      generateScopedName: (className, filePath) => {
        const cleaned = path
          .basename(filePath)
          .replace(/\.module/, "") // Remove '.module'
          .replace(/\.[^/.]+$/, "") // Remove extension
          .replace(/([a-z0-9])([A-Z])/g, "$1_$2") // camelCase or PascalCase → snake_case
          .replace(/[-\s]+/g, "_") // kebab-case or spaces → snake_case
          .toLowerCase(); // Final lowercase

        const hash = crypto
          .createHash("sha256")
          .update(`${cleaned}_${className}`)
          .digest("hex")
          .slice(0, 5);

        return `${cleaned}_${className}__${hash}`;
      },
    },
  },
  server: {
    port: 5173,
    strictPort: true,
    allowedHosts: ["math-discussion-dev.aplance.com"], ///update this before deployment
  },
  preview: {
    port: 5173,
    strictPort: true,
    allowedHosts: ["math-discussion-dev.aplance.com"], ///update this before deployment
  },
});
