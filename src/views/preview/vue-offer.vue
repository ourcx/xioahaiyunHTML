import Hearder from '@/views/home/hearder.vue';
<template>
  <el-container>
    <el-header class="header" height="60px">
      <h1>{{ route.query.style }}</h1>
      <div class="header-right">
        <el-icon>
          <Download />
        </el-icon>
        <el-icon>
          <Sort />
        </el-icon>
      </div>
    </el-header>
    <el-header class="header-next" height="60px">
      <div class="toolbar-container">
        <!-- 左侧功能区 -->
        <div class="left-section">
          <div class="tool-item" @click="toggleAside">
            <el-icon>
              <Menu />
            </el-icon>
            <span class="text">目录</span>
          </div>
          <div class="tool-item">
            <el-icon>
              <Printer />
            </el-icon>
            <span class="text">本地打印</span>
          </div>
          <div class="tool-item">
            <el-icon>
              <Document />
            </el-icon>
            <span class="text">转PDF</span>
          </div>
        </div>

        <!-- 右侧控制区 -->
        <div class="right-section">
          <div class="control-group">
            <el-icon class="control-item">
              <ArrowLeft />
            </el-icon>
            <div class="separator"></div>
            <el-icon class="control-item">
              <ArrowRight />
            </el-icon>
          </div>

          <el-dropdown trigger="click">
            <div class="dropdown-trigger">
              <span>浏览大小</span>
              <el-icon>
                <ArrowDown />
              </el-icon>
            </div>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item @click="selected = 'suitable'">适合页面</el-dropdown-item>
                <el-dropdown-item @click="selected = 'actual'">实际大小</el-dropdown-item>
                <el-dropdown-item @click="selected = 'width'">适合宽度</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </div>
    </el-header>
    <div class="pre">
      <el-aside width="200px" :class="['pure-aside', { 'collapsed': aside, }]">
        <!-- 侧边栏内容 -->
        <div class="aside-content">
          <h3>导航菜单</h3>
          <el-menu class="file-tree-menu">
            <el-menu-item :index="i" v-for="(item, i) in FileTreaeStore.result" :key="item.name" @click="menu(item)">{{
              item.name }}</el-menu-item>
          </el-menu>
        </div>
      </el-aside>
      <el-scrollbar class="preview-content"
        :class="{ 'aside-collapsed': !aside, 'suitable': selected == 'suitable', 'actual': selected == 'actual', 'width': selected == 'width' }">
        <div class="file-viewer-container">
          <!-- 加载状态 -->
          <div v-if="loading" class="loading-state">
            <el-icon class="loading-icon">
              <Loading />
            </el-icon>
            正在加载文件...
          </div>

          <!-- 错误提示 -->
          <div v-if="error" class="error-state">
            <el-icon>
              <Warning />
            </el-icon>
            {{ errorMessage }}
          </div>

          <!-- 动态组件渲染 -->
          <component v-if="!loading && !error && currentComponent" :is="currentComponent" :src="fileContent"
            :style="{ height: '86vh', width: selected === 'width' ? 'auto' : '100%' }"
            @rendered="() => { console.log('渲染完成'); loading = false }" @error="handleError" loding-text="加载中..."
            v-loading="loading" />

          <!-- 未知类型提示 -->
          <div v-if="currentFileType === 'unknown'" class="unknown-type">
            不支持预览该文件类型
          </div>
        </div>
      </el-scrollbar>
    </div>
  </el-container>
</template>

