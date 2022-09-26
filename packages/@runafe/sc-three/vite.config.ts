import { defineConfig } from "vite";
import { resolve } from "path";

import Vue from "@vitejs/plugin-vue";

const root = process.cwd();

function pathResolve(dir: string) {
  return resolve(root, ".", dir);
}

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [Vue()],
  resolve: {
    alias: [
      {
        find: "@",
        replacement: `${pathResolve('src')}/`
    },
    ],
  },
});
