<template>
  <div class="share-container">
    <!-- 头部导航 -->
    <el-menu class="header" mode="horizontal" >
      <el-menu-item index="0" style="cursor: default" @click="ToHome()">
        <img
          src="https://s2.loli.net/2025/03/24/nDA7s16FJ4Rytmf.png"
          style="height: 24px"
          alt="logo"
        />
      </el-menu-item>
    </el-menu>

    <!-- 主要内容区域 -->
    <div class="main-content">
      <!-- 分享信息 -->
      <div class="share-info">
        <img
          :src="datas.avatar"
          style="height: 50px; width: 50px; border-radius: 50%"
          alt="用户头像"
        />
        <div class="share-details">
          <h2>{{ datas.username }}分享的文件</h2>
          <div class="share-meta">
            <span
              ><el-icon><User /></el-icon> {{ datas.email }}</span
            >
            <span
              ><el-icon><Clock /></el-icon> {{ datas.created_at }} 分享</span
            >
            <span
              ><el-icon><Edit /></el-icon> {{ datas.signature }}</span
            >
          </div>
        </div>
      </div>

      <!-- 文件列表 -->
      <el-table
        :data="fileList"
        style="width: 100%"
        :header-cell-style="{ background: '#f5f7fa' }"
      >
        <el-table-column width="40">
          <template #default="{ row }">
            <el-icon v-if="row.type === 'folder'"><Folder /></el-icon>
            <el-icon v-else-if="row.type == 'jpg'"><Picture /></el-icon>
            <el-icon v-else><Document /></el-icon>
          </template>
        </el-table-column>

        <el-table-column prop="name" label="文件名" width="400" />
        <el-table-column prop="size" label="大小" />
        <el-table-column prop="date" label="日期"></el-table-column>

        <el-table-column width="120">
          <template #default="{ row }">
            <el-button type="primary" size="small" @click="downloadFile(row)"
              >下载</el-button
            >
          </template>
        </el-table-column>
      </el-table>

      <!-- 操作按钮 -->
      <div class="action-buttons">
        <el-button type="primary" size="large" @click="changeMy()">转存到网盘</el-button>
      </div>
    </div>
  </div>
</template>

<script setup>
import {
  FolderOpened,
  User,
  Clock,
  Folder,
  Picture,
  Document,
  Edit,
} from "@element-plus/icons-vue";
import apiClient from "@/utils/api";
import { useRoute } from "vue-router";
import { ref, watchEffect, onMounted } from "vue";
import { useShareStore } from "@/stores/share";
import { useRouter } from "vue-router";

const shareStore = useShareStore();
const router = useRouter();
const route = useRoute();
const datas = ref({
  files: [],
});

const shareFile = async () => {
  try {
    const response = await apiClient.post("/share/getUrl", {
      one_id: route.query.one_id,
      userId: route.query.userId || null, // 可选参数
    });
    // 1. 确保正确获取到 files 数据
    const rawFiles = response.data.data?.files || [];

    // 2. 创建处理后的新数组
    const processedFiles = rawFiles.map((path) => {
      const parts = path.split("/");

      // 3. 处理不同长度的路径
      if (parts.length >= 3) {
        // 移除前两部分（users/数字）
        return parts.slice(2).join("/");
      } else if (parts.length === 2) {
        // 只有两级目录，返回空路径
        return "";
      } else {
        // 单级路径或空路径，保持原样
        console.warn("无效路径格式:", path);
        return path;
      }
    });

    // 4. 更新响应式数据
    datas.value = {
      ...response.data.data, // 保留其他数据
      files: processedFiles, // 使用处理后的文件列表
    };
  } catch (error) {
    console.error("Error fetching share file:", error);
  }
};

shareFile();
// 文件大小格式化函数
const formatFileSize = (bytes) => {
  if (typeof bytes !== "number" || bytes < 0) return "无效大小";
  if (bytes === 0) return "0 B";

  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
};