<script setup>
import VueOfficePdf from '@vue-office/pdf'; // 注意包名是否正确
import VueOfficeDocx from '@vue-office/docx'
import VueOfficeExcel from '@vue-office/excel'
import VueOfficePptx from '@vue-office/pptx'
import apiClient from '@/utils/api';
import { ref, computed, defineAsyncComponent, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router';
import { useFileTreeStore } from '@/stores/tree/fileTree';

const FileTreaeStore = useFileTreeStore()
const route = useRoute()
const selected = ref('width')
const loading = ref(false)
const error = ref(null)
const errorMessage = ref('')
const fileContent = ref(null)
const router = useRouter()
// 文件类型映射表（扩展补充）
const fileTypeMap = {
  pdf: 'pdf',
  docx: 'docx',
  xlsx: 'excel',
  pptx: 'pptx',
}

// 动态组件定义
const components = {
  pdf: defineAsyncComponent(() => import('@vue-office/pdf')),
  docx: defineAsyncComponent(() => import('@vue-office/docx')),
  excel: defineAsyncComponent(() => import('@vue-office/excel')),
  // 可以继续添加其他文件类型的组件
  pptx: defineAsyncComponent(() => import('@vue-office/pptx')),
}

// 计算属性
const currentFileType = computed(() => {
  return getFileType(route.query.style)
})

const currentComponent = computed(() => {
  return components[currentFileType.value] || null
})

// 方法
const getFileType = (fileName) => {
  if (!fileName) return 'unknown'
  const extension = fileName.split('.').pop().toLowerCase()
  return fileTypeMap[extension] || 'unknown'
}

const fetchFileContent = async () => {
  try {
    if (currentFileType.value === 'unknown') {
      throw new Error('不支持的文件类型')
    }

    loading.value = true
    error.value = false

    const response = await apiClient.post('/files/Dscribe', {
      // POST请求参数应放在请求体
      filename: route.query.style
    })

    if (!response.data) {
      handleError(err)
      return
    }

    // 根据文件类型处理不同响应
    switch (currentFileType.value) {
      case 'pdf':
        fileContent.value = response.data.previewURL
        break
      case 'docx':
        fileContent.value = response.data.previewURL
        break
      case 'excel':
        fileContent.value = response.data.previewURL
        break
      case 'pptx':
        console.log(response.data.previewURL);
        fileContent.value = response.data.previewURL
        break
      default:
        throw new Error('未知文件类型')
    }
  } catch (err) {
    handleError(err)
  } finally {
    loading.value = false
  }
}

const handleError = (error) => {
  errorMessage.value = `文件加载失败: ${error.message}`
  error.value = true
  console.error('Error:', error)
  // 可以在此添加错误上报逻辑
}

const menu = (item) => {
  const base = route.query.style.replace(/\\/g, '/').lastIndexOf('/') === -1 ? '' : route.query.style.replace(/\\/g, '/').substring(0, route.query.style.replace(/\\/g, '/').lastIndexOf('/') + 1);
  if (item.name.split('.').pop().toLowerCase() == "md") {
    console.log(item);
    if (item.basePath||item.basePath=='') {
      router.push({
        path: '/previewMd',
        query: {
          style: item.basePath + item.name,
          name: item.name
        }
      })
      return
    }
    router.push({
      path: '/previewMd',
      query: {
        style: base + item.name,
        type: false,
        name: item.name
      }
    })
    return
  }
  if (item.basePath||item.basePath=='') {
    router.push({
      path: '/preview',
      query: {
        style: item.basePath + item.name,
        name: item.name
      }
    })
    return
  }
  router.push({
    path: '/preview',
    query: {
      style: base + item.name,
      type: false,
      name: item.name
    }
  })
}

// 生命周期钩子
onMounted(async () => {
  loading.value = true
  if (route.query.style) {
    await fetchFileContent()
  }
})


const aside = ref(true);
const toggleAside = () => {
  aside.value = !aside.value;
};
</script>

<style scoped>
.header {
  padding: 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  /* box-shadow: 0 5px 20px 5px rgba(115, 115, 115, 0.8);
  z-index: 10001; */
  color: #000;

  .header-right {
    display: flex;
    align-items: center;
    gap: 20px;
    font-size: 20px;
  }
}

.header-next {
  padding: 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;

  .toolbar-container {
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  /* 左侧功能区样式 */
  .left-section {
    display: flex;
    align-items: center;
    gap: 25px;
  }

  .tool-item {
    display: flex;
    align-items: center;
    gap: 6px;
    color: #606266;
    cursor: pointer;
    transition: all 0.2s;
    padding: 8px 12px;
    border-radius: 4px;
  }

  .tool-item:hover {
    background: #e8f4ff;
    color: #27ba9b;
  }

  .tool-item .el-icon {
    font-size: 18px;
  }

  /* 右侧控制区样式 */
  .right-section {
    display: flex;
    align-items: center;
    gap: 24px;
    color: #000;
  }

  .control-group {
    display: flex;
    align-items: center;
    background: #fff;
    border: 1px solid #dcdfe6;
    border-radius: 4px;
    padding: 4px;
    color: #000 !important;
  }

  .control-item {
    padding: 6px 10px;
    color: #000000 !important;
    cursor: pointer;
    transition: all 0.2s;
  }

  .control-item:hover {
    color: #27ba9b;
  }

  .separator {
    width: 1px;
    height: 20px;
    background: #dcdfe6;
    margin: 0 4px;
  }

  /* 下拉菜单样式 */
  .dropdown-trigger {
    display: flex;
    align-items: center;
    gap: 4px;
    color: #606266;
    cursor: pointer;
    padding: 8px 12px;
    border-radius: 4px;
  }

  .dropdown-trigger:hover {
    background: #f5f7fa;
  }

  /* 视图模式 */
  .view-modes {
    display: flex;
    gap: 12px;
    background: #fff;
    border: 1px solid #dcdfe6;
    border-radius: 4px;
    padding: 4px;
  }


}

.preview-content {
  padding: 0 20%;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  height: 100%;
  width: auto;
  background-color: #f8f9fc;
  width: 100%;
}

.preview-content.aside-collapsed {
  padding: 0 13% !important;
  transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
}

.preview-content.suitable {
  padding: 0 20%;
  transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
}

.preview-content.actual {
  padding: 0 0%;
  transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
}

.preview-content.width {
  padding: 0 auto;
  transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
}


.el-aside {
  padding: 20px;
  height: 100%;
}



.pure-aside {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  overflow: visible !important;
  position: relative;
  box-shadow: 2px 0 8px rgba(0, 0, 0, 0.1);
}

.pure-aside.collapsed {
  width: 0 !important;
  margin-left: -200px;
  opacity: 0;
  transition:
    width 0.6s ease,
    margin-left 0.6s ease,
    opacity 0.3s ease;
}


:deep(.el-aside) {
  overflow: visible !important;
  transition: inherit;
}

.aside-content {
  min-width: 200px;
  overflow-x: hidden;
}

.file-tree-menu {
  width: 100%;
  height: 100%;
  overflow-y: auto;
}

.pre {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  gap: 0;
  height: 90%;
  background-color: #f8f9fc;
}

.el-container {
  height: 100vh;
  width: 100vw;
}

.file-viewer-container {
  position: relative;
  width: 100%;
  min-height: 400px;
}

.loading-state {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  align-items: center;
  gap: 8px;
  color: #666;
}

.loading-icon {
  animation: rotate 1s linear infinite;
}

.error-state {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: #ff4444;
  display: flex;
  align-items: center;
  gap: 8px;
}

.unknown-type {
  padding: 20px;
  text-align: center;
  color: #ff8800;
}

@keyframes rotate {
  from {
    transform: rotate(0deg);
  }

  to {
    transform: rotate(360deg);
  }
}
</style>
