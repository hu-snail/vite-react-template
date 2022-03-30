const path = require("path");

import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// 按需加载
import vitePluginForArco from "@arco-plugins/vite-react";

const { plugin: mdPlugin, Mode } = require("vite-plugin-markdown");
import hljs from "highlight.js";

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
    vitePluginForArco(),
    mdPlugin({
      mode: [Mode.HTML, Mode.TOC, Mode.REACT],
      markdownIt: {
        html: true,
        linkify: false,
        typographer: true,
        highlight: function (str, lang) {
          if (lang && hljs.getLanguage(lang)) {
            try {
              return (
                '<pre class="hljs"><code>' +
                hljs.highlight(lang, str, true).value +
                "</code></pre>"
              );
            } catch (__) {}
          }

          return (
            '<pre class="hljs"><code>' +
            hljs.highlight(lang, str, true).value +
            "</code></pre>"
          );
        },
      },
    }),
  ],
  css: {
    preprocessorOptions: {
      less: {
        additionalData: `@import "${path.resolve(
          __dirname,
          "src/styles/variable.less"
        )}";`,
        // 支持内联 JavaScript
        javascriptEnabled: true,
      },
    },
  },
});
