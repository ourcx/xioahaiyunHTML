import { createRouter, createWebHistory } from 'vue-router'
import { checkPermission } from '@/utils/404'
import { useManagementStore } from '@/stores/management'
import { watch, toRaw } from 'vue'
import { useChatStore } from '@/stores/chat'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('@/views/home/home.vue'),
      meta: { requiresAuth: true },
      children: [
        {
          path: '/firstFile',
          name: 'firstFile',
          component: () => import('@/router/file/aside.vue'),
          children: [
            {
              path: '/firstFile/img',
              name: 'img',
              component: () => import('@/router/file/img.vue')
              //这里是应该懒加载写法，只有访问这个路由的时候才会加载
            },
            {
              path: '/firstFile/file',
              name: 'file',
              component: () => import('@/router/file/file.vue')
              //其他几个是可以复用的看你传的参数
            },
            {
              path: '/firstFile/mp4',
              name: 'mp4',
              component: () => import('@/router/file/file.vue')
            },
            {
              path: '/firstFile/mp3',
              name: 'mp3',
              component: () => import('@/router/file/file.vue')
            },
            {
              path: '/firstFile/other',
              name: 'other',
              component: () => import('@/router/file/file.vue')
            },
            {
              path: '/firstFile/doc',
              name: 'doc',
              component: () => import('@/router/file/file.vue')
            },
            {
              path: '/firstFile/speed',
              name: 'speed',
              component: () => import('@/router/speed/speed.vue')
            },
            {
              path: '/firstFile/recycle',
              name: 'recycle',
              component: () => import('@/router/file/recycle.vue')
            }
          ]
        },
        {
          path: '/send',
          name: 'send',
          component: () => import('@/router/send/sendAside.vue')
        },
        {
          path: '/collect',
          name: 'collect',
          component: () => import('@/router/send/collect.vue')
        },
        {
          path: '/ai',
          name: 'ai',
          component: () => import('@/views/aiTool/aitool.vue')
        },
        {
          path: '/conversation',
          name: 'conversation',
          component: () => import('@/router/conversation/aside.vue'),
          children: [
            {
              path: '/conversation/person',
              name: 'person',
              component: () => import('@/router/conversation/person.vue'),
              children: [
                {
                  path: '/conversation/person/window',
                  name: 'window',
                  component: () => import('@/router/conversation/window.vue')
                },
                {
                  path: '/conversation/person/group',
                  name: 'group',
                  component: () => import('@/router/conversation/Group.vue')
                }
              ]
            },
            {
              path: '/conversation/addrBook',
              name: 'addrBook',
              component: () => import('@/router/conversation/addrBook.vue'),
              children: [
                {
                  path: '/conversation/addrBook/card',
                  name: 'card',
                  component: () => import('@/router/conversation/card.vue')
                }
              ]
            }
          ]
        },
        {
          path: '/more',
          name: 'more',
          component: () => import('@/router/more/more.vue'),
          children: [
            {
              path: '/more',
              name: 'starting',
              component: () => import('@/router/more/storage.vue')
            },
            {
              path: '/more/relationship',
              name: 'relationship',
              component: () => import('@/router/more/relationship.vue')
            },
            {
              path: '/more/list',
              name: 'list',
              component: () => import('@/router/more/list.vue')
            }
          ]
        }
      ]
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('@/router/login/login.vue')
    },
    {
      path: '/req',
      name: 'req',
      component: () => import('@/router/login/req.vue')
    },
    {
      path: '/404',
      name: '404',
      component: () => import('@/views/home/err/404.vue')
    },
    {
      path: '/s',
      name: 's',
      component: () => import('@/views/share/ShareFile.vue')
    },
    {
      path: '/s/xxx',
      name: 'xxx',
      component: () => import('@/views/share/list.vue')
    },
    {
      path: '/preview',
      name: 'preview',
      component: () => import('@/views/preview/vue-offer.vue')
    },
    {
      path: '/previewMd',
      name: 'previewMd',
      component: () => import('@/views/preview/md-preview.vue')
    },
    {
      path: '/firstFile/mp4/videoPlay',
      name: 'videoPlay',
      component: () => import('@/views/home/videoPlay/videoMain.vue')
    },
    {
      path: '/server',
      name: 'user',
      component: () => import('@/views/home/userHome/user.vue'),
      children: [
        {
          path: '/server/main',
          name: 'userInfo',
          component: () => import('@/views/home/userHome/main.vue')
        },
        {
          path: '/server/phone',
          name: 'phone',
          component: () => import('@/views/home/userHome/phone.vue')
        },
        {
          path: '/server/password',
          name: 'password',
          component: () => import('@/views/home/userHome/password.vue')
        },
        {
          path: '/server/email',
          name: 'email',
          component: () => import('@/views/home/userHome/email.vue')
        },
        {
          path: '/server/longinProtect',
          name: 'loginProtect',
          component: () => import('@/views/home/userHome/longinProtect.vue')
        },
        {
          path: '/server/forget',
          name: 'forget',
          component: () => import('@/views/home/userHome/forgot.vue')
        },
        {
          path: '/server/location',
          name: 'location',
          component: () => import('@/views/home/userHome/location.vue')
        },
        {
          path: '/server/log',
          name: 'log',
          component: () => import('@/views/home/userHome/log.vue')
        }
      ]
    }
  ]
})

