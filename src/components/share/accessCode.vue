<template>
  <div class="verify-container">
    <!-- 在表单附近添加 Alert 提示 -->
    <el-alert v-if="showAlert" :title="alertTitle" :type="alertType" :closable="false" show-icon class="mb-4">
      {{ alertMessage }}
    </el-alert>
    <el-form ref="formRef" :model="form" :rules="rules" @submit.prevent="handleSubmit">
      <!-- 用户信息卡片 -->
      <div class="user-card">
        <el-avatar :size="75" :src="datas.avatar" class="user-avatar" />
        <div class="user-info">
          <h2 class="username">{{ datas.username }}</h2>
          <p class="user-desc">{{ datas.signature }}</p>
          <el-button type="primary" text class="friend-btn" @click="handleAddFriend">
            <!-- 到时候取后台请求一个链接的信息，根据email或者我在分享链接的query带上uuid4，方便数据库查找 -->
            <el-icon>
              <Plus />
            </el-icon>
            加为好友
          </el-button>
        </div>
      </div>

      <!-- 提取码输入 -->
      <el-form-item prop="accessCode">
        <el-input v-model="form.accessCode" placeholder="请输入4位提取码（不区分大小写）" clearable :maxlength="20" :spellcheck="false"
          class="custom-search">
          <template #prefix>
            <el-icon>
              <Key />
            </el-icon>
          </template>
        </el-input>
      </el-form-item>

      <!-- 验证码输入 -->
      <el-form-item prop="captcha" v-if="false">
        <div class="captcha-container">
          <el-input v-model="form.captcha" placeholder="请输入验证码" :maxlength="4" clearable class="custom-search">
            <template #prefix>
              <el-icon>
                <Picture />
              </el-icon>
            </template>
          </el-input>

          <div class="captcha-image">
            <img :src="captchaUrl" alt="验证码" @click="refreshCaptcha" />
            <el-button link type="primary" @click="refreshCaptcha">
              换一张
            </el-button>
          </div>
        </div>
      </el-form-item>

      <!-- 提交按钮 -->
      <el-button native-type="submit" type="primary" :loading="loading" class="submit-btn" @click="handleSubmit">
        提取文件
      </el-button>
    </el-form>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { Key, Picture, Plus } from '@element-plus/icons-vue'
import { useRouter } from 'vue-router';
import { useRoute } from 'vue-router';
import apiClient from '@/utils/api'

const route = useRoute()
const router = useRouter()


// 监听路由变化//
//这里还要完成一个操作，我传入一个uuid，然后会发送到后端，后端检查这个uuid是否存在，如果不存在就跳转到一个错误页面
//还要传入一个pwd，作为密码，如果密码正确就返回一个文件列表，如果密码错误就返回一个错误页面
const datas = ref({})
// 直接访问 query 参数
console.log(route.query.one_id) // 所有参数对象


// 如果没有 one_id，跳转到错误页面
const shareFile = async () => {
  try {
    const response = await apiClient.post('/share/getUrl', {
      one_id: route.query.one_id
    })
    console.log(response.data.data)
    datas.value = response.data.data
  } catch (error) {
    console.error(':', error)
  }
}
shareFile()





// 表单数据
const form = reactive({
  accessCode: '',
  captcha: ''
})

// 表单验证规则
const rules = reactive({
  accessCode: [
    { required: true, message: '请输入提取码', trigger: 'blur' }
  ],
  captcha: [
    { required: true, message: '请输入验证码', trigger: 'blur' },
    { min: 4, max: 4, message: '验证码必须为4位', trigger: 'blur' }
  ]
})

// 验证码相关
const captchaUrl = ref('//dummyimage.com/100x40')
const loading = ref(false)
const formRef = ref(null)

// 刷新验证码
const refreshCaptcha = () => {
  captchaUrl.value = `//dummyimage.com/100x40?t=${Date.now()}`
}

// Alert 控制状态
const showAlert = ref(false)
const alertType = ref('info')
const alertTitle = ref('')
const alertMessage = ref('')

// 提交逻辑优化版
const handleSubmit = async () => {
  if (loading.value) return // 防止重复提交
  if (form.accessCode.length != 4) return
  try {
    loading.value = true
    await formRef.value.validate()

    // 使用 await 替代 .then() 更清晰的链式调用
    const response = await apiClient.post('/share/checked', {
      Password: form.accessCode,
      one_id: route.query.one_id
    })

    if (response.status === 200) {
      // 显示成功提示
      showAlert.value = true
      alertType.value = 'success'
      alertTitle.value = '提取成功'
      alertMessage.value = '正在跳转到文件列表...'

      // 2秒后跳转（让用户看到提示）
      setTimeout(() => {
        router.push({
          path: '/s/xxx',
          query: { one_id: route.query.one_id }
        })
      }, 2000)
    }
  } catch (error) {
    // 统一错误处理
    showAlert.value = true
    alertType.value = 'error'

    if (error.response) {
      // API 错误
      alertTitle.value = `请求错误 (${error.response.status})`
      alertMessage.value = error.response.data.message || '检错你的验证码'
    } else if (error.name === 'ValidationError') {
      // 表单验证错误（已由 Element 表单显示，此处可省略）
      alertTitle.value = '表单不完整'
      alertMessage.value = '请检查红色标记的必填项'
    } else {
      // 其他错误
      alertTitle.value = '系统错误'
      alertMessage.value = error.message || '未知错误'
    }
  } finally {
    loading.value = false

    // 3秒后自动关闭提示（可选）
    if (showAlert.value) {
      setTimeout(() => {
        showAlert.value = false
      }, 3000)
    }
  }
}

// 添加好友
const handleAddFriend = () => {
  // 移除了消息提示
  console.log('发送好友请求')
}
</script>

<style scoped>
.verify-container {
  width: 420px;
  margin: 2rem auto;
  padding: 24px;
  border-radius: 8px;
}

.user-card {
  display: flex;
  align-items: center;
  padding-bottom: 20px;
  margin-bottom: 24px;
  border-bottom: 1px solid #eee;
}

.user-info {
  margin-left: 16px;
}

.username {
  font-size: 18px;
  color: #303133;
  margin: 0 0 4px;
  width: 100%;
  display: flex;
  justify-content: space-between;
}

.user-desc {
  color: #909399;
  font-size: 14px;
  margin: 0 0 8px;
}

.captcha-container {
  display: flex;
  gap: 12px;
  width: 100%;
}

.captcha-image {
  position: relative;
  flex-shrink: 0;

  img {
    height: 40px;
    border-radius: 4px;
    cursor: pointer;
  }

  .el-button {
    position: absolute;
    bottom: -28px;
    right: 0;
  }
}

.submit-btn {
  width: 100%;
  height: 40px;
  margin-top: 8px;
}

.friend-btn {
  padding: 8px 12px;
}


/* 深度穿透写法 */
:deep(.custom-search .el-input__wrapper) {
  /* 注意 Element Plus v2.x 使用 .el-input__wrapper */
  border-radius: 20px;
  padding: 0 15px;
  transition: all 0.3s;
  background-color: #f1f3f8 !important;
  /* 使用 !important 确保覆盖 */
  height: 50px !important;
}

/* 鼠标悬停 */
:deep(.custom-search .el-input__wrapper:hover) {
  box-shadow: 0 0 0 1px #27ba9b inset;
}

/* 聚焦状态 */
:deep(.custom-search.is-focus .el-input__wrapper) {
  box-shadow: 0 0 0 1px #27ba9b inset !important;
  border-radius: 30px !important;
}
</style>
