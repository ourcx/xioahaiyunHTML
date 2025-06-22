<script setup>
import {
  reactive,
  ref,
  onMounted,
  toRaw,
  computed,
  watch,
  onUpdated,
  onBeforeUpdate,
  nextTick,
  onUnmounted,
  provide,
} from "vue";
import { icons } from "@/assets/base64/image";
import tree from "@/components/fileTree/tree.vue";
import { useRoute } from "vue-router"; //1.先在需要跳转的页面引入useRouter
import { useRouter } from "vue-router"; //1.先在需要跳转的页面引入useRouter
import { useCounterStore } from "@/stores/tree/tree";
import { useFileTreeStore } from "@/stores/tree/fileTree";
import { useManagementFile } from "@/stores/tree/managementFile";
import { Edit } from "@element-plus/icons-vue";
import apiClient from "@/utils/api";
import Move from "@/components/FIleMove/Move.vue";
import FIleShare from "@/components/share/FIleShare.vue";

//要写一个文件点击时候处理的函数
//包括点击时文件夹树的更新和点击后进入文件内部，需要去请求数据，还有展示内部的新组件（跳转到对应的路由）

const type = ref("");
const ManagementFile = useManagementFile();
const fileTreeStore = useFileTreeStore();
const levelStore = useCounterStore();
const loading = ref(true);
const dialogVisible = ref(false);
const router = useRouter(); //1.在需要跳转的页面定义router变量，使用useRouter获取路由实例
fileTreeStore.result = []; // 初始化结果数组
const empty = ref(false);

const { query, params } = useRoute(); //2.在跳转页面定义router变量，解构得到指定的query和params传参的参数

const loadData = async () => {
  try {
    loading.value = true;
    const type = route.query.type;

    if (type === "file") {
      await fileTreeStore.init();
    } else if (type) {
      await fileTreeStore.special(type);
    }
  } catch (error) {
    console.error("数据加载失败:", error);
  } finally {
    loading.value = false;
  }
};

const columns = [
  {
    title: "文件名",
    key: "name",
  },
  {
    title: "大小",
    key: "size",
  },
  {
    title: "修改时间",
    key: "date",
  },
];

const isExpanded = ref("");

//状态栏
const sortList = (key) => {
  if (key === "size") {
    if (fileTreeStore.sort === "size") {
      isExpanded.value = key;
      fileTreeStore.sort = "-size";
    } else {
      fileTreeStore.sort = "size";
      isExpanded.value = "";
    }
    fileTreeStore.sortResult();
  } else if (key === "date") {
    if (fileTreeStore.sort === "date") {
      isExpanded.value = key;
      fileTreeStore.sort = "-date";
    } else {
      fileTreeStore.sort = "date";
      isExpanded.value = "";
    }
    fileTreeStore.sortResult();
  } else if (key === "name") {
    isExpanded.value = key;
    fileTreeStore.sort = "name";
    fileTreeStore.sortResult();
  }
};
// 访问状态

const data = ref([]);
watch(
  () => fileTreeStore.result,
  (newValue) => {
    data.value = fileTreeStore.result;
    if (fileTreeStore.result.length === 0) {
      empty.value = true;
      loading.value = true;
    } else {
      loading.value = false;
      empty.value = false;
    }
  },
  { immediate: true, deep: true } // ✅ 添加深度监听
);




const route = useRoute();

// ✅ 在组件挂载时加载数据
onMounted(loadData);
watch(
  () => route.query.type,
  (newType, oldType) => {
    fileTreeStore.result = []; // 清空之前的数据
    loading.value = true; // 显示加载状态
    loadData();
  }
);

//关于鼠标的显示事件