// 需要放行的路径列表
const EXEMPT_PATHS = ['/user/main', '/user/phone', '/user/password', '/user/email', '/s/xxx', '/s']
let loadingInstance = null
let startTime = 0

router.beforeEach(async (to, from, next) => {
  const isAuthenticated = localStorage.getItem('jwt')
  const ManagementStore = useManagementStore()
  // 白名单配置：不需要认证的路由
  const allowList = ['/login', '/req', '/404']

  // 1. 放行白名单路由
  if (allowList.includes(to.path)) {
    return next()
  }
  //不然你在login哪里还在认证，直接卡死了路由

  // 1. 登录认证检查
  if (isAuthenticated) {
    const isValid = await ManagementStore.sendJwtToBackend()
    if (!isValid) {
      return next('/login')
    }
  } else {
    return next('/login')
  }
  const chatStore = useChatStore()
  if (!chatStore.ws) {
    // 初始化 WebSocket 连接
    chatStore.initWebSocket()
  }

  // 2. 404 检查（同步）
  if (!checkPermission(to.path, to.query.id)) {
    return next('/404')
  }

  const shouldExempt = EXEMPT_PATHS.includes(to.path)
  if (shouldExempt) {
    // 直接放行这些路径
    return next()
  }

  // 3. 特定路由的业务逻辑检查
  if (to.path === '/conversation/person/group' || to.path === '/conversation/person/window') {
    if (ManagementStore.clickStaus.length === 0) {
      return next('/conversation/person')
    }
  } else if (to.path === '/conversation/addrBook/card') {
    // 为了可读性和微小的性能提升，可以先缓存这些变量
    const bookList = toRaw(ManagementStore.bookList)
    const query = to.query

    // 检查 query.id 是否存在于 bookList 中某个项目的 id 属性
    const idExists = bookList.some(item => item.id === query.id)

    // 检查 query.group 是否存在于 bookList 中某个项目的 id 属性
    // (如前所述，这里假设 query.group 应该与 item.id 比较是正确的逻辑)
    const groupAsIdExists = bookList.some(item => item.id === query.group)
    // 检查 query.name 是否存在于 bookList 中某个项目的 name 属性
    const nameExists = bookList.some(item => item.name === query.name)

    if (!idExists && !groupAsIdExists) {
      return next('/conversation/addrBook')
    }

    if (!nameExists) {
      return next('/conversation/addrBook')
    }
    //修改query回退
  }

  // 4. 异步数据加载
  // 条件1: 处理进入聊天页的逻辑
  if (to.path === '/conversation/person/window') {
    const chatStore = useChatStore()
    const targetId = to.query.id

    // 步骤1: 如果是来自其他聊天页，先保存旧数据
    if (from.path === '/conversation/person/window' && !(from.query.id == to.query.id)) {
      console.log(from.query.id)
      console.log(to.query.id)
      const prevId = from.query.id
      await saveAndClearData(prevId) // 先保存再清除
    } else if (from.path === '/conversation/person/group') {
      console.log('从群组到私聊，保存群组数据')
      const prevId = from.query.group
      console.log(prevId)
      await saveAndClearGroupData(prevId)
    }

    // 步骤2: 加载新数据
    try {
      const [privatemy, privatecon] = await Promise.all([
        chatStore.getData(targetId + 'my'),
        chatStore.getData(targetId + 'con')
      ])

      // 直接更新数据（无需 resetData）
      chatStore.$patch({ privateMy: privatemy, privateCon: privatecon })
    } catch (error) {
      console.error('加载数据失败:', error)
      return next('/404')
    }
  }

  // 4. 异步数据加载
  // 条件1: 处理进入聊天页的逻辑
  if (to.path === '/conversation/person/group') {
    const chatStore = useChatStore()
    const targetId = to.query.group

    // 步骤1: 如果是来自其他聊天页，先保存旧数据
    if (from.path === '/conversation/person/group' && !(from.query.group == to.query.group)) {
      console.log(from.query.group)
      console.log(to.query.group)
      const prevId = from.query.group
      await saveAndClearGroupData(prevId) // 先保存再清除
    } else if (from.path === '/conversation/person/window') {
      const prevId = from.query.id
      await saveAndClearData(prevId)
    }

    // 步骤2: 加载新数据
    try {
      chatStore.getHistory()

      // const [datamy, datacon] = await Promise.all([
      //   chatStore.getData(targetId + "my"),
      //   chatStore.getData(targetId + "con")
      // ]);

      // // 直接更新数据（无需 resetData）
      // chatStore.$patch({ dataMy: datamy, dataCon: datacon });
    } catch (error) {
      console.error('加载数据失败:', error)
      return next('/404')
    }
  }

  next()
})

