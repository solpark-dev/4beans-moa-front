import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import fs from "fs";
import path from "path";

export default defineConfig({
  plugins: [react(), tailwindcss()],

  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },

  server: {
    host: true,
    https: {
      pfx: fs.readFileSync("./moa-ssl.p12"),
      passphrase: "moa1234",
    },
    // hmr: {
    //   host: "192.168.55.115.nip.io",
    //   protocol: "wss",
    //   clientPort: 5173,
    // },
    proxy: {
      "/api": {
        target: "https://localhost:8443",
        changeOrigin: true,
        secure: false,
        // ========== 여기부터 추가 (디버깅용) ==========
        rewrite: (path) => {
          console.log('Proxying:', path); // 프록시가 작동하는지 확인
          return path;
        },
        configure: (proxy, _options) => {
          // 프록시 에러 발생시 로그
          proxy.on('error', (err, _req, _res) => {
            console.log('proxy error', err);
          });
          // 요청 보낼 때 로그
          proxy.on('proxyReq', (proxyReq, req, _res) => {
            console.log('Sending Request:', req.method, req.url);
          });
          // 응답 받을 때 로그
          proxy.on('proxyRes', (proxyRes, req, _res) => {
            console.log('Received Response:', proxyRes.statusCode, req.url);
          });
        },
        // ========== 여기까지 추가 ==========
      },
      "/uploads": {
        target: "https://localhost:8443",
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
