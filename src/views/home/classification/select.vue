<script setup>
import { useFileTreeStore } from '@/stores/tree/fileTree';
import { useRoute } from 'vue-router';
import apiClient from '@/utils/api';
import { ref } from 'vue';

const fileTreeStore = useFileTreeStore();
const route = useRoute()
const input = ref('');
</script>


<template>
  <div class="home-hearder">
    <el-button-group class="ml-4">
      <el-button type="info">
        <el-icon>
          <Share />
        </el-icon>
        分享
      </el-button>
      <el-button type="info">
        <el-icon>
          <Download />
        </el-icon>
        下载
      </el-button>
      <el-button type="primary"> <!-- 突出核心功能 -->
        <el-icon>
          <VideoCamera />
        </el-icon>
        智能PPT
      </el-button>
      <el-button type="info">
        <el-icon>
          <CopyDocument />
        </el-icon>
        复制
      </el-button>
      <el-button type="info">
        <el-icon>
          <Rank />
        </el-icon>
        移动
      </el-button>
      <el-button type="info">
        <el-icon>
          <More />
        </el-icon>
        更多
      </el-button>
    </el-button-group>
    <div class="input-search">
      <el-input v-model="input" style="width: 280px;border: 0px solid white !important;" placeholder="搜索我的文件" clearable
        class="custom-search">
        <template #suffix>
          <div class="suffix"></div>
          <span class="suffix-inner" @click="fileTreeStore.search(input)">搜索</span>
        </template>

      </el-input>
    </div>
  </div>
</template>

<style scoped>
.home-hearder {
  position: fixed;
  top: 60px;
  left: 240px;
  width: 100%;
  height: 60px;
  border-bottom: 1px solid rgba(206, 206, 206, 0.5);
  z-index: 1000;
  background-color: white;
}

.el-button-group {
  margin-top: 15px;
  margin-left: 50px;
}

.el-button-group button {
  color: #27ba9b;
  background-color: #e9f8f5;
  border: 0cap;
}

.el-button-group button:first-child {
  border-top-left-radius: 15px;
  border-bottom-left-radius: 15px;
}

.el-button-group button:last-child {
  border-top-right-radius: 15px;
  border-bottom-right-radius: 15px;
}

.el-button-group button:hover {
  background-color: #27ba9b;
  color: #fff;
}

.input-search {
  display: inline-block;
  margin-top: 1.2%;
  right: -250px;
  border: 0px solid white !important;
  position: fixed;
  width: 580px;
  height: 40px;
}


.suffix {
  width: 1px;
  background-color: #c4c5c6;
  height: 50%;
  margin-right: 5px;
}

.suffix-inner {
  color: #27ba9b;
}

/* 深度穿透写法 */
:deep(.custom-search .el-input__wrapper) {
  /* 注意 Element Plus v2.x 使用 .el-input__wrapper */
  border-radius: 20px;
  padding: 0 15px;
  transition: all 0.3s;
  background-color: #f1f3f8 !important;
  /* 使用 !important 确保覆盖 */

}

/* 鼠标悬停 */
:deep(.custom-search .el-input__wrapper:hover) {
  box-shadow: 0 0 0 1px #27ba9b inset;
}

/* 聚焦状态 */
:deep(.custom-search.is-focus .el-input__wrapper) {
  box-shadow: 0 0 0 1px #27ba9b inset !important;
  border-radius: 30px !important;
}
</style>