const divDomList = ref({});
const check = ref({});
const shareCheck = ref({});
watch(
  () => check.value,
  (newValue) => {
    let items = check.value;
    const numberOfKeys = Object.keys(items).length;
    console.log("选中的文件", items);
    fileTreeStore.checked = check.value;
    // 根据条件设置 header
    if (numberOfKeys === 0) {
      ManagementFile.headerFile = "HomeHearder"; // ✅ 修正拼写错误
    } else if (numberOfKeys === 1) {
      ManagementFile.headerFile = "selectFIrist"; // ✅ 修正为 selectFirst
    } else {
      ManagementFile.headerFile = "selectmore";
    }
  },
  {
    deep: true, // 深度监听对象内部变化
    immediate: true, // 初始化立即执行
  }
);
//监听路径数组
watch(
  () => fileTreeStore.routeArr,
  (newValue) => {
    check.value = {}// 清空之前的选中状态
    shareCheck.value = {}; // 清空分享状态
  },
  { immediate: true, deep: true } // ✅ 添加深度监听
);
watch(
  () => dialogVisible.value,
  () => {
    console.log("dialogVisible.value", dialogVisible.value);
    if (!dialogVisible.value) {
      check.value = {};
      shareCheck.value = {}; // 清空分享状态
    }
  }
);

const checked = (name,path="") => {
  const item =  fileTreeStore.routeArr.slice(0,2).join("/")+"/"+path + name;
  shareCheck.value= {
    ...shareCheck.value,
    [item]: true, // 保留 true 值便于后续逻辑判断
  };
  console.log(shareCheck.value);
  // 使用 hasOwnProperty 安全判断属性是否存在
  if (check.value.hasOwnProperty(name)) {
    // 移除属性（响应式安全操作）
    const newCheck = { ...check.value };
    delete newCheck[name];
    check.value = newCheck;
  } else {
    // 添加属性（响应式安全操作）
    check.value = {
      ...check.value,
      [name]: true, // 保留 true 值便于后续逻辑判断
    };
  }
};

const getDivDom = (item) => {
  divDomList.value[item.name] = true;
};
const nogetDivDom = (item) => {
  if (check.value[item.name]) return;
  divDomList.value[item.name] = false;
};

//选择框

//处理base64图片

//使用hash表进行优化
// 预编译阶段：构建高性能映射表（只需执行一次）
const iconMap = (() => {
  // 路由类型直接映射表
  const routeMap = {
    mp3: icons.mp3,
    other: icons.other,
    video: icons.video,
    doc: icons.doc,
  };

  // 文件扩展名哈希表（全小写）
  const extMap = {
    // 文件夹类型
    __folder: icons.folder,
    // 音频
    ".mp3": icons.mp3,
    // 视频
    ".mp4": icons.video,
    // 文档
    ".doc": icons.doc,
    ".docx": icons.doc,
    ".pdf": icons.pdf,
    // 表格
    ".xls": icons.excel,
    ".xlsx": icons.excel,
    // 图片
    ".png": icons.img,
    ".jpg": icons.img,
    ".jpeg": icons.img,
    // 幻灯片
    ".ppt": icons.ppt,
    ".pptx": icons.ppt,
    // 其他
    ".md": icons.md,
    // 默认值
    __default: icons.other,
  };

  return { routeMap, extMap };
})();

