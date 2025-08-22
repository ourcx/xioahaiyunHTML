import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'

// 后端API基础地址
const API_BASE_URL = 'http://localhost:8085'

// 通用代理配置
const createProxy = (path) => ({
  target: API_BASE_URL,
  changeOrigin: true,
})

// WebSocket代理特殊配置
const createWebSocketProxy = (path) => ({
  ...createProxy(path),
  ws: true,
})

// API路径列表
const API_PATHS = [
  '/user/userLongin',
  '/user/userReq',
  '/user/parseJwt',
  '/user/sendEmail',
  '/user/checked',
  '/chat/getGroupHistory',
  '/profiles/GetProfile',
  '/profiles/getRBook',
  '/profiles/PostProfile',
  '/profiles/upUserName',
  '/profiles/search',
  '/profiles/relationApply',
  '/profiles/forgetPwd',
  '/files/ReplayFile',
  '/files/baseData',
  '/files/RenameFile',
  '/files/treeFIle',
  '/files/special',
  '/files/Dscribe',
  '/files/imgDate',
  '/files/imgData',
  '/files/AddFolder',
  '/files/removeFIleName',
  '/files/move',
  '/files/copy',
  '/files/ForDescribe',
  '/files/init',
  '/files/Url',
  '/share/getUrl',
  '/share/download',
  '/share/create',
  '/share/deleteShare',
  '/outShare/access',
  '/data/total',
  '/data/shareData',
  '/data/proportion',
  '/data/logins',
  '/data/relationD3',
  '/AI/chat',
  '/pwd/passwordChange',
  '/trash/TrashList',
  '/trash/RecoverFile',
  '/trash/deleteTrash',
  '/email/sendEmail'
]

// 生成代理配置
const generateProxies = () => {
  const proxies = {}

  // 普通API代理
  API_PATHS.forEach(path => {
    proxies[path] = createProxy(path)
  })

  // WebSocket特殊处理
  proxies['/chat'] = createWebSocketProxy('/chat')

  return proxies
}

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
    proxy: generateProxies()
  }
})
