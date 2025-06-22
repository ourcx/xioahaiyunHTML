<template>
  <el-dialog
    v-model="dialogVisible"
    :title="title"
    width="500px"
    :before-close="handleClose"
    @close="resetForm"
  >
    <div class="shared-files-list">
      <p>你正在分享以下 {{sharedFilesCount}} 个文件:</p>
      <ul>
        <li v-for="file in sharedFiles" :key="file.id" v-if="sharedFiles.length < 10">
          {{ file }}
        </li>
      </ul>
    </div>
    <el-form ref="formRef" :model="form" label-width="80px">
      <el-form-item label="分享密码">
        <el-input v-model="form.password" placeholder="留空则为公共分享" clearable />
      </el-form-item>
      <el-form-item label="有效期">
        <el-radio-group v-model="form.duration">
          <el-radio-button :label="1">1天</el-radio-button>
          <el-radio-button :label="7">7天</el-radio-button>
          <el-radio-button :label="0">永久有效</el-radio-button>
        </el-radio-group>
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="handleCancel">取 消</el-button>
        <el-button type="primary" @click="handleConfirm"> 确 认 </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref, reactive, inject,toRaw } from "vue";
import { ElMessage } from "element-plus";
import apiClient from "@/utils/api";

// --- 响应式数据 ---
const dialogVisible = ref(false);
const sharedFiles = ref([]);
const formRef = ref(null);
const sharedFilesCount = ref(''); // 用于显示文件数量
const form = reactive({
  password: "1234",
  duration: 0, // 默认7天
});
const title = ref("确认分享文件");

// --- Promise 用于处理确认和取消的回调 ---
let resolvePromise = null;
let rejectPromise = null;

// --- 从父组件注入操作方法 ---
const openDialog = (filesToShare) => {
  if (!Array.isArray(filesToShare) || filesToShare.length === 0) {
    ElMessage.warning("请选择要分享的文件");
    return;
  }
  sharedFiles.value = filesToShare;
  dialogVisible.value = true;
  if(sharedFiles.value.length < 10) {
    sharedFilesCount.value = sharedFiles.value.length; // 更新文件数量
  } else {
    sharedFilesCount.value = "有部分文件没有显示,"+sharedFiles.value.length;
  }

  // 返回一个Promise，以便父组件可以等待用户操作
  return new Promise((resolve, reject) => {
    resolvePromise = resolve;
    rejectPromise = reject;
  });
};

// --- 将打开对话框的方法暴露给父组件 ---
// 注意：Vue 3.3+ 的 <script setup> 中，defineExpose 是默认的，
// 但为了清晰起见，我们通过 inject/provide 模式进行通信
// 这里我们选择注入一个控制对象
const shareControl = inject("shareControl");
if (shareControl) {
  shareControl.open = openDialog;
}

// --- 事件处理 ---
const handleClose = (done) => {
  // 可以在这里添加“关闭前确认”的逻辑
  handleCancel();
  done();
};

const handleConfirm = async() => {
  if (resolvePromise) {
    const shareData = {
      files: toRaw(sharedFiles.value),
      password: form.password || "无",
      expiresAt:new Date(),
    };
    const res=await apiClient.post("/share/create", shareData);
    console.log("分享结果:", res);
    if (res.data.code !== 200) {
      ElMessage.error("分享失败: " + res.message);
      return;
    }
    title.value = "分享成功,即将关闭窗口";

    setTimeout(() => {
      dialogVisible.value = false;
    }, 1000);
    resolvePromise(shareData); // 传递分享的设置
  }
};

const handleCancel = () => {
  if (rejectPromise) {
    rejectPromise(new Error("用户取消了分享"));
  }
  dialogVisible.value = false;
};

// --- 重置表单 ---
const resetForm = () => {
  if (formRef.value) {
    formRef.value.resetFields();
  }
  form.password = "";
  form.duration = 7;
  sharedFiles.value = [];
};
</script>

<style scoped>
.shared-files-list {
  margin-bottom: 20px;
  padding: 10px;
  background-color: #f9f9f9;
  border-radius: 4px;
  color: #000;
}
.shared-files-list p {
  margin-top: 0;
}
.shared-files-list ul {
  padding-left: 20px;
  margin-bottom: 0;
}
.dialog-footer {
  text-align: right;
}
</style>