// 日期时间格式化函数
const formatDateTime = (dateString) => {
  if (!dateString) return "未知日期";

  try {
    // 创建日期对象
    const dateObj = new Date(dateString);

    // 检查日期是否有效
    if (isNaN(dateObj.getTime())) return dateString;

    // 格式化为本地时间字符串并移除 'T' 分隔符
    return dateObj
      .toLocaleString("zh-CN", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
      })
      .replace(",", "");
  } catch (e) {
    console.error("日期格式化错误:", e);
    return dateString;
  }
};

const fileList = ref([]);

// 使用 watchEffect 处理异步操作
watchEffect(async () => {
  if (!datas.value.files) return;

  const newFiles = [];

  // 使用 for...of 而不是 map，以便使用 await
  for (const file of datas.value.files) {
    const item = {};

    // 确定文件类型
    item.type = file.includes(".") ? file.split(".").pop() : "folder";

    item.name = file;

    try {
      // 获取文件元数据
      const res = await apiClient.post("/files/baseData", { name: file });
      //拿到元数据也要进行修改一下hh
      // 处理大小和日期
      item.size = formatFileSize(parseInt(res.data.data["Content-Length"], 10));
      item.date = formatDateTime(res.data.data["Last-Modified"]);

      newFiles.push(item);
    } catch (error) {
      console.error(`获取文件 ${file} 元数据失败:`, error);
      // 添加错误处理
      item.size = "未知大小";
      item.date = "未知日期";
      newFiles.push(item);
    }
  }

  fileList.value = newFiles;
});

//下载文件
const downloadFile = async (row) => {
  try {
    const response = await apiClient.post("/share/download", {
      filename: row.name,
      uuid: route.query.one_id,
    });
    const downloadUrl = response.data.previewURL;
    const link = document.createElement("a");
    link.href = downloadUrl;
    console.log("下载链接:", row.name.split("/").pop());
    const fileName = decodeURIComponent(row.name.split("/").pop());
    link.setAttribute("download", fileName); // 处理文件名
    link.style.display = "none";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } catch (error) {
    console.error("下载失败:", error);
  }
};

//后台的下载api出现了问题，导致下载的文件损坏

const changeMy = async () => {
  try {
  } catch {}
};

//解决一个安全问题
onMounted(async () => {
  const item = localStorage.getItem("verifiedShares");
  const one_id = route.query.one_id;
  const stored = item ? JSON.parse(item) : {};
  if ((stored[one_id]?.verified && Date.now() < stored[one_id]?.expires)) {
    return;
  }
  if (route.query.one_id) {
    shareStore.addShare(route.query.one_id);
    await shareStore.CheckShare();
    return;
  }
});


const ToHome = () => {
  router.push("/FirstFile");
};
</script>

<style scoped>
.share-container {
  min-height: 100vh;
  width: 100vw;
  background: #f5f7fa;
}

.header {
  background: #fff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  padding: 0 20px;
  position: fixed;
  width: 100%;
}

.main-content {
  max-width: 1200px;
  margin: 100px auto;
  padding: 0 20px;
}

.share-info {
  display: flex;
  align-items: center;
  background: #fff;
  padding: 20px;
  border-radius: 4px;
  margin-bottom: 20px;
}

.share-details {
  margin-left: 20px;
}

.share-details h2 {
  margin: 0 0 8px 0;
  color: #333;
}

.share-meta {
  display: flex;
  gap: 20px;
  color: #666;
  font-size: 14px;
}
.share-meta span {
  display: flex;
  align-items: center;
  justify-items: center;
  justify-content: center;
  gap: 5px;
}

.action-buttons {
  margin-top: 20px;
  text-align: right;
}

.el-table {
  border-radius: 4px;
  overflow: hidden;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.el-table ::v-deep(th.el-table__cell) {
  background-color: #f5f7fa;
}

.el-table ::v-deep(.el-table__row:hover) {
  background-color: #f5f7fa;
}
</style>
