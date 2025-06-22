<script setup>
import { ref, onMounted, nextTick } from 'vue'
import apiClient from '@/utils/api'
import { throttle } from 'lodash-es'
const url =
  'https://fuss10.elemecdn.com/a/3f/3302e58f9a181d2509f3dc0fa68b0jpeg.jpeg'
const srcList = ref({})

const isActive = ref('')
let index = 4
// 存储内容块DOM引用
const contentRefs = ref(new Map())
const activeIndex = ref('1')
let base = null
//时间线
const timeline = ref([
])
//图片请求
const currentPage = ref(0)
const pageSize = 4


// 存储所有 el-image 实例的引用
const imageRefs = ref([]);
// 设置内容块引用
const setContentRef = (el, date) => {
  if (el) {
    contentRefs.value.set(date, el)
  }
}
// 点击缩略图时，调用对应实例的 showPreview()
const handlePreview = (index) => {
  if (imageRefs.value[index]) {
    imageRefs.value[index].showPreview();
  }
};
//滑动
const scrollToDate = async (date) => {
  await nextTick() // 确保DOM更新完成
  const targetEl = contentRefs.value.get(date)
  if (targetEl) {
    targetEl.scrollIntoView({
      behavior: 'smooth',
      block: 'start'
    })
    isActive.value = date;
    // 添加临时高亮效果
    targetEl.classList.add('highlight')
    setTimeout(() => {
      targetEl.classList.remove('highlight')
    }, 1000)
  }
}

//图片预览的插件
const download = (index) => {
  const url = srcList[index]
  const suffix = url.slice(url.lastIndexOf('.'))
  const filename = Date.now() + suffix

  fetch(url)
    .then((response) => response.blob())
    .then((blob) => {
      const blobUrl = URL.createObjectURL(new Blob([blob]))
      const link = document.createElement('a')
      link.href = blobUrl
      link.download = filename
      document.body.appendChild(link)
      link.click()
      URL.revokeObjectURL(blobUrl)
      link.remove()
    })
}


//加载
const loading = ref(true);
onMounted(() => loading.value = false)




const timelineData = async () => {
  await apiClient.get('/files/imgDate').then(res => {
    console.log(res.data.data)
    let NOtime = [...new Set(res.data.data)]
    NOtime.sort(function (a, b) {
      return new Date(b) - new Date(a)
    });
    timeline.value = NOtime
  })
}


const loadMoreData = throttle(async () => {
  if (currentPage.value * pageSize >= timeline.value.length) {
    clearTimeout(base)
    return
  }

  try {
    loading.value = true

    // 获取当前页数据
    const dates = timeline.value.slice(
      currentPage.value * pageSize,
      (currentPage.value + 1) * pageSize
    )

    // 并行请求处理
    await Promise.all(dates.map(async (date) => {
      if (srcList.value[date]) return // 已加载过的不重复加载

      const imgRes = await apiClient.post('/files/imgData', { date })
      const urls = await Promise.all(
        imgRes.data.data.map(async (img) => {
          const descRes = await apiClient.post('/files/Dscribe', {
            filename: img.name.replace('users/14/', '')
          })
          return descRes.data.previewURL
        })
      )

      // 响应式更新
      srcList.value = {
        ...srcList.value,
        [date]: urls
      }
    }),
      currentPage.value++)
  } catch (error) {
    console.error('加载失败:', error)
  } finally {
    loading.value = false
  }
}, 3000, { trailing: true })

onMounted(async () => {
  await timelineData()
  base = setTimeout(() => {
    loadMoreData()
  }, 100)
})

</script>


<template>
  <el-main>
    <el-scrollbar height="100%" class="el-scrollbar" min-size="10" width="100%" @scroll.native="loadMoreData">
      <div class="demo-image__preview">
        <el-header>
          <el-menu :default-active="activeIndex" class="el-menu-demo" mode="horizontal">
            <el-menu-item index="1">时光轴</el-menu-item>
            <el-menu-item index="2
            ">最近上传</el-menu-item>
          </el-menu>
        </el-header>
        <transition-group name="fade" tag="div">
          <div class="time" v-for="(date, index) in timeline" :key="index" :ref="el => setContentRef(el, date)">
            <div class="timeLine">
              <p>{{ date }}</p>
              <div class="Line"></div>
            </div>
            <div>
              <el-image v-for="(url, imgIndex) in srcList[date] || []" :key="url" style="width: 100px; height: 100px"
                :src="url" hide-on-click-mode :preview-src-list="srcList[date]" :initial-index="imgIndex" fit="cover"
                :zoom-rate="1.2" :max-scale="7" :min-scale="0.2" :preview-teleported="true" lazy
                @click="handlePreview(imgIndex)" v-loading="loading" element-loading-text="加载中...">
                <template #toolbar="{ actions, prev, next, reset, activeIndex, setActiveItem }">
                  <el-icon @click="prev">
                    <Back />
                  </el-icon>
                  <el-icon @click="next">
                    <Right />
                  </el-icon>
                  <el-icon @click="actions('zoomOut')">
                    <ZoomOut />
                  </el-icon>
                  <el-icon @click="actions('zoomIn', { enableTransition: false, zoomRate: 2 })">
                    <ZoomIn />
                  </el-icon>
                  <el-icon @click="
                    actions('clockwise', { rotateDeg: 180, enableTransition: false })
                    ">
                    <RefreshRight />
                  </el-icon>
                  <el-icon @click="actions('anticlockwise')">
                    <RefreshLeft />
                  </el-icon>
                  <el-icon @click="reset">
                    <Refresh />
                  </el-icon>
                  <el-icon @click="download(activeIndex)">
                    <Download />
                  </el-icon>
                </template>
              </el-image>
            </div>
          </div>
        </transition-group>
      </div>
    </el-scrollbar>


    <div class="timeline">
      <!-- 示例节点 -->
      <div class="timeline-item" :class="{ active: isActive == item }" :data-time=item v-for="(item, index) in timeline"
        :key="item" @click="scrollToDate(item)">
        <div class="timeline-content">
          <div class="timeline-date">{{ item }}</div>
        </div>
      </div>
    </div>
  </el-main>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.el-scrollbar {
  width: 82vw;
}

