<script setup>
import Input from './input.vue';
import { ref, onMounted, computed, toRefs, toRaw, onUnmounted, watch, nextTick } from 'vue';
import { useRoute } from 'vue-router'
import Allcon from '@/router/conversation/allcon.vue';
import { useChatStore } from '@/stores/chat';
import { useManagementStore } from '@/stores/management';

const route = useRoute()
const ManagementStore = useManagementStore()

// //聊天和按钮数据获取
// const dataCon = ref({

// })

// const dataMy = ref({

// })

const input3 = ref('')



const chatStore = useChatStore()

// 使用深层响应式对象替代分开的数组
const chatData = ref({
  con: [],
  my: []
})

// 使用计算属性获取消息列表
const message = computed(() => chatStore.dataCon)
chatData.value.con = message.value

const messageMy = computed(() => chatStore.dataMy)
chatData.value.my = messageMy.value

// 滚动容器引用
const scrollContainer = ref(null)
const isNearBottom = ref(true)
const scrollThreshold = 100

// 改进后的滚动处理
const handleScroll = () => {
  if (!scrollContainer.value) return

  const container = scrollContainer.value
  const currentPos = container.scrollTop + container.clientHeight
  isNearBottom.value = (container.scrollHeight - currentPos) <= scrollThreshold
}

// 增强型智能滚动
const smartScroll = async () => {
  await nextTick() // 等待 DOM 更新

  if (!scrollContainer.value || !isNearBottom.value) return

  const container = scrollContainer.value
  container.scrollTo({
    top: container.scrollHeight,
    behavior: 'smooth'
  })
}

// 深度监听数据结构变化
watch(
  () => [chatData.value.con, chatData.value.my],
  () => {
    console.log('聊天数据变化，触发滚动')
    smartScroll()
  },
  {
    deep: true,      // 启用深度监听
    flush: 'post',    // DOM 更新后执行
  }
)










//拿到路由传过来的消息
const piniaData = ManagementStore.clickStaus


const drawer = ref(false)
const activeName = ref('first')
const check = ref(false)
//加载
const loading = ref(true);
onMounted(() => {
  loading.value = false
   if (!scrollContainer.value) return
  scrollContainer.value.scrollTop = scrollContainer.value.scrollHeight
})


const handleClick = (tab, event) => {
  console.log(tab, event)
}

const changeCheck = () => {
  check.value = !check.value
}


const tableData = [
  {
    date: '2016-05-04',
    name: 'Aleyna Kutzner',
  },
  {
    date: '2016-05-03',
    name: 'Helen Jacobi',
  },
  {
    date: '2016-05-02',
    name: 'Brandon Deckert',
  },
  {
    date: '2016-05-01',
    name: 'Margie Smith',
  },
]
</script>

<template>
  <el-main v-loading="loading" element-loading-text="Loading...">
    <div class="header">
      <p>{{ route.query.name }}</p>
    </div>
    <div class="aside">
      <Folder style="top: 60px;color:#27ba9b ;position: fixed; border-radius: 50%;" class="iconfont"
        @click="drawer = true" />
    </div>
    <div class="conversation__main"   ref="scrollContainer" @scroll="handleScroll" >
      <Allcon :dataCon="chatData.con" :dataMy="chatData.my"></Allcon>
      <!-- 这里可以搞一个懒加载 -->
    </div>
    <div class="conversation">
      <div class="emo">
        <el-icon style="color: #27ba9b;height: 30px;width: 30px;position: relative;">
          <MostlyCloudy />
        </el-icon>
        <el-icon style="color: #27ba9b;height: 30px;width: 30px;position: relative;">
          <MostlyCloudy />
        </el-icon>
        <!-- 这部分搞得不行 -->
      </div>
      <Input></Input>
    </div>


    <el-drawer v-model="drawer" append-to-body header-class="margin-top">
      <template #header>
        <h4 style="border-bottom: 1px solid #f3f4f7;height: 40px;font-weight: 900;color: black;">文件库</h4>
      </template>
      <template #default>
        <div class="mt-4">
          <el-input v-model="input3" style="max-width: 100%" placeholder="搜索聊天中的所有文件"
            input-style="border-radius: 20px;">
            <template #append>
              <el-button :icon="Search" />
            </template>
          </el-input>
        </div>
        <el-tabs v-model="activeName" class="demo-tabs" @tab-click="handleClick" stretch>
          <el-tab-pane label="全部文件" name="first">
            <template #default>
              <el-button-group v-if="check">
                <el-button>
                  转存
                </el-button>
                <el-button>
                  下载
                </el-button>
                <el-button>
                  删除
                </el-button>
              </el-button-group>
              <div class="tabs-containt">
                <span class="tabs-header">文件</span>
                <el-table :data="tableData" style="width: 100%" @select="changeCheck">
                  <el-table-column type="selection" width="70" />
                  <el-table-column label="Date" width="165">
                    <template #default="scope">{{ scope.row.date }}</template>
                  </el-table-column>
                  <el-table-column property="name" label="Name" width="180" />
                </el-table>
              </div>
            </template>
          </el-tab-pane>
          <el-tab-pane label="最近更新" name="second">最近更新</el-tab-pane>
        </el-tabs>
      </template>
    </el-drawer>
  </el-main>
</template>

<style>
body {
  overflow: hidden;
}

.el-drawer__header {
  margin-bottom: 0px !important;
}
</style>

<style scoped>
.el-main {
  position: fixed;
  height: 100%;
  overflow: auto;
  padding: 0;
  left: 500px;
  width: 67%;
  background-color: rgb(247, 249, 252);
  overflow-y: scroll;
}

.header {
  position: fixed;
  width: 100%;
  height: 50px;
  top: 60px;
  border-bottom: 1px solid rgba(182, 182, 182, 0.5);
  z-index: 1006;
  background-color: white;
}

.header p {
  margin: 15px 0 15px 20px;
  height: 20px;
  color: black;
  font-weight: bold;
}

.aside {
  height: 100%;
  width: 40px;
  background-color: #edeef2;
  position: fixed;
  display: flex;
  right: 0;
  z-index: 1007;
  justify-content: center;
}

.conversation__main {
  height: 67%;
  width: 65.9%;
  top: 110px;
  position: fixed;
  bottom: 160px;
  z-index: 1005;
  overflow-y: auto;
}

.conversation {
  height: 160px;
  width: 65%;
  position: fixed;
  bottom: 0;
  z-index: 1003;
  padding: 10px 35px 10px 35px;
  background-color: white;
  z-index: 1006;
}

.emo {
  width: 59.4%;
  background-color: white;
  height: 30px;
  position: fixed;
  z-index: 1009;
}

.el-button {
  top: 120px;
  position: relative;
}

.iconfont:hover {
  color: #1dc779;
}


.demo-tabs>.el-tabs__content {
  padding: 32px;
  color: #6b778c;
  font-size: 32px;
  font-weight: 600;
}

.tabs-containt {
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
}

.tabs-header {
  width: 100%;
  color: #7d7d7d;
  font-size: smaller;
  margin: 0;
  margin-left: 10px;
}

.el-button-group {
  width: 100%;
  height: 100%;
  position: relative;
  z-index: 11111;
  margin-bottom: 10px;
}

.el-button-group button:first-child {
  top: 0;
  border-top-left-radius: 20px;
  border-bottom-left-radius: 20px;
}

.el-button-group button:last-child {
  top: 0;
  border-top-right-radius: 20px;
  border-bottom-right-radius: 20px;
}

.el-button-group button {
  top: 0;
}
</style>