// 高性能版本实现
const url = (item) => {
  const routeType = route.query.type;

  // 第一层：路由类型快速匹配 (O(1))
  if (routeType in iconMap.routeMap) {
    return iconMap.routeMap[routeType];
  }

  // 第二层：仅处理file类型
  if (routeType === "file") {
    // 优先处理文件夹类型 (1次判断)
    if (item.type) return iconMap.extMap.__folder;

    // 提取扩展名（优化版）
    const name = item.name;
    let extIndex = name.lastIndexOf(".");
    if (extIndex === -1) return iconMap.extMap.__default;

    // 小写转换+直接哈希查询 (O(1))
    const ext = name.slice(extIndex).toLowerCase();
    return iconMap.extMap[ext] || iconMap.extMap.__default;
  }
  return iconMap.extMap.__default;
};
const enter = async (item) => {
  if (item.type) {
    loading.value = true;
    await fileTreeStore.init(item.name);
    loading.value = false;
  } else if (item.name.split(".").pop().toLowerCase() == "md") {
    if (route.query.type != "file") {
      router.push({
        path: "/previewMd",
        query: {
          style: item.basePath + item.name,
          type: item.type,
          name: item.name,
        },
      });
      return;
    }
    router.push({
      path: "/previewMd",
      query: {
        style: fileTreeStore.routeArr.slice(2).join("/") + "/" + item.name,
        type: item.type,
        name: item.name,
      },
    });
  } else if (item.name.split(".").pop().toLowerCase() == "mp4") {
    if (route.query.type != "file") {
      router.push({
        path: "/firstFile/mp4/videoPlay",
        query: {
          style: item.basePath + item.name,
          type: item.type,
          name: item.name,
          date: item.date,
          size: item.size,
        },
      });
      return;
    }
    router.push({
      path: "/firstFile/mp4/videoPlay",
      query: {
        style: fileTreeStore.routeArr.slice(2).join("/") + "/" + item.name,
        type: item.type,
        name: item.name,
        date: item.date,
        size: item.size,
      },
    });
  } else {
    if (route.query.type != "file") {
      router.push({
        path: "/preview",
        query: {
          style: item.basePath + item.name,
          type: item.type,
          name: item.name,
        },
      });
      return;
    }
    router.push({
      path: "/preview",
      query: {
        style: fileTreeStore.routeArr.slice(2).join("/") + "/" + item.name,
        type: item.type,
        name: item.name,
      },
    });
  }
};

const editingFileName = ref(null);
const oldName = ref(null);
const tempName = ref(""); // 临时存储修改值
// 进入编辑模式
const startEdit = (fileName) => {
  tempName.value = fileName;
  editingFileName.value = fileName;
  oldName.value = fileName;
  nextTick(() => {
    // 自动聚焦输入框
    document.querySelector(".edit-mode input")?.focus();
    // 如果使用组合式API ref：
    // editInput.value?.focus()
  });
};

// 取消修改
const cancelEdit = () => {
  editingFileName.value = null;
};

//提交重命名
const submitRename = async (fileName, item) => {
  if (route.query.type != "file") {
    try {
      const response = await apiClient.put("/files/RenameFile", {
        oldName: item.basePath + oldName.value,
        newName: item.basePath + fileName,
      });
      console.log("重命名成功", response.data);
    } catch (error) {
      console.error("重命名失败", error);
    }
    fileTreeStore.result.forEach((item) => {
      if (item.name === oldName.value) {
        item.name = fileName;
      }
    });
    editingFileName.value = null;
    return;
  }
  const slicedPath = fileTreeStore.routeArr.slice(2).join("/");
  const base = slicedPath ? slicedPath + "/" : "";
  try {
    const response = await apiClient.put("/files/RenameFile", {
      oldName: base + oldName.value,
      newName: base + fileName,
    });
    console.log("重命名成功", response.data);
  } catch (error) {
    console.error("重命名失败", error);
  }
  fileTreeStore.result.forEach((item) => {
    if (item.name === oldName.value) {
      item.name = fileName;
    }
  });
  editingFileName.value = null;
};

//移动文件
const MoveControl = (name, t = "") => {
  dialogVisible.value = !dialogVisible.value;
  console.log("MoveControl", dialogVisible.value);
  type.value = t;
  if (name === "") {
    return;
  }
  check.value = {
    ...check.value,
    [name]: true, // 保留 true 值便于后续逻辑判断
  };
};

const handleMoveControl = () => {
  // 处理移动逻辑
  dialogVisible.value = false; // 操作完成后关闭对话框
};

