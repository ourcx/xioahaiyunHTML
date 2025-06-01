<template>
  <div class="container">
    <el-result icon="error" title="404提示" sub-title="你找的页面走丢了">
      <template #extra>
        <el-button type="primary" @click="$router.push('/')">回到首页</el-button>
      </template>
    </el-result>
    <div class="demo-image__lazy">
      <div class="items">
        <el-image src="https://s2.loli.net/2025/02/02/ELbK6urJqYvgBPj.jpg"></el-image>
        <div class="image-mask">
          <span class="mask-text">
            <P>遇见，等待，希望，未来</P>
          </span>
          <i class="el-icon-view mask-icon"></i>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted,ref } from 'vue'

onMounted(() => {
      document.title ="出错啦！";
    });

</script>

<style scoped>
.container {
  position: absolute;
  top: 0;
  left: 50%;
  height: auto;
  transform: translate(-50%, 0);
  display: grid;
  place-items: center;
  /* 水平垂直居中 */
  min-height: 100vh;
  background-color: rgb(255, 255, 255);
  box-shadow: 10px 10px 10px 10px rgba(0, 0, 0, 0.1), -10px -10px 10px -10px rgba(0, 0, 0, 0.1);
}

/* 清除 el-result 默认边距 */
:deep(.el-result) {
  margin: 0 !important;
}


.demo-image__lazy {
  overflow-y: hidden;
  scrollbar-width: none;
  -ms-overflow-style: none;
  overflow-x: hidden;
}



.demo-image__lazy .items {
  overflow: hidden;
  border-radius: 10px;
}



/* 容器设置相对定位 */
.items {
  position: relative;
  display: inline-block; /* 根据布局需要调整 */
  margin: 10px;
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
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.mask-text p {
  font-size: small;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  width: 100%;
}

.mask-icon {
  font-size: 1.5em;
  animation: zoom 0.6s ease infinite alternate;
}

@keyframes zoom {
  from { transform: scale(1); }
  to { transform: scale(1.2); }
}

/* 确保图片容器尺寸正确 */
.el-image {
  width: 100%;
  height: 100%;
}

/* 可选：清除父页面可能的外边距 */
body {
  margin: 0;
}
</style>
