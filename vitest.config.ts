import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

const local = (path: string) => fileURLToPath(new URL(path, import.meta.url));

export default defineConfig({
  resolve: {
    alias: {
      "@": local("./"),
      // Next resolves `server-only` to a no-op under the react-server condition; tests need the same.
      "server-only": local("./node_modules/server-only/empty.js"),
    },
  },
  test: { include: ["**/*.test.ts"], exclude: ["node_modules/**", ".next/**"] },
});