//文件下载
const downloadFile = async (item) => {
  try {
    if (route.query.type != "file") {
      const response = await apiClient.post("/files/Dscribe", {
        filename: item.basePath + item.name,
      });
      // 创建下载链接
      const url = response.data.previewURL;
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", item.name); // 设置下载文件名
      link.style.display = "none";
      document.body.appendChild(link);
      link.click(); // 触发下载
      document.body.removeChild(link); // 移除链接元素
    } else {
      const slicedPath = fileTreeStore.routeArr.slice(2).join("/");
      const base = slicedPath ? slicedPath + "/" : "";
      const response = await apiClient.post("/files/Dscribe", {
        filename: base + item.name,
      });

      // 创建下载链接
      const url = response.data.previewURL;
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", item.name); // 设置下载文件名
      link.style.display = "none";
      document.body.appendChild(link);
      link.click(); // 触发下载
      document.body.removeChild(link); // 移除链接元素
    }
  } catch (error) {
    console.error("下载失败:", error);
  }
};

// 删除文件
const confirmEvent = async (item) => {
  try {
    console.log("删除文件:", item);
    if (route.query.type != "file") {
      await apiClient.post("/files/removeFIleName", {
        TrashFiles: item.basePath + item.name + (item.type ? `/` : ""),
      });
      console.log("删除成功:", item.name);
    } else {
      const slicedPath = fileTreeStore.routeArr.slice(2).join("/");
      const base = slicedPath ? slicedPath + "/" : "";
      await apiClient.post("/files/removeFIleName", {
        filename: base + item.name + (item.type ? `/` : ""),
      });
      console.log("删除成功:", base + item.name + (item.type ? `/` : ""));
    }
    // 从结果数组中移除已删除的文件
    fileTreeStore.result = fileTreeStore.result.filter((i) => i.name !== item.name);
  } catch (error) {
    console.error("删除失败:", error);
  }
};

//清空某个东西
watch(
  () => dialogVisible.value,
  (newValue) => {
    if (!newValue) {
      Object.keys(check.value).forEach((key) => {
        check.value[key] = false;
      });
    }
  }
);

//懒加载
let throttleTimer = null;
const handleScroll = () => {
  if (fileTreeStore.lazyPathArr.length == 0) return;
  fileTreeStore.lazyLoad();
};
// 添加节流优化
const throttledScroll = () => {
  if (throttleTimer) return;
  throttleTimer = setTimeout(() => {
    handleScroll();
    throttleTimer = null;
  }, 500);
};
onUnmounted(() => {
  throttleTimer = null;
});

//监听选择多文件的时候的状态
watch(
  () => ManagementFile.selects, // 获取当前状态值
  (newVal, oldVal) => {
    console.log("selects changed:", newVal);

    if (newVal === "move") {
      MoveControl(""); // 调用外部函数
    } else if (newVal === "copy") {
      MoveControl("", "copy");
    }

    // 可以添加其他状态的处理逻辑
  },
  { deep: true } // 如果需要深度监听对象/数组
);

//分享函数


// --- provide ---
// 创建一个响应式对象，用于子组件注入并挂载其控制方法
const shareControl = reactive({
  open: null, // 这个 open 方法将由子组件填充
});

// 将 shareControl 提供给后代组件
provide('shareControl', shareControl);

const shareFile = async(item) => {
  console.log(shareCheck.value);
  const list = new Set()
  const r = fileTreeStore.routeArr.slice(0,2).join("/")+"/"
  if (route.query.type != "file") {
    console.log("分享文件11111111111111111111111111111111111:", r + item.basePath + item.name);
    const res = r+item.basePath + item.name
    list.add(res);
  } else {
    const slicedPath = fileTreeStore.routeArr.join("/");
    const base = slicedPath ? slicedPath + "/" : "";
    list.add(base + item.name);
  }
  Object.keys(shareCheck.value).forEach((key) => {
    if (shareCheck.value[key]) {
      list.add(key);
    }
  });
  await shareControl.open(Array.from(list));
};
</script>

