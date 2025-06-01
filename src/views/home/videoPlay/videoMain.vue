<template>
  <el-header height="60px">
    <div class="header-container">
      <el-page-header :icon="ArrowLeft" @back="onBack">
        <template #content>
          <div class="flex items-center">
            <el-avatar :size="32" class="mr-3" :src="MasterPinia.avatar" />
            <span class="text-large font-600 mr-3"> {{ MasterPinia.name }} </span>
            <el-tag>安全</el-tag>
          </div>
        </template>
        <template #extra>
          <div class="flex items-center">
            <el-button>控制</el-button>
            <el-button type="primary" class="ml-2">编辑</el-button>
          </div>
        </template>
      </el-page-header>
    </div>
  </el-header>
  <!-- 使用 ref 绑定播放器容器 -->
  <el-main>
    <div class="player-title">
      <span>{{ route.query.name }}<span class="add">下载</span></span>
      <p>{{ route.query.date }}/{{ MasterPinia.name }}/{{ route.query.size }}</p>
    </div>
    <div ref="playerContainer" class="player-container"></div>
  </el-main>
  <el-aside width="260px">
    <div class="demo-image__lazy">
      <div class="items" v-for="url in urls" :key="url" @click="setActive(url)">
        <el-image :src="''" lazy> <!-- 设置空 src 使图片加载失败 -->
          <template #error>
            <div class="mask">
              <p>{{ url.name }} </p><!-- 直接显示 url.name -->
            </div>
          </template>
        </el-image>

        <!-- 遮罩层（根据需求决定是否保留） -->
        <div class="image-mask">
          <span class="mask-text">
            <P>{{ url.name }}</P>
            <el-image src="https://s2.loli.net/2025/04/09/B93AzHcSsqGNWQi.png"
              style="width: 30px; height: 30px; position: relative;" />
          </span>
          <i class="el-icon-view mask-icon"></i>
        </div>
      </div>
    </div>
  </el-aside>
</template>

<script setup>
import { ref, onMounted, watch, onBeforeUnmount } from 'vue'
import Player from 'xgplayer'
import 'xgplayer/dist/index.min.css'
import { useMasterPinia } from '@/stores/masterPinia'
import apiClient from '@/utils/api'
import { useRoute } from 'vue-router'
import { useRouter } from 'vue-router'
import { useFileTreeStore } from '@/stores/tree/fileTree';
import { set } from 'vue-demi'
const FileTreaeStore = useFileTreeStore()

// --- Vue 3 Composition API 实现 ---
const playerContainer = ref(null)  // DOM 引用
const player = ref(null)           // 播放器实例
const MasterPinia = useMasterPinia()
const route = useRoute()
const videoUrl = ref('')
const router = useRouter()

// 播放器配置（动态响应式）
const playerConfig = ref({
  id: "mse",
  url: '', // 动态更新
  playsinline: true,
  poster: '',
  lang: "zh-cn",
  airplay: true,
  fluid: true,
  playbackRate: [0.5, 0.75, 1, 1.5, 2],
  thumbnail: {
    pic_num: 44,
    width: 160,
    height: 90,
    col: 10,
    row: 10,
  },
  videoAttributes: {
    crossOrigin: "anonymous"
  },
  download: {
    url: '',
    name: ''
  }
})

// 获取视频地址
const fetchVideoUrl = async () => {
  try {
    const response = await apiClient.post('/files/Dscribe', {
      filename: decodeURIComponent(route.query.style)
    })

    if (!response.data?.previewURL) {
      throw new Error('无效的视频地址')
    }

    console.log('视频地址:', response.data.previewURL)

    // 正确编码处理：仅编码路径部分
    const rawUrl = response.data.previewURL
    const [base, query] = rawUrl.split('?')
    const encodedUrl = query
      ? `${base}?${new URLSearchParams(query).toString()}`
      : base

    videoUrl.value = encodedUrl
  } catch (err) {
    console.error('视频加载失败:', err)
    handleError(err)
  }
}

// 初始化播放器
const initPlayer = () => {
  destroyPlayer() // 先销毁旧实例

  if (!playerContainer.value) return

  player.value = new Player({
    ...playerConfig.value,
    el: playerContainer.value,
    url: videoUrl.value,
    download: {
      url: videoUrl.value,
      name: route.query.name || 'video'
    }
  })

  // 事件监听
  player.value.on('ready', () => {
    console.log('播放器准备就绪')
    player.value.poster = videoUrl.value + '?vframe=jpg/offset/1'
  })

  player.value.on('error', (err) => {
    console.error('播放错误:', err)
    handleError(err)
  })
}

// 销毁播放器
const destroyPlayer = () => {
  if (player.value) {
    player.value.destroy()
    player.value = null
  }
}

