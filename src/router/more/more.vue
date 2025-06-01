<script setup>
import { RouterView } from 'vue-router';
import { ref } from 'vue';

import { useRouter } from 'vue-router'
import { useRoute } from 'vue-router'
const route = useRoute()
const router = useRouter()
const list = ['存储分析', '好友关系', "为你推荐", '使用频率', '链接稳定', '为您推荐', '文件传输', '识别转换', '效率助手', '文件管理', '数据备份', '企业服务', '其他']
const activeIndex = ref(null)
const setActive = (index, item) => {
  // 切换激活的段落
  activeIndex.value = activeIndex.value === index ? null : index;

  const routeMap = {
    '存储分析': '/more',
    '好友关系': '/more/relationship',
    "为你推荐": '/more/list',
  }

  if (routeMap[item]) {
    // 确保使用path跳转
    router.push(routeMap[item])
    // setInterval(() => {
    //   window.location.reload();
    // }, 500)
  }

};

</script>


<template>
  <el-aside width="180px">
    <div class="item" v-for="(item, index) in list" key="item" @click="setActive(index, item)">
      <p :class="{ active: activeIndex === index }">{{ item }}</p>
    </div>
  </el-aside>
  <el-main>
    <RouterView></RouterView>
  </el-main>
</template>
<style scoped>
.el-aside {
  position: fixed;
  height: 1000px;
  left: 60px;
  background-color: white;
  border-right: 1px solid rgba(199, 199, 199, 0.5);
  z-index: 1000;
}

.item:first-child {
  margin-top: 40%;
}

.item p {
  text-align: center;
  display: flex;
  justify-content: center;
  /* 水平居中 */
  align-items: center;
  /* 垂直居中 */
  height: 50px;
  /* 使容器占满整个视口高度 */
  padding: 0;
  color: black;
  width: 90%;
}



.item p:hover {
  border-radius: 20px;
  background-color: rgba(135, 184, 174, 0.1);
}



.item {
  display: flex;
  align-items: center;
  justify-content: center;
}

.i {
  width: 90%;
  text-align: center;
  line-height: auto;
}



.active {
  border-radius: 20px;
  background-color: rgba(39, 186, 155, 0.1);
  color: rgba(39, 186, 155, 0.5);
  z-index: 10001;
}


.el-main {
  width: 100%;
  height: auto;
  left: 240px;
  position: relative;
  background-color: rgb(245, 246, 250);
  scrollbar-width: none;
  top: 5%;
}
</style>
