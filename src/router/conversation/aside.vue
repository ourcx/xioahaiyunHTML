<script setup>
import { onMounted, ref } from 'vue'
import { RouterView } from 'vue-router';
import { useRouter } from 'vue-router';

const router = useRouter();
const list = ['会话', '通讯录']
const activeNames = ref([])
const activeIndex = ref(0); // 记录当前激活的段落
const titleIdex = ref(true);
const collapse = ref(false)
let cur = ref('');
const setActive = (index) => {
  if (index === undefined) {
    collapse.value = !collapse.value;
  } else if (index == 0) {
    activeNames.value = [];
    cur.value = '';
    activeIndex.value = 0;
  }
  else {
    activeNames.value = [];
    activeIndex.value = 1
    cur.value = '';
  }
}

//根据路由判断激活
const tructive = () => {
  if (router.currentRoute.value.path === '/conversation/person'|| router.currentRoute.value.path === '/conversation/person/window') {
    activeIndex.value = 0;
  } else if (router.currentRoute.value.path === '/conversation/addrBook'|| router.currentRoute.value.path === '/conversation/addrBook/card') {
    activeIndex.value = 1;
  }
}

const changeTitle = () => {
  activeIndex.value = null;
  if (cur.value === null) {
    tructive();
  }
  cur.value = activeIndex.value;
}
//折叠面板还有问题的

const change = () => {
  titleIdex.value = !titleIdex.value;
}

const pushRoute = (index) => {
  if (index === 0) {
    router.push({
      path: "/conversation/person"
    })
  } else if (index === 1) {
    router.push({
      path: "/conversation/addrBook"
    })
  }
}

onMounted(() => {
  tructive();
})

</script>

<template>
  <el-aside width="180px">
    <div class="item" v-for="(item, index) in list" key="item" @click="setActive(index)">
      <p :class="{ active: activeIndex === index }" class="i" @click="pushRoute(index)">{{ item }}</p>
    </div>
    <el-collapse id="callable-list" v-model="activeNames">
      <el-collapse-item name="1" @click="changeTitle">
        <template #title>
          <div class="title-item">
            <span @click="change()" id="title">
              <el-icon :class="{ rotate: titleIdex }" class="t">
                <CaretBottom />
              </el-icon>
              <div>操作台</div>
            </span>
          </div>
        </template>
        <div class="items">
          <p style="top: -9vh;position: relative;" :class="{ active: !collapse }" @click.stop="setActive(index)">
            <el-icon>
              <ChatSquare />
            </el-icon>自动回复
          </p>
          <p style="top: -9vh;position: relative;" :class="{ active: collapse }" @click.stop="setActive(index)">
            <el-icon>
              <ChatDotSquare />
            </el-icon>群发助手
          </p>
        </div>
      </el-collapse-item>
    </el-collapse>
  </el-aside>
  <router-view :key="$route.fullPath"></router-view>
</template>

<style scoped>
:deep(.el-collapse-item__arrow) {
  display: none;
}

.el-aside {
  position: fixed;
  height: 1000px;
  left: 60px;
  background-color: white;
  border-right: 1px solid rgba(199, 199, 199, 0.5);
  z-index: 1000;
}

.title-item {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

#title {
  height: 40px;
  padding: 0;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: row;
}

#title p {
  margin-left: 10px;
  margin-right: 35px;
}


#callable-list span,
#callable-list2 span {
  color: #1f957c;
  font-size: larger;
}



.t {
  transform: rotate(-90deg);
}

.el-icon {
  transition: transform 0.3s;
  /* 基础过渡效果 */
}

.rotate {
  transform: rotate(0deg) !important;
}


#callable-list p,
#callable-list2 p {
  text-align: center;
  display: flex;
  justify-content: center;
  /* 水平居中 */
  align-items: center;
  /* 垂直居中 */
  height: 50px;
  /* 使容器占满整个视口高度 */
  padding: 0;
}

#callable-list p:hover {
  border-radius: 20px;
  background-color: rgba(135, 184, 174, 0.1);
}



.items {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  width: 100%;
  position: relative;
  top: 75px;
}

.items p {
  width: 90%;
  height: 100%;
}


.item:first-child {
  margin-top: 40%;
}

.item p {
  text-align: center;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 50px;
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
}
</style>