<template>
  <Move
    :dialogVisible="dialogVisible"
    @update:dialog-visible="(val) => (dialogVisible = val)"
    :check="check"
    :type="type"
    @move-control="handleMoveControl"
    v-model:dialog-visible="dialogVisible"
  />
  <FIleShare></FIleShare>
  <el-main @scroll="throttledScroll">
    <el-header height="40px">
      <p class="text" v-if="query.type != 'file' || toRaw(levelStore.level).length === 0">
        全部{{ query.type }}
      </p>
      <tree
        :type="query.type"
        v-if="query.type == 'file' && toRaw(levelStore.level).length > 0"
      />
      <div class="file-list-header">
        <span v-for="(item, index) in columns" :key="item.key" @click="sortList(item.key)"
          >{{ item.title }}
          <el-icon>
            <Top v-if="isExpanded == item.key" />
            <Bottom v-else /> </el-icon
        ></span>
        <el-dropdown>
          <el-button text class="mb-4">
            <el-icon class="el-icon--right"><arrow-down /></el-icon>
          </el-button>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item>列表模式</el-dropdown-item>
              <el-dropdown-item>缩略模式</el-dropdown-item>
              <el-dropdown-item>大图模式</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
    </el-header>

    <div
      class="file-list"
      v-loading="loading"
      element-loading-text="Loading..."
      element-loading-custom-class="loading"
    >
      <TransitionGroup name="list" tag="p">
        <div class="file-q" v-if="empty">
          <el-empty description="暂无文件" :image="simpleImage" image-size="150" />
        </div>
        <div
          class="file-list-body"
          v-for="(item, index) in fileTreeStore.result"
          :key="index"
          @mouseover="getDivDom(item)"
          @mouseout="nogetDivDom(item)"
        >
          <!-- :fit="fit" -->
          <p v-show="!divDomList[item.name] && editingFileName !== item.name">
            <el-image style="width: 25px; height: 25px" :src="url(item)" /><span>{{
              item.name
            }}</span>
            <span>{{ item.size }} </span><span>{{ item.date }}</span>
          </p>

          <Transition name="fade" tag="div">
            <!-- 编辑模式 -->
            <div v-show="editingFileName === item.name" class="edit-mode">
              <el-input
                v-model="tempName"
                ref="editInput"
                size="small"
                style="width: 240px"
              >
              </el-input>
              <div class="edit-but">
                <el-button
                  size="small"
                  @click="submitRename(tempName, item)"
                  plain
                  type="primary"
                >
                  <!-- 紧凑按钮 -->
                  √
                </el-button>
                <el-button size="small" @click="cancelEdit" plain type="primary">
                  <!-- 紧凑按钮 -->
                  X
                </el-button>
              </div>
            </div>
          </Transition>

          <div
            v-show="divDomList[item.name] && editingFileName !== item.name"
            :class="{ active: check[item.name] }"
            class="checkbox"
          >
            <el-checkbox
              :v-model="check[item.name]"
              size="small"
              label="   "
              @click="checked(item.name,item.basePath)"
            /><span id="text" @click="enter(item)">{{ item.name }}</span>
            <el-icon>
              <Link />
            </el-icon>
            <el-icon>
              <Download @click="downloadFile(item)" />
            </el-icon>
            <el-popconfirm
              confirm-button-text="执行"
              cancel-button-text="取消"
              icon-color="#f90"
              title="是否要执行删除文件夹"
              @confirm="confirmEvent(item)"
              :teleported="false"
            >
              <!--  @confirm="confirmEvent" @cancel="cancelEvent" -->
              <template #reference>
                <el-icon>
                  <Delete />
                </el-icon>
              </template>
            </el-popconfirm>
            <el-icon @click="startEdit(item.name)">
              <Edit />
            </el-icon>
            <div style="color: #27ba9b; height: 100%; display: flex; align-items: center">
              <el-dropdown style="margin-left: 15px" :teleported="false">
                <el-icon>
                  <More style="color: #27ba9b" />
                </el-icon>
                <template #dropdown>
                  <el-dropdown-menu>
                    <el-dropdown-item @click="MoveControl(item.name, 'copy')"
                      ><el-icon>
                        <DocumentCopy /> </el-icon
                      >复制</el-dropdown-item
                    >
                    <el-dropdown-item @click="MoveControl(item.name)"
                      ><el-icon>
                        <Rank /> </el-icon
                      >移动</el-dropdown-item
                    >
                    <el-dropdown-item
                      ><el-icon>
                        <FolderAdd /> </el-icon
                      >导出项目目录</el-dropdown-item
                    >
                    <el-dropdown-item @click="shareFile(item)"
                      ><el-icon>
                        <Place /> </el-icon
                      >共享</el-dropdown-item
                    >
                  </el-dropdown-menu>
                </template>
              </el-dropdown>
            </div>
          </div>
        </div>
      </TransitionGroup>
    </div>
  </el-main>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.list-enter-active,
