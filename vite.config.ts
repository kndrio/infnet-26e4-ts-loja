import { defineConfig } from "vite";

// [Etapa 8.4] Source maps: no "npm run dev" já vêm ligados.
// No build, sourcemap: true gera os .map para depurar o código publicado
// mostrando o TypeScript original no DevTools.
export default defineConfig({
  build: {
    sourcemap: true,
  },
});
