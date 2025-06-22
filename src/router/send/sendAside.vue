<script setup>
import { ref, onMounted, reactive, watch } from "vue";
import { RouterView, useRouter } from "vue-router";
import apiClient from "@/utils/api";
import { useMasterPinia } from "@/stores/masterPinia";

import { ElMessage } from "element-plus";
import item from "@/components/fileTree/item.vue";
import List from "../more/list.vue";
//加载
const loading = ref(true);
onMounted(() => (loading.value = false));
const dialogTableVisible = ref(false);
const useMaster = useMasterPinia();
const id = localStorage.getItem("id");
const columns = [
  {
    title: "分享时间",
    key: "size",
  },
  {
    title: "密码",
    key: "date",
  },
  {
    title: "浏览次数",
    key: "date",
  },
];

const data = ref([
  {
    name: "2023-05-05",
    size: "2023-05-05",
    date: "2023-05-05",
    num: 1,
  },
]);

const list = ["分享记录", "收集文件"];
const activeIndex = ref(null); // 记录当前激活的段落
const titleIdex = ref(true);
const router = useRouter();

const setActive = (index) => {
  // 切换激活的段落
  activeIndex.value = activeIndex.value === index ? null : index;
  if (index === 0) {
    router.push({
      path: "/send",
      query: {
        other: "send",
      },
    });
  } else if (index === 1) {
    router.push({
      path: "/collect",
      query: {
        other: "collect",
      },
    });
  }
};

//拿到相关的数据
const getData = async () => {
  try {
    const response = await apiClient.get("/data/shareData");
    data.value = response.data.data;
    // console.log('获取数据成功:', response.data.data);
  } catch (error) {
    console.error("获取数据失败:", error);
  }
};

onMounted(() => {
  getData();
});

const Visible = (item) => {
  visible.value = true;
  shareLink.value = `http://localhost:5173/s?one_id=${item.oneId}&pwd=${item.password}&userId=${id}`;
  stats.createTime = item.createTime;
  stats.visitCount = item.fileVisit;
  form.oneId = item.oneId;
  form.password = item.password;
  dialogTableVisible.value = true;
  stats.List = item.fileName;
  // 这里可以根据需要设置其他统计信息
};

const visible = ref(true);
const shareLink = ref("");

const form = reactive({
  oneId: "",
  expire: "7d",
  enabled: true,
  password: "",
});

const stats = reactive({
  createTime: "2023-09-20 14:30",
  visitCount: 42,
  List: [],
});

const copyLink = () => {
  navigator.clipboard.writeText(props.shareLink);
  ElMessage.success("链接已复制到剪贴板");
};

const handleConfirm = () => {
  dialogVisible.value = false;
};

const handleSwitchChange = async () => {
  const res = await apiClient.post("/share/deleteShare", {
    one_id: form.oneId,
    userId: id,
  });
  console.log("禁用分享:", res);
  //关闭窗口
  dialogTableVisible.value = false;
  //回复按钮
  form.enabled = true;
  //清空表单
  data.value = [];
  //重新加载
  getData();
};
</script>