.list-leave-active {
  transition: all 0.5s ease;
}

.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: translateX(30px);
}

.loading {
  position: absolute;
  left: -240px;
  top: -180px;
}

.el-main {
  position: fixed;
  left: 240px;
  top: 180px;
  width: 100%;
  height: 100vh;
  background-color: white !important;
  z-index: 1003;
}

.el-header {
  position: fixed;
  width: 100%;
  top: 120px;
  left: 240px;
  background-color: white !important;
}

.text {
  margin-top: 0.5%;
  display: inline-block;
  color: black;
  position: relative;
}

.el-dropdown {
  position: relative;
  margin-left: -400px;
  /* 通过负margin抵消第三个右侧的gap */
}

.el-dropdown .el-button {
  border-radius: 0;
}

.file-list {
  margin-top: -5px;
  margin-left: -10px;
  height: 150vh;
  width: 100vw;
  box-sizing: border-box;
  overflow-y: scroll;
}

.file-list-header span {
  color: rgb(120, 120, 120);
  cursor: pointer;
  user-select: none;
  /* 防止文字被选中 */
  z-index: 1000;
}

.file-list-header {
  border-bottom: 1px solid rgba(95, 95, 95, 0.1);
  z-index: 10000;
  display: flex;
  flex-direction: row;
  gap: 420px;
  align-items: center;
  justify-items: center;
  width: 100vw;
}

.file-list-body {
  color: black;
  border-bottom: 1px solid rgba(95, 95, 95, 0.1);
  position: relative;
  height: 60px;
}

.file-list-body p {
  height: 100%;
  display: flex;
  align-items: center;
  z-index: 1000;
}

.file-list-body:hover {
  background-color: #e9f8f5;
  color: #27ba9b;
}

.file-list-body span {
  display: inline-block;
  width: 460px;
}

.file-list-body span:nth-child(1) {
  margin-left: 20px;
}

.file-list-body p i {
  margin: 0 0.5%;
}

.active {
  background-color: #e9f8f5;
  color: #27ba9b;
}

#text {
  color: #000 !important;
}

#text:hover {
  color: #27ba9b !important;
}

.checkbox {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-self: start;

  .el-icon {
    margin: 0 0.5%;
  }
}

/* 优化样式 */
.edit-mode {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-self: start;
  padding: 4px 0;
  margin-left: 30px;
  /* 与图标区域对齐 */

  .el-input {
    width: 240px !important;
    /* 覆盖element默认样式 */
    max-width: 60vw;
    /* 响应式限制 */
    transition: all 0.3s;

    /* 输入框内部样式 */
    .el-input__inner {
      font-size: 14px;
      padding: 4px 8px;
      height: 28px;
    }
  }
}

.edit-but {
  display: flex;
  align-items: center;
  margin-left: 10px;
  /* 与输入框对齐 */
  gap: 5px;
  /* 按钮间距 */
  padding: 0 5px;
}

/* 保持与原始文件名样式一致 */
#text {
  display: inline-block;
  max-width: 240px;
  /* 与输入框同宽 */
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.file-q {
  display: flex;
  flex-direction: column;
}

.el-empty {
  margin: auto;
  /* 垂直居中 */
}

.file-list {
  overflow-y: auto;
  padding: 12px;
}

.file-item {
  padding: 8px;
  margin-bottom: 8px;
  border: 1px solid #eee;
  border-radius: 4px;
}
</style>
