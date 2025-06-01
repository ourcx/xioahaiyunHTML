<script setup>
// 这里可以添加回收站相关逻辑
import { useFileTreeStore } from '@/stores/tree/fileTree';
import { ref, onMounted } from 'vue';
import apiClient from '@/utils/api';

const isIndeterminate = ref(true)
const fileTreeStore = useFileTreeStore();
const checkList = ref([])
// 示例数据格式
const check = ref(false)
const data = ref([])

//和后端联系

const getData = async () => {
  const regex = /^users\/\d+trash\//;
  await apiClient.get('/trash/TrashList').then(res => {
    res.data.data.forEach(item => {
    data.value.push(item.replace(regex, ''))
    })
  })
}


const handleCheckAllChange = (val) => {
  checkList.value = val ? data.value : []
  isIndeterminate.value = false
}
const handleCheckedCitiesChange = (value) => {
  const checkedCount = value.length
  check.value = checkedCount === data.value.length
  isIndeterminate.value = checkedCount > 0 && checkedCount < data.value.length
}

// 格式化辅助函数
// const formatSize = (bytes) => {
//   if (bytes < 1024) return `${bytes} B`
//   if (bytes < 1048576) return `${(bytes / 1024).toFixed(1)} KB`
//   return `${(bytes / 1048576).toFixed(1)} MB`
// }

// const formatDate = (dateString) => {
//   return new Date(dateString).toLocaleDateString()
// }

//恢复删除
const handleDelete = async () => {
  if (data.value.length === 0 || checkList.value.length === 0) return
  await apiClient.put('/trash/RecoverFile', {
    TrashFiles: Object.values(checkList.value)
  }).then(res => {
    const valuesToRemove = Object.values(checkList.value)
    data.value=data.value.filter(item => !valuesToRemove.includes(item))
  })
}

//彻底删除
const DeepDelete = async () => {
  checkList.value[0]
  if (data.value.length === 0 || checkList.value.length === 0) return
  await apiClient.put('/trash/deleteTrash', {
    deleteName: checkList.value[0]
  }).then(res => {
    data.value=data.value.filter(item => !(item == checkList.value[0]));
  })
}












const getDivDom = (item) => { }
const nogetDivDom = (item) => { }


onMounted(async () => {
  await getData()
})
</script>

<template>
  <el-main class="recycle-main">
    <!-- 顶部操作栏 -->
    <el-header class="recycle-header" height="60px">
      <div class="header-left">
        <h2>回收站</h2>
      </div>
    </el-header>

    <!-- 空状态显示（默认隐藏） -->
    <el-empty class="custom-empty"
      image="https://pannss.bdstatic.com/m-static/service-widget-1/pageSet/recyclebin/img/emptypic_a07843d.png"
      description="回收站为空" v-if="data.length === 0" />

    <!-- 主体内容区域 -->
    <div class="main" v-if="data.length !== 0">
      <div class="main-header">
        <div class="header-left">
          <el-checkbox v-model="check" :indeterminate="isIndeterminate" @change="handleCheckAllChange">全选</el-checkbox>
          <el-popconfirm title="你确定要恢复所选内容吗？" @confirm="handleDelete"><template #reference> <el-button type="text"
                size="small">恢复</el-button>
            </template>
          </el-popconfirm>

          <el-popconfirm title="你确定要恢复所选内容吗?只能选择一个进行删除" @confirm="DeepDelete"><template #reference> <el-button
                type="text" size="small">彻底删除</el-button>
            </template>
          </el-popconfirm>
        </div>
      </div>

      <!-- 文件列表区域 -->
      <div class="file-list">
        <!-- 将 v-model 提升到 checkbox-group 层级 -->
        <el-checkbox-group v-model="checkList" @change="handleCheckedCitiesChange">
          <!-- TransitionGroup 包裹整个列表 -->
          <TransitionGroup name="list" tag="div" class="file-list-body">
            <!-- 每个文件项使用独立容器 -->
            <div v-for="(item, index) in data" :key="index" class="file-item" @mouseover="getDivDom(item)"
              @mouseout="nogetDivDom(item)">
              <el-checkbox :label="item" class="file-checkbox">
                <!-- 文件信息使用 flex 布局 -->
                <div class="file-info">
                  <span class="file-name">{{ item }}</span>
                </div>
              </el-checkbox>
            </div>
          </TransitionGroup>
        </el-checkbox-group>
      </div>
    </div>
  </el-main>
</template>

<style scoped>
/* 主容器样式 */
.recycle-main {
  position: fixed;
  width: calc(100% - 240px);
  height: calc(100% - 60px);
  top: 60px;
  left: 240px;
  right: 0;
  bottom: 0;
  display: flex;
  flex-direction: column;
  padding: 0;
  overflow: hidden;
}

/* 顶部操作栏样式 */
.recycle-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 20px;
  background-color: #fff;
  border-bottom: 1px solid #ebeef5;
}

.recycle-header h2 {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  color: #303133;
}

/* 主体内容区域 */
.main {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  padding: 20px;
}

/* 文件操作栏 */
.main-header {
  height: 60px;
  background-color: #fff;
  border-radius: 4px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.main-header .header-left{
  display: flex;
  align-items: center;
  gap: 15px;
}

/* 文件列表区域 */
.file-list {
  flex: 1;
  background-color: #fff;
  border-radius: 4px;
  overflow: auto;
}

.file-list-body {
  color: black;
  border-bottom: 1px solid rgba(95, 95, 95, 0.1);
  position: relative;
  height: 60px;

  p {
    height: 100%;
    display: flex;
    align-items: center;
    width: 100%;
    justify-content: space-between;
    padding: 0 10px;


    span {
      font-size: 14px;
      color: #000;
    }
  }
}

.file-checkbox {
  width: 100% !important;
}

.empty-placeholder {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 90%;
}

/* 空状态样式（保留但当前隐藏） */
.custom-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.custom-empty :deep(.el-empty__image) {
  width: 100px !important;
  height: 100px !important;
  margin: 0 auto 20px;
}

.custom-empty :deep(.el-empty__description) {
  margin-top: 10px;
  font-size: 16px;
  color: #606266;
}

.file-list-container {
  max-width: 800px;
  margin: 0 auto;
}

.file-list-body {
  display: flex;
  flex-direction: column;
  gap: 12px;
  /* 项间距 */
}

.file-item {
  background: #fff;
  border-radius: 4px;
  padding: 12px 16px;
  transition: all 0.3s ease;
}


.file-info {
  display: flex;
  align-items: center;
  gap: 50%;
  /* 信息项间距 */
  margin-left: 8px;
  justify-items: space-between;
}

.file-name {
  min-width: 300px;
  flex: 1;
  font-weight: 500;
}

.file-size {
  width: 200px;
  color: #606266;
}

.file-date {
  width: 200px;
  color: #909399;
}

/* 过渡动画 */
.list-enter-active,
.list-leave-active {
  transition: all 0.5s ease;
}

.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: translateX(30px);
}
</style>
