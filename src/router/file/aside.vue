<script setup>
import { Picture, Document, CaretRight, Service, Coordinate, More } from '@element-plus/icons-vue'
import { ref, computed,onMounted } from 'vue';
import { RouterView, useRouter } from 'vue-router';
import HomeHearder from '@/views/home/classification/homeHearder.vue';
import selectmore from '@/views/home/classification/selectmore.vue';
import { useFileTreeStore } from '@/stores/tree/fileTree';
import {useManagementFile} from '@/stores/tree/managementFile';
import { useRoute } from 'vue-router';
import {useManagementStore} from '@/stores/management';


const ManagementStore = useManagementStore();
const ManagementFile = useManagementFile();
const fileTreeStore = useFileTreeStore()
const list = [
  { icon: Picture, label: '图片',type:'img' },
  { icon: Document, label: '文档',type:'file' },
  { icon: CaretRight, label: '视频',type:'video' },
  { icon: Service, label: '音频',type:'mp3' },
  { icon: Coordinate, label: 'doc',type:'doc' },
  { icon: More, label: '其他',type:'more' },
  { label: '回收站' ,type:'recycle'} // 没有图标的项
]
const activeNames = ['1']
const activeIndex = ref(null); // 记录当前激活的段落
const titleIdex = ref(true);
const router = useRouter();
const route=useRoute()




const setActive = (index) => {
  fileTreeStore.clearResult();
  // 切换激活的段落
  activeIndex.value = activeIndex.value === index ? null : index;
  if (index === 0) {
    router.push({
      path: '/firstFile/img',
      query:{
        type:'img'
      }
    });
  } else if (index === 1) {
    router.push({
      path: '/firstFile/file',
      query: {
        type: 'file',
        level: 0
      },
    });
  }
  else if (index === 2) {
    router.push({
      path: '/firstFile/mp4',
      query: {
        type: 'video'
      },
    });
  }
  else if (index === 3) {
    router.push({
      path: '/firstFile/mp3',
      query: {
        type: 'mp3'
      },
    })
  }
    else if (index === 4) {
    router.push({
      path: '/firstFile/doc',
      query: {
        type: 'doc'
      },
    })
  }
  else if (index === 5) {
    router.push({
      path: '/firstFile/other',
      query: {
        type: 'other'
      },
    })
  } else  if (index === 6) {
    router.push({
      path: '/firstFile/recycle',
      query: {
        type: 'recycle'
      }
    })
  }
};

const changeTitle = () => {
  titleIdex.value = !titleIdex.value;
  if (!titleIdex.value) {
    activeIndex.value = null;
  }
};



onMounted(async()=>{
 ManagementStore.progress()
})

const headerComponent = computed(() => ManagementFile.headerFile);


</script>


<template>
  <el-aside width="180px">
    <el-collapse id="callable-list" v-model="activeNames">
      <el-collapse-item name="1">
        <template #title>
          <div class="title-item">

            <span :class="{ 'title': true }" @click="changeTitle()" id="title">
              <div class="l"></div>
              <el-icon :class="{ rotate: titleIdex }" class="t">
                <CaretBottom />
              </el-icon>
              <p>我的文件</p>
              <!-- p这里被其他样式影响了 -->
              <el-icon style="transform: rotate(90deg);">
                <More />
              </el-icon>
              <div class="l"></div>
            </span>
          </div>
        </template>
        <div class="item" v-for="(item, index) in list" :key="index" @click="setActive(index)">
          <p :class="{ active: activeIndex === index||route.query.type==item.type }" class="i">
            <component :is="item.icon" class="el-icon" style="margin-right: 5px;" />
            {{ item.label }}
          </p>
        </div>
      </el-collapse-item>
    </el-collapse>
    <el-collapse id="callable-list2" v-model="activeNames">
      <el-collapse-item name="2">
        <template #title>
          <span
            style="width: 100%;text-align: center;display: flex;flex-direction: row;align-items: center;justify-content: center;gap: 5px;">
            <el-icon>
              <CaretBottom />
            </el-icon>
            <p>快捷访问</p>
          </span>
        </template>
        <div>
          <p>你好</p>
        </div>
      </el-collapse-item>
    </el-collapse>
    <div class="flooter">
      <div class="demo-progress">
        <el-progress :text-inside="true" :stroke-width="14" :percentage="parseInt(parseInt(ManagementStore.progreCount)/124)" :status="parseInt(parseInt(ManagementStore.progreCount)/124)>=70?'exception':'success'" />
          <!-- 数据条 -->
      </div>
      <p>{{ManagementStore.progreCount}}/5G</p>
    </div>
  </el-aside>
  <HomeHearder v-if="(headerComponent==='HomeHearder'||headerComponent==='selectFIrist')&&route.path != '/firstFile/recycle' "/>
  <selectmore v-else-if="headerComponent==='selectmore'&&route.path != '/firstFile/recycle' "/>
  <!-- 使用模板生成组件 -->
  <router-view>
  </router-view>
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

.l {
  width: 15px;
  height: 100%;
}

#callable-list {
  margin-top: 65px;
}

#callable-list span,
#callable-list2 span {
  color: #1f957c;
  font-size: larger;
}



.title {
  background-color: #def0ec;
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

.flooter {
  position: fixed;
  bottom: 0;
  height: 80px;
  width: 160px;
  left: 70px;
}

.flooter p {
  color: black;
}

.demo-progress .el-progress--line {
  max-width: 600px;
}

.el-progress-bar__outer {
  background-color: rgba(39, 186, 155, 0.5);
}

.demo-progress {
  margin-top: 20px;
}

/* .el-progress-bar__innerText{
  bottom: 10px;
} */
</style>
