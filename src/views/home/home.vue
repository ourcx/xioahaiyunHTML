<script setup>
import Hearder from '@/views/home/hearder.vue'
import Side from '@/views/home/side.vue';
import { RouterView } from 'vue-router';
import { useRoute } from 'vue-router';
import { onMounted,onBeforeUnmount } from 'vue';

const route = useRoute();
// import {axiosXH} from '@/utils/axiosXH.js'
// axiosXH("/user/userReq", "POST", {
//   "name": "Alice",
//   "password": "123456",
//   "email": "324saas55ss0"
// })
import { useChatStore } from '@/stores/chat'
  const chatStore = useChatStore()

onMounted(() => {
  // 初始化聊天数据
  chatStore.initWebSocket()
  // 监听路由变化
})

onBeforeUnmount(() => {
  // 清理聊天数据
  chatStore.closeConnection()
});


</script>






<template>
  <el-container id="container">
    <Hearder />
    <Side />
    <router-view :key="$route.fullPath">
    </router-view>
    <!-- 指定一个key使路由在刷新的时候时重新渲染 -->
  </el-container>
</template>

<style scoped>
#container {
  height: 1000px;
  width: 1250px;
}

body {
  background: rgb(255, 255, 255) !important;
}
</style>