.el-main {
  top: 120px;
  left: 240px;
  position: relative;
  z-index: 1;
  position: fixed;
  height: 90%;
}

.demo-image__preview {
  top: 50px;
  position: relative;
  width: 90%;
}

.el-header {
  position: fixed;
  left: 240px;
  width: 100%;
  z-index: 1010;
  top: 120px;
}


.el-image {
  margin-right: 10px;
  margin-bottom: 10px;
  float: left;
}

.time {
  scroll-margin-top: 70px;
  /* 根据导航栏高度调整 */
  scroll-margin-bottom: 80px;
  height: auto;
  display: flex;
  flex-direction: column;
  cursor: pointer;
  /* 显示手型指针 */
  outline: none;
  /* 移除聚焦轮廓 */
  margin-bottom: 2%;
}

.timeLine {
  width: 100%;
  height: 18px;
  line-height: 100%;
  color: #999;
  margin-bottom: 2px;
  transition: color 0.5s ease-out;
  /* 优化动画曲线 */
}

.Line {
  width: 0%;
  background-color: rgba(39, 186, 155, 0.5);
  height: 2px;
  /* 加粗线条更明显 */
  transition: width 0.5s ease-out;
  /* 优化动画曲线 */
}

/* 悬停动画 */
.time:hover .Line {
  width: 100%;
}

.time:hover .timerLine {
  color: rgba(39, 186, 155, 0.8);
}

/* 点击时即时反馈 */
.time:active .Line {
  width: 90%;
  transition: width 0.2s;
  /* 快速响应 */
}

.time:active .timeLine {
  color: rgba(39, 186, 155, 0.8);
  transition: color 0.2s;
}

/* 聚焦状态保持效果 */
.time:focus .Line {
  width: 90%;
  transition: width 0.5s;
}

.time:focus .timeLine {
  color: rgba(39, 186, 155, 0.8);
  transition: color 0.5s;
}


/* 时间轴容器（固定在右侧） */
.timeline {
  width: 200px;
  position: fixed;
  right: 40px;
  top: 60%;
  transform: translateY(-50%);
  padding: 20px 0;
  height: 70%;
}

/* 垂直轴线 */
.timeline::before {
  content: '';
  position: absolute;
  right: 18px;
  /* 轴线紧贴右侧 */
  top: 0;
  bottom: 0;
  width: 2px;
  background: #e0e0e0;
}

/* 时间节点 */
.timeline-item {
  position: relative;
  margin-bottom: 30px;
  padding-right: 40px;
  /* 内容在轴线左侧 */
}

/* 时间点标记 */
.timeline-item::before {
  content: '';
  position: absolute;
  right: 10px;
  /* 对齐轴线 */
  top: 3px;
  width: 12px;
  height: 12px;
  background: #fff;
  border: 2px solid #27ba9b;
  border-radius: 50%;
  z-index: 1;
}

/* 节点内容 */
.timeline-content {
  font-family: Arial, sans-serif;
  font-size: 12px;
  color: #666;
  line-height: 1.4;
  text-align: right;
  /* 内容右对齐 */
  padding: 4px 8px;
}

/* 时间日期 */
.timeline-date {
  font-size: 10px;
  color: #999;
  margin-bottom: 4px;
}

/* 悬浮效果 */
.timeline-item:hover::before {
  background: #27ba9b;
  transform: scale(1.2);
  transition: all 0.2s;
}

/* 当前激活状态 */
.timeline-item.active::before {
  background: #27ba9b;
  box-shadow: 0 0 5px rgba(24, 144, 255, 0.3);
}

.timeline-item {
  position: relative;
  cursor: pointer;
}

/* 详细时间提示层 */
.timeline-item::after {
  content: attr(data-time);
  position: absolute;
  right: 50px;
  /* 距离轴线的间距 */
  top: 50%;
  transform: translateY(-50%);
  background: rgba(0, 0, 0, 0.8);
  color: #fff;
  padding: 6px 10px;
  border-radius: 4px;
  font-size: 12px;
  white-space: nowrap;
  opacity: 0;
  pointer-events: none;
  transition: all 0.2s ease;
}

/* 提示层三角箭头 */
.timeline-item::before {
  /* 原有样式保留 */
  transition: all 0.2s ease;
}

.timeline-item:hover::after {
  opacity: 1;
  right: 45px;
  /* 微调位置增强动效 */
}

/* 优化原有悬浮效果 */
.timeline-item:hover::before {
  transform: scale(1.3);
  box-shadow: 0 2px 8px rgba(24, 144, 255, 0.2);
}

/* 当前节点样式强化 */
.timeline-item.active::after {
  background: #27ba9b;
}

.highlight {
  background: rgba(118, 246, 222, 0.1);
  border-color: #27ba9b;
}
</style>
