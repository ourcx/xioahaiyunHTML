<template>
  <el-main>
    <el-card class="user-card" :style="{ width: '350px', height: '500px' }">
      <div class="card-content">
        <!-- 头像 -->
        <el-avatar :size="80" :src="avatarUrl" class="avatar" />
        <div class="content main">{{ nickname }}</div>

        <!-- 操作按钮区域 -->
        <div class="action-buttons">
          <el-button type="primary" :icon="ChatDotRound" @click="openChat">
            打开对话
          </el-button>

          <el-dropdown trigger="hover" @command="handleCommand">
            <el-button :icon="MoreFilled" />
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item command="report">举报</el-dropdown-item>
                <el-dropdown-item command="delete" style="color: #ff4d4f">删除</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>

        <!-- 备注区域 -->
        <div class="info-section">
          <div class="label">备注</div>
          <div v-if="!editRemark" class="content">
            {{ remark }}
            <el-icon class="edit-icon" @click="editRemark = true">
              <Edit />
            </el-icon>
          </div>
          <el-input v-else v-model="remark" size="small" @blur="editRemark = false" @keyup.enter="editRemark = false" />
        </div>

        <!-- 昵称 -->
        <div class="info-section">
          <div class="label">昵称</div>
          <div class="content">{{ nickname }}</div>
        </div>

        <!-- 账号 -->
        <div class="info-section">
          <div class="label">账号</div>
          <div class="content">{{ account }}</div>
        </div>
      </div>
    </el-card>
  </el-main>
</template>

<script setup>
import { ref, watch } from 'vue'
import {
  ElCard,
  ElAvatar,
  ElButton,
  ElDropdown,
  ElDropdownMenu,
  ElDropdownItem,
  ElIcon,
  ElInput
} from 'element-plus'
import { ChatDotRound, MoreFilled, Edit } from '@element-plus/icons-vue'
import { useRouter } from 'vue-router'
import { useRoute } from 'vue-router'
// 初始化备注的逻辑应该放在onMounted中
import { onMounted } from 'vue'
import { useManagementStore } from '@/stores/management';
import item from '@/components/fileTree/item.vue';




const ManagementStore = useManagementStore();

onMounted(() => {
  const storedRemark = localStorage.getItem(`${account.value}remark`)
  if (storedRemark) {
    remark.value = storedRemark
  } else {
    remark.value = "无备注"
  }
})


const route = useRoute();
const router = useRouter();
// 用户数据
const avatarUrl = ref(route.query.avatar)
const nickname = ref(route.query.name)
const account = ref(route.query.id)
const remark = ref('无备注')

watch(
  () => remark.value, // 监听具体值的变化
  (newVal, oldVal) => {
    // 存储到localStorage
    localStorage.setItem(`${account.value}remark`, newVal)

    // 不需要再次设置remark.value，否则会形成死循环
    // 只需要存储即可，显示值由v-model绑定自动处理
  },
  {
    deep: true
  }
)

// 状态控制
const editRemark = ref(false)

// 操作处理
const openChat = () => {
  console.log('打开聊天')
  const status = ManagementStore.dataListSide.find(item => item.id === account.value)

  if (route.query.group) {
    router.push({
      path: '/conversation/person/group',
      query: {
        name: nickname.value,
        group: route.query.group,
      }
    })
    ManagementStore.clickSendData(status)
    return
  }
  router.push({
    path: '/conversation/person/window',
    query: {
      name: nickname.value,
      id: account.value,
    }
  })
  ManagementStore.clickSendData(status)
}

const handleCommand = (command) => {
  if (command === 'report') {
    console.log('举报用户')
  } else if (command === 'delete') {
    console.log('删除用户')
  }
}
</script>

<style scoped>
.el-main {
  background-color: #f7f9fc;
  left: 500px;
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  position: fixed;
  height: 900px;
  width: 1100px;
}

.user-card {
  text-align: center;
  position: fixed;
  background-color: white;
  border-radius: 20px;
}

.card-content {
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
}

.avatar {
  margin-top: 20px;
  margin-bottom: 20px;
}

.action-buttons {
  display: flex;
  gap: 10px;
  margin-bottom: 30px;
}

.remark-section {
  margin-bottom: 20px;
  position: relative;
}

.remark-text {
  display: inline-flex;
  align-items: center;
  font-size: 16px;
  color: #666;
}


.info-section {
  width: 100%;
  margin-bottom: 20px;
  text-align: left;
  padding: 0 30px;
}

.label {
  font-size: 12px;
  color: #999;
  margin-bottom: 4px;
}

.main {
  font-size: 18px !important;
  font-weight: bolder;
  margin: 5px !important;
  padding: 0 !important;
}

.content {
  font-size: 14px;
  color: #333;
  display: flex;
  align-items: center;
}

.edit-icon {
  margin-left: 8px;
  cursor: pointer;
  color: #999;
}

.edit-icon:hover {
  color: #27ba9b;
}

/* 调整输入框宽度 */
.el-input {
  width: 200px;
}
</style>
