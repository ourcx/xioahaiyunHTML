<template>
  <div class="share-container">
    <!-- 头部导航 -->
    <el-menu class="header" mode="horizontal">
      <el-menu-item index="0" style="cursor: default">
        <img src="https://s2.loli.net/2025/03/24/nDA7s16FJ4Rytmf.png" style="height: 24px" alt="logo">
      </el-menu-item>
    </el-menu>

    <!-- 主要内容区域 -->
    <div class="main-content">
      <!-- 分享信息 -->
      <div class="share-info">
        <img :src="datas.avatar" style="height: 50px; width: 50px; border-radius: 50%;" alt="用户头像" />
        <div class="share-details">
          <h2>{{ datas.username }}分享的文件</h2>
          <div class="share-meta">
            <span><el-icon><User /></el-icon> {{ datas.email }}</span>
            <span><el-icon><Clock /></el-icon> {{datas.created_at}} 分享</span>
            <span><el-icon><Edit /></el-icon> {{datas.signature}}</span>
          </div>
        </div>
      </div>

      <!-- 文件列表 -->
      <el-table
        :data="files"
        style="width: 100%"
        :header-cell-style="{ background: '#f5f7fa' }"
      >
        <el-table-column width="40">
          <template #default="{ row }">
            <el-icon v-if="row.type === 'folder'"><Folder /></el-icon>
            <el-icon v-else-if="row.type === 'image'"><Picture /></el-icon>
            <el-icon v-else><Document /></el-icon>
          </template>
        </el-table-column>

        <el-table-column prop="name" label="文件名" width="400" />
        <el-table-column prop="size" label="大小" />
        <el-table-column prop="time" label="修改时间" width="200" />

        <el-table-column width="120">
          <template #default>
            <el-button type="primary" size="small">下载</el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 操作按钮 -->
      <div class="action-buttons">
        <el-button type="primary" size="large">转存到网盘</el-button>
        <el-button type="info" size="large">下载全部</el-button>
      </div>
    </div>
  </div>
</template>

<script setup>
import {
  FolderOpened,
  User,
  Clock,
  Folder,
  Picture,
  Document,
  Edit
} from '@element-plus/icons-vue'
import apiClient from '@/utils/api';
import { useRoute } from 'vue-router'
import { ref } from 'vue';


const route = useRoute()
const datas =ref({})
// 直接访问 query 参数
console.log(route.query.one_id) // 所有参数对象


const shareFile = async () => {
  try {
    const response = await apiClient.post('/share/getUrl', {
       one_id: route.query.one_id
    })
    console.log(response.data.data)
    datas.value = response.data.data
  } catch (error) {
    console.error('Error fetching share file:', error)
  }
}

shareFile()








const files = [
  { name: '项目文档', type: 'folder', size: '-', time: '2024-03-20 10:00' },
  { name: '图片素材.jpg', type: 'image', size: '2.5MB', time: '2024-03-19 15:30' },
  { name: '报告.pdf', type: 'doc', size: '1.2MB', time: '2024-03-18 09:45' },
  { name: '设计稿.psd', type: 'doc', size: '15MB', time: '2024-03-17 14:20' },
  { name: '学习资料.zip', type: 'doc', size: '45MB', time: '2024-03-16 11:10' }
]
</script>

<style scoped>
.share-container {
  min-height: 100vh;
  width: 100vw;
  background: #f5f7fa;
}

.header {
  background: #fff;
  box-shadow: 0 2px 4px rgba(0,0,0,.1);
  padding: 0 20px;
  position: fixed;
  width: 100%;
}

.main-content {

  max-width: 1200px;
  margin: 100px auto;
  padding: 0 20px;
}

.share-info {
  display: flex;
  align-items: center;
  background: #fff;
  padding: 20px;
  border-radius: 4px;
  margin-bottom: 20px;
}

.share-details {
  margin-left: 20px;
}

.share-details h2 {
  margin: 0 0 8px 0;
  color: #333;
}

.share-meta {
  display: flex;
  gap: 20px;
  color: #666;
  font-size: 14px;
}
.share-meta span {
  display: flex;
  align-items: center;
  justify-items: center;
  justify-content: center;
  gap: 5px;
}

.action-buttons {
  margin-top: 20px;
  text-align: right;
}

.el-table {
  border-radius: 4px;
  overflow: hidden;
  box-shadow: 0 2px 4px rgba(0,0,0,.1);
}

.el-table ::v-deep(th.el-table__cell) {
  background-color: #f5f7fa;
}

.el-table ::v-deep(.el-table__row:hover) {
  background-color: #f5f7fa;
}
</style>
