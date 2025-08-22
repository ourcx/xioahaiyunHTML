<script setup>
import { ref, computed, onMounted } from "vue";
import { useUpLoadStore } from "@/stores/upload";
import { useFileTreeStore } from "@/stores/tree/fileTree";
import axios from "axios";
import { listMultipartUploads, InitUpload, uploadPart, completeMultipartUpload } from "../../hook/upload";


const fileTreeStore = useFileTreeStore();
const upLoadStore = useUpLoadStore();
const url = ref("");
const centerDialogVisible = computed(() => upLoadStore.centerDialogVisible);
const fileList = ref([]);
const errorList = ref([]);
const failList = ref([]);
const tipList = ref([]);


//上传需要的函数

async function startUpload(file, key) {
  try {
    const { uploadId } = await InitUpload(file, key);
    console.log('Upload ID:', uploadId);
    return uploadId; // 保存此ID用于后续操作
  } catch (err) {
    console.error('初始化失败', err);
  }
}
const CHUNK_SIZE = 5 * 1024 * 1024; // 5MB分片

async function uploadFileParts(file, key, uploadId) {
  const totalParts = Math.ceil(file.size / CHUNK_SIZE);
  const parts = [];

  for (let partNumber = 1; partNumber <= totalParts; partNumber++) {
    const start = (partNumber - 1) * CHUNK_SIZE;
    const end = Math.min(start + CHUNK_SIZE, file.size);
    const chunk = file.slice(start, end);

    try {
      const result = await uploadPart({
        key,
        partNumber,
        chunk,
        uploadId
      });
      parts.push(result);
      console.log(`分片 ${partNumber}/${totalParts} 上传成功`);
    } catch (err) {
      console.error(`分片 ${partNumber} 上传失败`, err);
      throw err; // 中断上传
    }
  }
  return parts.sort((a, b) => a.PartNumber - b.PartNumber);
}

async function finishUpload(key, uploadId, parts) {
  try {
    const fileUrl = await completeMultipartUpload({
      key,
      uploadId,
      parts: parts.map(p => ({
        PartNumber: p.PartNumber,
        ETag: p.ETag
      }))
    });
    console.log('文件上传成功', fileUrl);
    return fileUrl;
  } catch (err) {
    console.error('完成上传失败', err);
  }
}




// 自定义上传方法
const customUpload = async (options) => {
  const { file, onProgress, onSuccess, onError } = options;

  if (fileTreeStore.targetChildren.hasOwnProperty(file.name)) {
    errorList.value.push(file.name);
    return onError("文件已存在");
  } else if (file.size > 1024 * 1024 * 500) {
    tipList.value.push(`${file.name}文件大小(${file.size})超过500M，开始分片上传`);
    //分块上传
    const Key = fileTreeStore.routeArr.slice(2).join("/") + "/" + file.name;
    const ID=await startUpload(file,Key);
    const uploadedParts = await uploadFileParts(file, Key, ID);
    await finishUpload(Key, ID, uploadedParts);
    //大于这么多的时候进行上传，每次上传5MB的分片
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
    tipList.value.push("已经完成上传，进行列表刷新")
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
        <el-button @click="upLoadStore.ChangeUpload()">退出</el-button>
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






