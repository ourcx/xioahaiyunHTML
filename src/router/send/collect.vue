<script setup>
import { ref,onMounted } from 'vue';
import { RouterView, useRouter } from 'vue-router';

//加载
const loading = ref(true);
onMounted(() => loading.value = false)

const columns = [
  {
    title: '发送人数',
    key: 'size',
  },
  {
    title: '截至日期',
    key: 'date',
  },
  {
    title: '状态',
    key: 'date',
  },
];



const data = ref([])


const list = ['分享记录', '收集文件']
const activeIndex = ref(null); // 记录当前激活的段落
const titleIdex = ref(true);
const router = useRouter();



const setActive = (index) => {
  // 切换激活的段落
  activeIndex.value = activeIndex.value === index ? null : index;
  if(index === 0){
    router.push({
      path: '/send',
      query: {
        other:'send'
      },
    })
  }else if(index === 1){
    router.push({
      path: '/collect',
      query: {
        other:'collect'
      },
    })
  }
}



</script>



<template>
  <el-aside width="180px">
    <div class="item" v-for="(item, index) in list" key="item" @click="setActive(index)">
      <p :class="{ active: activeIndex === index }" class="i">{{ item }}</p>
    </div>
  </el-aside>
  <el-header height="80px">
    <span>
      <el-button type="primary" round class="header-button-create">求资料</el-button>
      <el-button-group>
        <el-button round class="header-button-create">远程收文件</el-button>
        <el-button round class="header-button-create">收作业</el-button>
      </el-button-group>
      <span style="margin-left: 70%;position: relative;top: -50%;"> 了解收集文件</span>
    </span>
    <span style="font-weight: bold;">我的收集<p>已加载：100文件</p></span>
  </el-header>
  <div class="file-list">
    <div class="file-list-header">
      <el-checkbox label="文件名" style="margin-left: 30px;margin-right: 300px;" />
      <span v-for="(item, index) in columns" :key="index">{{ item.title }}</span>
    </div>
    <div style="top: 5%;width: 100%;position: relative;z-index: 1000;" v-loading="loading" element-loading-text="Loading...">
      <div class="file-list-body" v-for="(item, index) in data" :key="index">
        <p><span>{{ item.name }}</span> <span>{{ item.size }} </span><span>{{ item.date }}</span><span>{{
          item.num }}</span>
        </p>
      </div>
    </div>
  </div>
</template>





<style scoped>
.el-header {
  position: fixed;
  width: 1600px;
  height: auto;
  left: 240px;
  top: 60px;
  display: flex;
  flex-direction: column;
  z-index: 1006;
  background-color: white;
}

.el-header span:first-child {
  height: 60px;
}


.header-button-create {
  margin-left: 2%;
  margin-top: 1%;

}

.el-button-group{

  width: 60%;
  margin-top: 0.6%;
  margin-left: 3%;
}

.el-button-group button{
  color: #27ba9b;
  background-color: #e9f8f5;
}

.el-button-group button:hover {
  background-color: #27ba9b;
  color: #fff;
}


.el-header span:last-child {
  float: left;
  color: black;
  margin: 5px 0 10px 0;
  font-size: small;
}

.el-header span p {
  display: inline-block;
  margin-left: 65%
}



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
}


.item p:hover {
  border-radius: 20px;
  background-color: rgba(135, 184, 174, 0.1);
}



.item{
  display: flex;
  align-items: center;
  justify-content: center;
}

.i{
  width: 90%;
  text-align: center;
  line-height: auto;
}



.active {
  border-radius: 20px;
  background-color: rgba(39, 186, 155, 0.1);
  color: rgba(39, 186, 155, 0.5);
}



.file-list {
  margin-top: -5px;
  margin-left: -10px;
  height: 100%;
  width: 100%;
  box-sizing: border-box;
  overflow-y: auto;
  position: relative;
  left: 250px;
  top: 140px;
  font-size: 100%;
  position: relative;
  overflow-x: hidden;
  z-index: 1005;
}

.file-list-header span {
  color: rgb(120, 120, 120);
  margin-left: 50px;
  margin-right: 13.5%;
  display: inline-block;
}

.file-list-header span:last-child {
  color: rgb(120, 120, 120);
  margin-left: 0;
  margin-right: 0;
}


.file-list-header {
  border-bottom: 1px solid rgba(95, 95, 95, 0.1);
  position: fixed;
  background-color: white;
  top: 18%;
  width: 100%;
  z-index: 1002;
}

.file-list-body {
  position: fixed;
  color: black;
  border-bottom: 1px solid rgba(95, 95, 95, 0.1);
  padding: 20px 0 20px 0;
  position: relative;
  top: 20%;
  width: 100%;
  border-right: 1px solid rgba(199, 199, 199, 0.5);

}

.file-list-body:hover {
  background-color: #e9f8f5;
}

.file-list-body span {
  display: inline-block;
  width: 20%;
  margin-left: 5%;
}

.file-list-body span:first-child {
  margin-left: 30px;
  width: 350px;
}

.file-list-body span:last-child {
  width: 60px;
  margin-left: 0;
  text-align: center;
}
</style>