// 响应URL变化
watch(videoUrl, (newVal) => {
  if (newVal) {
    initPlayer()
  }
})

// 生命周期
onMounted(async () => {
  await fetchVideoUrl()
})

onBeforeUnmount(() => {
  destroyPlayer()
})

// 错误处理
const handleError = (error) => {
  console.error('视频播放错误:', {
    code: error.code,
    message: error.message,
    src: videoUrl.value
  })
}

//侧表跳转
const setActive = (item) => {
  console.log(item)
  if (item.basePath) {
    router.push({
      path: '/firstFile/mp4/videoPlay',
      query: {
        style: item.basePath + item.name,
        type: item.type,
        name: item.name,
        date: item.date,
        size: item.size,
      }
    })
    window.location.reload()
    return
  }
  router.push({
    path: '/firstFile/mp4/videoPlay',
    query: {
      style: FileTreaeStore.routeArr.slice(2).join('/') + '/' + item.name,
      type: item.type,
      name: item.name,
      date: item.date,
      size: item.size,
    }
  })
    window.location.reload()
}

const onBack = () => {
  window.history.back()
  //强制刷新
  setTimeout(() => {window.location.reload()},500)

}

const urls = FileTreaeStore.result
</script>

<style scoped>
/* 响应式布局方案 */
.player-container {
  width: 100%;
  max-width: 1800px;
  /* 最大宽度限制 */

  /* 保持比例 */
  margin: 0 auto;
  background: #000;
  /* 黑边填充 */
}

.el-main {
  top: 5px;
  width: 150vh;
  height: 775px;
  position: relative;
  z-index: 1000;
  scrollbar-width: none;
  -ms-overflow-style: none;
  overflow-x: hidden;
  overflow-y: auto;
}

.el-aside {
  height: 100%;
  position: fixed;
  right: 0;
  box-shadow: -5px 0 20px rgba(150, 150, 150, 0.5);
}

.el-header {
  top: 0;
  position: fixed;
  width: 100%;
  box-shadow: 60px 0 30px rgba(150, 150, 150, 0.5);
  z-index: 1008;
  left: 0px;
  backdrop-filter: blur(50px);
}

.header-container {
  margin-top: 15px;
  position: relative;
  width: 100%;
  color: #000;
}

.items-center {
  align-items: center;
  display: flex;
  justify-content: space-between;
  gap: 10px;
}

/* 移动端适配 */
@media (max-width: 768px) {
  .player-container {
    max-width: 100%;
    height: auto;
  }
}


.player-title {
  color: black;
  display: flex;
  width: 100%;
  height: 60px;
  display: flex;
  flex-direction: column;
}

.player-title span {
  font-size: larger;
  font-weight: 1000;
  font-size: 25px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}

.player-title p {
  width: 100%;
  font-size: 10px;
  color: #757575;
}

.add {
  right: 0;
  height: auto;
  position: relative;
}

.demo-image__lazy {
  padding-left: 15px;
  padding-right: 15px;
  height: 100%;
  overflow-y: auto;
  scrollbar-width: none;
  -ms-overflow-style: none;
  overflow-x: hidden;
  overflow-y: auto;
}



.demo-image__lazy .items {
  width: 100%;
  margin-bottom: 30px;
  overflow: hidden;
  box-shadow: 60px 0 30px rgba(150, 150, 150, 0.5);
  border-radius: 10px;
  height: 15%;
}

.mask {
  color: #000;
  display: flex;
  justify-content: center;
  align-content: center;
  justify-items: center;
  align-items: center;
  width: 100%;
  height: 100%;
}

.demo-image__lazy .items:first-child {
  margin-top: 30px;
}

.demo-image__lazy .item:last-child {
  margin-bottom: 0;
}

/* 容器设置相对定位 */
.items {
  position: relative;
  display: inline-block;
  /* 根据布局需要调整 */
  margin: 5px;
  overflow: hidden;
}

/* 遮罩层样式 */
.image-mask {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  opacity: 0;
  transition: opacity 0.3s ease;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: white;
  cursor: pointer;
}

/* 悬停效果 */
.items:hover .image-mask {
  opacity: 1;
}

/* 遮罩层内容样式 */
.mask-text {
  font-size: 1.2em;
  margin-bottom: 8px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.mask-text p {
  font-size: small;
  margin-bottom: 8px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  width: 80%;
}

.mask-icon {
  font-size: 1.5em;
  animation: zoom 0.6s ease infinite alternate;
}

@keyframes zoom {
  from {
    transform: scale(1);
  }

  to {
    transform: scale(1.2);
  }
}

/* 确保图片容器尺寸正确 */
.el-image {
  display: block;
  width: 100%;
  height: 100%;
}
</style>