<template>
  <el-aside width="180px">
    <div class="item" v-for="(item, index) in list" key="item" @click="setActive(index)">
      <p :class="{ active: activeIndex === index }" class="i">{{ item }}</p>
    </div>
  </el-aside>
  <el-header height="80px">
    <span>链接分享(分享失败超过1年以上的链接记录将被自动清理)</span>
    <span style="font-weight: bold"
      >全部文件
      <p>已加载：{{ data.length }}文件</p></span
    >
  </el-header>
  <div class="file-list">
    <div class="file-list-header">
      <el-checkbox label="分享文件" style="margin-left: 30px; margin-right: 300px" />
      <span v-for="(item, index) in columns" :key="index">{{ item.title }}</span>
    </div>
    <div
      style="top: 3%; width: 100%; position: relative; z-index: 1000"
      v-loading="loading"
      element-loading-text="Loading..."
    >
      <div
        class="file-list-body"
        v-for="(item, index) in data"
        :key="index"
        @click="Visible(item)"
      >
        <p>
          <span>{{
            "/s?one_id=" +
            item.oneId +
            "&" +
            "pwd=" +
            item.password +
            "&" +
            "userId=" +
            id
          }}</span>
          <span>{{ item.createTime }} </span><span>{{ item.password }}</span
          ><span>{{ item.fileVisit }}</span>
        </p>
      </div>
    </div>
  </div>
  <div class="file-aside">
    <img src="https://s2.loli.net/2025/03/06/QWczYdTLty7frjp.png" />
  </div>

  <el-dialog v-model="dialogTableVisible" title="管理你的分享" width="800">
    <el-form :model="form" label-width="120px">
      <!-- 链接显示 -->
      <el-form-item label="分享链接：">
        <div class="link-container">
          <el-input v-model="shareLink" readonly> </el-input>
        </div>
      </el-form-item>

      <!-- 有效期设置 -->
      <el-form-item label="有效期：">
        <el-select v-model="form.expire" placeholder="请选择有效期">
          <el-option label="7天" value="7d" />
          <el-option label="30天" value="30d" />
          <el-option label="永久有效" value="permanent" />
        </el-select>
      </el-form-item>

      <!-- 密码设置 -->
      <el-form-item label="密码设置：">
        <el-input v-model="form.password" placeholder="请输入分享密码" disabled />
      </el-form-item>

      <!-- 统计信息 -->
      <div class="stats-container">
        <div class="stat-item">
          <span class="label">创建时间：</span>
          <span class="value">{{ stats.createTime }}</span>
        </div>
        <div class="stat-item">
          <span class="label">访问次数：</span>
          <span class="value">{{ stats.visitCount }}</span>
        </div>
        <div class="stat-item">
          <span class="label">文件：</span>
          <span
            class="value"
            v-for="(item, index) in stats.List.slice(0, 5)"
            :key="index"
            >{{ item }}</span
          >
        </div>
      </div>

      <!-- 启用/禁用开关 -->
      <el-form-item label="分享状态：">
        <el-switch
          v-model="form.enabled"
          active-text="生效"
          inactive-text="删除"
          @change="handleSwitchChange"
        />
      </el-form-item>
    </el-form>

    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogTableVisible = false">取消</el-button>
        <el-button type="primary" @click="handleConfirm">确认</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<style scoped>
.el-header {
  position: fixed;
  width: 1600px;
  left: 240px;
  top: 60px;
  display: flex;
  flex-direction: column;
  z-index: 1006;
  background-color: white;
}

.el-header span {
  float: left;
  color: black;
  margin: 5px 0 10px 0;
  font-size: small;
}

.el-header span p {
  display: inline-block;
  margin-left: 65%;
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
  z-index: 1002;
}

.file-list-header span {
  color: rgb(120, 120, 120);
  margin-left: 20px;
  margin-right: 16.5%;
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
  z-index: 10001;
  width: 63%;
}

.file-list-body {
  color: black;
  border-bottom: 1px solid rgba(95, 95, 95, 0.1);
  padding: 20px 0 20px 0;
  position: relative;
  top: 20%;
  width: 76%;
  border-right: 1px solid rgba(199, 199, 199, 0.5);
}

.file-list-body:hover {
  background-color: #e9f8f5;
}

.file-list-body span {
  display: inline-block;
  width: 20%;
  margin-left: 40px;
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

.file-aside {
  width: 21%;
  height: 100%;
  background-color: #a7a7a71a;
  position: fixed;
  right: 0;
  top: 150px;
  border-radius: 20px;
  z-index: 1009;
}

.file-aside img {
  top: 40%;
  left: 50%;
  transform: translate(-50%, -50%);
  position: absolute;
  opacity: 0.5;
  transition: opacity 0.5s ease;
}

.file-aside img:hover {
  opacity: 0.2;
}

.link-container {
  display: flex;
  gap: 10px;
  width: 100% !important;
}

.stats-container {
  margin: 20px 0;
  padding: 15px;
  background: #f8f9fa;
  border-radius: 4px;
}

.stat-item {
  display: flex;
  justify-content: space-between;
  margin: 8px 0;
}

.stat-item .label {
  color: #606266;
}

.stat-item .value {
  color: #303133;
  font-weight: 500;
}

.el-checkbox {
  margin-right: 15px;
}
</style>
