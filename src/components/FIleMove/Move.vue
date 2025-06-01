<script setup>
import { ref, computed, toRefs, reactive, toRaw, watch, onMounted } from 'vue';
import Hearder from '@/views/home/hearder.vue';
import { useFileTreeStore } from '@/stores/tree/fileTree';
import { useRoute } from 'vue-router'
import apiClient from '@/utils/api';
const route = useRoute()
const fileTreeStore = useFileTreeStore()
const props = defineProps({
  dialogVisible: {
  },
  check: {
    type: Object,
    default: {}
  },
  type: {
    type: String,
  }
})
const emit = defineEmits(['update:dialog-visible', 'move-control'])

const handleClose = () => {
  emit('update:dialog-visible', false)
}
const { dialogVisible, type } = toRefs(props)

import { Folder } from '@element-plus/icons-vue'
import { Document } from '@element-plus/icons-vue';
import item from '@/components/fileTree/item.vue';


const treeRef = ref(null)


const currentFolder = ref(null)    // 当前选中文件夹
const currentPath = ref([{         // 路径面包屑数据
  id: 0,
  name: '全部文件'
}])

/**

 * @param {Array} paths - 路径数组
 * @returns {Array} 树形结构数据
 */
function buildFolderTree(paths) {
  const tree = []
  paths.forEach(path => {
    const isFolder = path.endsWith('/')
    const parts = path.split('/').filter(p => p)

    let currentLevel = tree       // 当前处理层级
    let currentPath = []          // 当前路径片段

    parts.forEach((part, index) => {
      if (part == 'users' || part == '14') return
      currentPath.push(part)
      const nodePath = currentPath.join('/')

      // 🔍 查找或创建节点
      let node = currentLevel.find(n => n.name === part)
      if (!node) {
        node = {
          id: nodePath,           // 唯一路径标识
          name: part,
          type: index === parts.length - 1 && !isFolder ? 'file' : 'folder',
          children: []
        }
        currentLevel.push(node)
      }

      currentLevel = node.children // 下钻到子节点
    })

    // 🖇 处理空文件夹结尾（如 users/14/）
    if (isFolder && parts.length > 0) {
      currentLevel.push({
        id: currentPath.join('/') + '/',
        name: '',
        type: 'folder',
        children: []
      })
    }
  })
  return tree
}


let inputPaths = toRaw(fileTreeStore.allList)
let folderTree = ref(buildFolderTree(inputPaths))
watch(fileTreeStore.allList, (newVal) => {
  if (newVal.length > 0) {
    inputPaths = toRaw(fileTreeStore.allList)
    folderTree.value = buildFolderTree(inputPaths)
  }
}, { immediate: true, deep: true })


const treeProps = reactive({
  label: 'name',     // 节点标签字段
  children: 'children' // 子节点字段
})


const handleNodeClick = (data) => {
  if (data.type === 'file' || data.name === '') return // 点击文件不处理
  currentFolder.value = data
  console.log(currentFolder.value)
  const index = currentPath.value.findIndex(item => item.id === data.id)
  if (index === -1) {
    currentPath.value.push({ id: data.id, name: data.name })
  } else {
    currentPath.value = currentPath.value.slice(0, index + 1)
  }
}

const handleBreadcrumbClick = (index, item) => {
  if (item.name == '') return
  const target = currentPath.value[index]
  currentPath.value = currentPath.value.slice(0, index + 1)
  treeRef.value?.setCurrentKey(target.id) // 同步树选中状态
}

//移动文件
const handleMove = async () => {
  if (route.query.type != 'file') return
  const data = Object.keys(props.check)
  data.forEach((item, index, arr) => {
    const basePath = fileTreeStore.routeArr.slice(2).join('/');
    arr[index] = basePath ? `${basePath}/${item}` : item;
  });
  const base = (currentFolder.value?.id?.split('/').pop()) || '';


  if (type == 'copy') {
    await apiClient.post('/files/copy', {
      oldName: data,
      newName: base,
    }).then(res => {
      console.log(res.data.data)
    })
    return
  }

  await apiClient.post('/files/move', {
    oldName: data,
    newName: base,
  }).then(res => {
    console.log(res.data.data)
  })
}
const handleConfirmMove = () => {
  handleMove()
  if (currentFolder.value) {
    emit('move-confirm', currentFolder.value)
    dialogVisible.value = false
  }
}
onMounted(async () => {
  await fileTreeStore.allFileList();

});

defineExpose({
  openDialog: () => dialogVisible.value = true
})

// 处理取消按钮点击
const handleCancel = () => {
  console.log('取消按钮点击')
  // 发出 update:dialog-visible 事件，值为 false
  emit('update:dialog-visible', false);
};
</script>

<template>
  <el-dialog v-model="dialogVisible" :title="type?'复制到':'移动到'" width="700" @update:visible="$emit('update:dialog-visible', $event)"
    :close-on-click-modal="false" :before-close="handleClose">
    <el-scrollbar height="350px">
      <div class="file-picker">

        <div class="path-breadcrumb">
          <el-breadcrumb separator="/">
            <el-breadcrumb-item v-for="(item, index) in currentPath" :key="index"
              @click="handleBreadcrumbClick(index, item)">
              {{ item.name }}
            </el-breadcrumb-item>
          </el-breadcrumb>
        </div>

        <el-tree ref="treeRef" :data="folderTree" :props="treeProps" :highlight-current="true" node-key="id"
          class="custom-tree" @node-click="handleNodeClick">
          <template #default="{ node }">
            <div class="tree-node">
              <el-icon class="folder-icon" v-if="node.data?.type === 'folder'">
                <Folder />
              </el-icon>
              <el-icon class="file-icon" v-else>
                <Document />
              </el-icon>
              <span class="folder-name">{{ node.label }}</span>
              <span class="item-count" v-if="node.data?.count">
                ({{ node.data.count }}项)
              </span>
            </div>
          </template>
        </el-tree>
      </div>
    </el-scrollbar>


    <template #footer>
      <div class="dialog-footer">
        <span class="selected-path" v-if="currentFolder">
          当前选择：{{ currentFolder.name }}
        </span>
        <el-button type="primary"  @click="handleCancel"  round>取消</el-button>
        <el-button type="primary" @click="handleConfirmMove" round>
          {{type?'复制到':'移动到'}}此
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<style scoped>
.file-picker {
  padding: 0 20px;

  .path-breadcrumb {
    padding: 10px 0;
    border-bottom: 1px solid #eee;

    .el-breadcrumb {
      cursor: pointer;

      &__item:last-child {
        color: #409eff;
      }
    }
  }

  .custom-tree {
    margin-top: 10px;

    .tree-node {
      display: flex;
      align-items: center;
      width: 100%;
      padding: 8px 0;

      .folder-icon {
        margin-right: 8px;
        color: #ffc107;
      }

      .folder-name {
        flex: 1;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      .item-count {
        color: #999;
        font-size: 0.9em;
        margin-left: 10px;
      }
    }

    .el-tree-node__content:hover {
      background: #f5f7fa;
    }

    .is-current>.el-tree-node__content {
      background-color: #ecf5ff !important;
    }
  }
}

.dialog-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;

  .selected-path {
    color: #666;
    font-size: 0.9em;
    max-width: 400px;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .el-button {
    margin-left: 10px;
    color: #fff;
    border-radius: 20px;
    padding: 8px 16px;
    font-size: 14px;
  }
}
</style>
