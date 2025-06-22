<script setup>
import { ref, computed, onMounted } from "vue";
import { useUpLoadStore } from "@/stores/upload";
import { useFileTreeStore } from "@/stores/tree/fileTree";
import axios from "axios";

const fileTreeStore = useFileTreeStore();
const upLoadStore = useUpLoadStore();
const url = ref("");
const centerDialogVisible = computed(() => upLoadStore.centerDialogVisible);
const fileList = ref([]);
const errorList = ref([]);
const failList = ref([]);
const tipList = ref([]);
// 自定义上传方法
const customUpload = async (options) => {
  const { file, onProgress, onSuccess, onError } = options;
  console.log(file);
  if (fileTreeStore.targetChildren.hasOwnProperty(file.name)) {
    errorList.value.push(file.name);
    return onError("文件已存在");
  } else if (file.size > 1024 * 1024 * 500) {
    tipList.value.push(`${file.name}文件大小(${file.size})超过500M，请重新上传`);
  }
  //分块上传？

  await handleDialogOpen(file.name);
  console.log(url.value);
  try {
    // 使用 axios 发送 PUT 请求
    const response = await axios.put(url.value, file, {
      headers: {
        "Content-Type": file.type || "application/octet-stream",
      },
      onUploadProgress: (progressEvent) => {
        const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
        onProgress({ percent }, file);
      },
    });

    onSuccess(response, file);
    //上传成功，调用刷新树形结构
    fileTreeStore.arr1 = [];
    fileTreeStore.index = 0;
    fileTreeStore.filepath = [];
    fileTreeStore.result = [];
    fileTreeStore.init();
  } catch (error) {
    onError(error, file);
    // 上传失败
    failList.value.push(file.name);
  }
};

// 对话框打开时的处理
const handleDialogOpen = async (path) => {
  let basePath = fileTreeStore.routeArr.slice(2).join("/") || "";
  basePath = basePath + path;
  try {
    const up = await upLoadStore.getUploadUrl(basePath);
    url.value = up;
  } catch (error) {
    console.error("获取上传URL失败:", error);
    url.value = "";
  }
};

// 对话框关闭时的清理
const handleDialogClose = () => {
  console.log("对话框关闭，执行清理");
  url.value = "";
  errorList.value = [];
};
</script>

<template>
  <el-dialog
    v-model="centerDialogVisible"
    title="上传文件"
    width="500"
    destroy-on-close
    center
    :close-on-click-modal="false"
    @closed="handleDialogClose"
  >
    <div>
      <el-upload
        class="upload-demo"
        drag
        :action="url"
        :http-request="customUpload"
        multiple
        v-model="fileList"
      >
        <el-icon class="el-icon--upload"><upload-filled /></el-icon>
        <div class="el-upload__text">拖动文件 <em>点击选择文件</em></div>
        <template #tip>
          <div class="el-upload__tip">
            不适合传递过大的文件或者文件夹，上传文件的位置根据当前的文件夹确定
          </div>
        </template>
      </el-upload>
      <div v-for="item in errorList" :key="item" class="error">
        <div>{{ item }}</div>
        已经存在，请修改名字再上传
      </div>
      <div v-for="item in failList" :key="item" class="fail">
        <div>{{ item }}</div>
        文件上传失败
      </div>
      <div class="tip" v-for="item in tipList" :key="item">{{ item }}</div>
    </div>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="upLoadStore.ChangeUpload()">取消</el-button>
      </div>
    </template>
  </el-dialog>
  <!-- 这里要优化上传逻辑 -->
  <!-- 上传之后文件列表的更新，已经重新请求数据，上传的加载什么的，上传的那个url还有点问题 -->
</template>

<style scoped>
.error {
  width: 100%;
}
.error div {
  text-align: center;
  color: #ffb302;
  display: inline-block;
}

.fail {
  width: 100%;
}
.fail div {
  text-align: center;
  color: #cf4444;
  display: inline-block;
}

.tip {
  width: 100%;
  color: #27b99a;
}
</style>






