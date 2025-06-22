<script setup>
import { RouterView } from 'vue-router';
import { onMounted, onUnmounted,onBeforeUpdate } from 'vue';
import { useMasterPinia } from "@/stores/masterPinia"
import { useManagementStore } from "@/stores/management"
import { useFileTreeStore } from './stores/tree/fileTree';

const fileTreeStore = useFileTreeStore();
const ManagementStore = useManagementStore();
const MasterPinia = useMasterPinia();

// 初始化 WebSocket 连接
onMounted(() => {
  fileTreeStore.id()

  MasterPinia.setData()
    MasterPinia.setData()
  ManagementStore.updateListSide()
})
onBeforeUpdate(() => {
  MasterPinia.setData()
ManagementStore.updateListSide()
})
// 组件卸载时关闭连接
onUnmounted(() => {

})

</script>

<template>
  <router-view v-slot="{ Component }">
    <transition name="fade" mode="out-in" appear>
      <component :is="Component" :key="$route.fullPath" /> <!-- 渲染动态组件 -->
    </transition>
  </router-view>
</template>

<style>
body {
  background-color: white !important;
  /* 设置默认背景色为白色 */
  overflow-x: hidden;
  overflow-y: auto;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* 为 Chrome、Safari 和 Opera 隐藏滚动条 */
#body::-webkit-scrollbar {
  display: none;
}

/* 为 IE、Edge 和 Firefox 隐藏滚动条 */
#body {
  -ms-overflow-style: none;  /* IE and Edge */

}
</style>
