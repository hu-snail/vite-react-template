const path = require("path");

import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

import vitePluginImp from "vite-plugin-imp";

// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      "~": path.resolve(__dirname, "./"), // 根路径
      "@": path.resolve(__dirname, "src"), // src 路径
    },
  },
  plugins: [
    react(),
    vitePluginImp({
      libList: [
        {
          libName: "@arco-design/web-react",
          style: (name) => {
            return [
              "@arco-design/web-react/lib/style/index.less",
              `@arco-design/web-react/lib/${name}/style/index.less`,
            ];
          },
        },
      ],
    }),
  ],
  css: {
    preprocessorOptions: {
      less: {
        // 支持内联 JavaScript
        javascriptEnabled: true,
      },
    },
  },
});
