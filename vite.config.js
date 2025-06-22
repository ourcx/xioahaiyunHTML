import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
// vite.config.js
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueDevTools(),
    AutoImport({
      resolvers: [ElementPlusResolver()],
    }),
    Components({
      resolvers: [ElementPlusResolver({ importStyle: 'sass' })],
    }),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
  },
  css: {
    preprocessorOptions: {
      scss: {
        // 自动导入定制化样式文件进行样式覆盖
        additionalData: `
          @use "@/styles/element/index.scss" as *;
        `,
      }
    }
  },
  server: {
    proxy: {
      '/user/userLongin': {
        target: 'http://127.0.0.1:8085',
        changeOrigin: true,
      },
      '/user/userReq': {
        target: 'http://127.0.0.1:8085',
        changeOrigin: true,
      },
      '/chat': {
        target: 'http://localhost:8085',
        changeOrigin: true,
        ws: true, // 关键配置：代理 WebSocket
        pathRewrite: {
          '^/chat': '/chat'
        }
      },
      '/user/parseJwt': {
        target: 'http://localhost:8085',
        changeOrigin: true,
      },
      '/chat/getGroupHistory': {
        target: 'http://localhost:8085',
        changeOrigin: true,
      },
      '/profiles/GetProfile': {
        target: 'http://localhost:8085',
        changeOrigin: true,
      },
      '/profiles/getRBook': {
        target: 'http://localhost:8085',
        changeOrigin: true,
      },
      '/user/sendEmail': {
        target: 'http://localhost:8085',
        changeOrigin: true,
      },
      '/profiles/PostProfile': {
        target: 'http://localhost:8085',
        changeOrigin: true,
      },
      '/profiles/upUserName': {
        target: 'http://localhost:8085',
        changeOrigin: true,
      },
      '/files/ReplayFile': {
        target: 'http://localhost:8085',
        changeOrigin: true,
      },
      '/files/baseData': {
        target: 'http://localhost:8085',
        changeOrigin: true,
      },
      '/files/RenameFile': {
        target: 'http://localhost:8085',
        changeOrigin: true,
      },
      '/files/treeFIle': {
        target: 'http://localhost:8085',
        changeOrigin: true,
      },
      '/share/getUrl': {
        target: 'http://localhost:8085',
        changeOrigin: true,
      },
      '/user/checked': {
        target: 'http://localhost:8085',
        changeOrigin: true,
      },
      '/files/special': {
        target: 'http://localhost:8085',
        changeOrigin: true,
      },
      '/files/Dscribe': {
        target: 'http://localhost:8085',
        changeOrigin: true,
      },
      '/files/imgDate': {
        target: 'http://localhost:8085',
        changeOrigin: true,
      },
      '/files/imgData': {
        target: 'http://localhost:8085',
        changeOrigin: true,
      },
      '/data/total': {
        target: 'http://localhost:8085',
        changeOrigin: true,
      },
      '/AI/chat': {
        target: 'http://localhost:8085',
        changeOrigin: true,
      },
      '/files/AddFolder': {
        target: 'http://localhost:8085',
        changeOrigin: true,
      },
      '/data/shareData': {
        target: 'http://localhost:8085',
        changeOrigin: true,
      },
      '/profiles/search': {
        target: 'http://localhost:8085',
        changeOrigin: true,
      },
      '/profiles/relationApply': {
        target: 'http://localhost:8085',
        changeOrigin: true,
      },
      '/files/removeFIleName': {
        target: 'http://localhost:8085',
        changeOrigin: true,
      },
      '/data/proportion': {
        target: 'http://localhost:8085',
        changeOrigin: true,
      },
      '/files/move': {
        target: 'http://localhost:8085',
        changeOrigin: true,
      },
      '/pwd/passwordChange': {
        target: 'http://localhost:8085',
        changeOrigin: true,
      },
      '/files/copy': {
        target: 'http://localhost:8085',
        changeOrigin: true,
      },
      '/files/ForDescribe': {
        target: 'http://localhost:8085',
        changeOrigin: true,
      },
      '/files/init': {
        target: 'http://localhost:8085',
        changeOrigin: true,
      },
      '/trash/TrashList': {
        target: 'http://localhost:8085',
        changeOrigin: true,
      },
      '/trash/RecoverFile': {
        target: 'http://localhost:8085',
        changeOrigin: true,
      },
      '/trash/deleteTrash': {
        target: 'http://localhost:8085',
        changeOrigin: true,
      },
      "/email/sendEmail": {
        target: 'http://localhost:8085',
        changeOrigin: true,
      },
      '/profiles/forgetPwd': {
        target: 'http://localhost:8085',
        changeOrigin: true,
      },
      '/data/logins': {
        target: 'http://localhost:8085',
        changeOrigin: true,
      },
      '/data/relationD3': {
        target: 'http://localhost:8085',
        changeOrigin: true,
      },
      '/files/Url':{
        target: 'http://localhost:8085',
        changeOrigin: true,
      },
      '/share/download':{
        target: 'http://localhost:8085',
        changeOrigin: true,
      },
      '/share/create':{
        target: 'http://localhost:8085',
        changeOrigin: true,
      },
      '/share/deleteShare':{
        target: 'http://localhost:8085',
        changeOrigin: true,
      }
    }
  },


})
