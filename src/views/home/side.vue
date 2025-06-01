<script setup>
import { ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useChatStore } from '@/stores/chat';

const router = useRouter();
const ChatStore = useChatStore();
const dot = ref(false)

const pumging = (e) => {
  const routeMap = new Map([
    [
      ['首页', '0'],
      { path: '/firstFile/img' }
    ],
    [
      ['转发', '1'],
      {
        path: '/send',
        query: { other: 'send' }
      }
    ],
    [
      ['消息', '2'],
      {
        path: '/conversation/person',
        callback: () => dot.value = false
      }
    ],
    [
      ['AI工具', '3'],
      {
        path: '/ai',
        query: { type: 'ai' }
      }
    ],
    [
      ['更多', '4'],
      {
        path: '/more'
      }
    ]
  ]);

  // 查找匹配的路由配置
  const matchedRoute = [...routeMap.entries()].find(([keys]) =>
    keys.includes(e.target.innerText) || keys.includes(e.target.dataset.i)
  );

  if (matchedRoute) {
    const [_, routeConfig] = matchedRoute;

    // 执行路由跳转
    router.push({
      path: routeConfig.path,
      query: routeConfig.query || {}
    });

    // 执行回调函数（如果存在）
    if (routeConfig.callback) {
      routeConfig.callback();
    }
  } else {
    console.log('未匹配的路由', e);
  }
};

watch(
  // 修正监听对象（原代码重复监听了 dataMy）
  () => [ChatStore.privateCon, ChatStore.dataCon],
  () => {
    dot.value = true
  },{
    deep: true
  })

</script>




<template>
  <el-aside width="60px">
    <div class="image__preview" @click="(e) => { pumging(e) }">
      <div class="box">
        <img style="width: 30px; height: 30px" src="./img/网盘.png" data-i="0">
        <span class="title">首页</span>
      </div>
      <div class="box">
        <img style="width: 30px; height: 30px" src="./img/转发.png" data-i="1">
        <span class="title">转发</span>
      </div>
      <div class="box">
        <el-badge :is-dot="dot" class="item">
          <img style="width: 30px; height: 30px" src="./img/消息.png" data-i="2">
        </el-badge>
        <span class="title">消息</span>
      </div>
      <div class="box">
        <!-- <img style="width: 30px; height: 30px" src="" data-i="3"> -->
        <el-icon size="40px" color="#27ba9b" data-i="3">
          <Shop />
        </el-icon>
        <span class="title">AI工具</span>
      </div>
      <div class="box">
        <img style="width: 30px; height: 30px" src="./img/更多.png" class="more" data-i="4" />
        <span class="title">更多</span>
      </div>
    </div>
  </el-aside>
</template>

<style scoped>
.el-aside {
  box-shadow: 5px 0 30px rgba(150, 150, 150, 0.2);
  position: fixed;
  left: 0px;
  height: 1000px;
  z-index: 1004;
  background-color: #ffffff;
}

.image__preview {
  position: relative;
  overflow: hidden;
  top: 30px;
  display: flex;
  flex-direction: column;
  gap: 50px;
  min-height: calc(100vh - 30px);
}


.box:last-child {
  margin-top: auto;
}

.box {
  display: flex;
  flex-direction: column;
  margin: 0;
  padding: 0;
  justify-content: center;
  align-items: center;

}

.box img {
  width: 100%;
}

.box .title {
  width: 100%;
}

.box:first-child {
  margin-top: 70%;
}

.box:hover {
  cursor: pointer;
  background-color: #f4f5f9;
  border-radius: 10px;
}

.box:active {
  background-color: #e9f8f5;
  border-radius: 10px;
  transform: scale(1.1);
}

.box .more {
  width: 100%;
}

.image__preview span {
  color: #27ba9b;
  font-size: 12px;
  margin-top: 5px;
  text-align: center;
}
</style>