// 公用保存逻辑
async function saveAndClearData (prevId) {
  const chatStore = useChatStore()
  const rawDataMy = toRaw(chatStore.privateMy)
  const rawDataCon = toRaw(chatStore.privateCon)

  await Promise.all([
    chatStore.saveData(prevId + 'my', rawDataMy),
    chatStore.saveData(prevId + 'con', rawDataCon)
  ])

  chatStore.resetData()
}

async function saveAndClearGroupData (prevId) {
  const chatStore = useChatStore()
  const rawDataMy = toRaw(chatStore.dataMy)
  const rawDataCon = toRaw(chatStore.dataCon)

  await Promise.all([
    chatStore.saveData(prevId + 'my', rawDataMy),
    chatStore.saveData(prevId + 'con', rawDataCon)
  ])
  chatStore.resetData()
}

// startTime = Date.now()
// //加载
//  // 关闭已有实例避免重复
//  if (loadingInstance) {
//   loadingInstance.close()
// }

// // 启动全屏加载
// loadingInstance = ElLoading.service({
//   lock: true,
//   text: '加载中...',
//   background: 'rgba(0, 0, 0, 0.7)',
//   spinner: 'el-icon-loading' // 使用 Element 内置图标
// })

// next()

// 全局后置守卫
router.afterEach(async (to, from) => {
  const shouldExempt = EXEMPT_PATHS.includes(to.path)

  if (shouldExempt) {
    console.log(`后置守卫放行: ${to.path}`)
    return // 直接返回，不执行后续逻辑
  }

  // 延迟关闭保证过渡效果
  const diffTime = Date.now() - startTime
  const delay = diffTime < 500 ? 500 - diffTime : 0

  setTimeout(() => {
    if (loadingInstance) {
      loadingInstance.close()
      loadingInstance = null
    }
  }, delay)
})

// 错误处理
router.onError(() => {
  if (loadingInstance) {
    loadingInstance.close()
    loadingInstance = null
  }
})

export default router
