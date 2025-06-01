<script setup>
import { ref, toRaw, onUnmounted, reactive } from 'vue'
import apiClient from '@/utils/api'





const isCounting = ref(false)
const countdown = ref(0)
const alter = reactive({
  message: '',
  type: 'success',
})
const obj = ref({
  password: '',
  code: '',
})
let timer = null
// 清理定时器
const clearTimer = () => {
  if (timer) {
    clearInterval(timer)
    timer = null
  }
}


// 启动倒计时
const startCountdown = async () => {
  isCounting.value = true
  countdown.value = 60
  timer = setInterval(() => {
    countdown.value -= 1
    if (countdown.value <= 0) {
      clearTimer()
      isCounting.value = false
    }
  }, 1000)


  await apiClient.get(`/email/sendEmail`).then((response) => {
    console.log(response.data)
    if (response.data.code == 200) {
      alter.message = response.data.message
    } else {
      alter.message = response.data.message
      alter.type = 'error'
    }
  })
}

const submit = async () => {
  if (obj.value.password == '' || obj.value.code == '') {
    alter.message = '请填写完整信息'
    alter.type = 'warning'
    return
  }
  await apiClient.post(`/profiles/forgetPwd`, {
    password: obj.value.password,
    code: obj.value.code,
  }).then((response) => {
    if (response.data.code == 200) {
      alter.message = response.data.msg
    } else {
      alter.message = response.data.msg
      alter.type = 'error'
    }
  })
}



onUnmounted(() => {
  clearTimer()
})
</script>


<template>
  <div class="main">
    <div class="loginStatue">
      <el-form class="main-form">
        <el-form-item label="新密码">
          <el-input type="password" v-model="obj.password" placeholder="密码"></el-input>
        </el-form-item>
        <el-form-item label="验证码">
          <div class="code-input-container">
            <el-input v-model="obj.code" placeholder="请输入邮箱验证码" class="code-input">
            </el-input>
            <el-button class="get-code-btn" :disabled="isCounting" @click="startCountdown">
              {{ countdown > 0 ? `${countdown}秒后重发` : '获取验证码' }}
            </el-button>
          </div>
        </el-form-item>
        <el-form-item class="main-form-btn">
          <el-button class="btn" type="primary" @click="submit">重置新密码</el-button>
        </el-form-item>
      </el-form>
      <el-alert :title="alter.message" :type="alter.type" v-if="alter.message" />
    </div>
  </div>
</template>


<style scoped>
.main {
  width: 100%;
  height: 100%;
  background-color: #ffffff;
  border-radius: 10px;
}

.loginStatue {
  width: 100%;
  height: 100%;
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  padding: 7% 5%;
}



/* 表单容器优化 */
.main-form {
  position: relative;
  width: 100%;
  margin: 0 auto;
  padding: 24px;
  border-radius: 8px;
}

.el-form-item {
  width: 100%;
  margin-bottom: 20px;
}

.el-input {
  width: 100%;
  text-align: center;
}


.code-input-container {
  display: flex;
  gap: 12px;
  width: 100%;
}

.code-input {
  flex: 1;
}


.get-code-btn {
  flex-shrink: 0;
  width: 120px;
  transition: all 0.3s ease;
  background-color: #f0f2f5;
  border-color: #dcdfe6;
}

.get-code-btn:not(:disabled):hover {
  background-color: #27ba9b;
  color: white;
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(32, 255, 222, 0.3);
}

/* 移动端适配 */
@media (max-width: 768px) {
  .code-input-container {
    flex-direction: column;
  }

  .get-code-btn {
    width: 100%;
    height: 40px;
  }
}

/* 复选框对齐优化 */
.main-form-checkbox {
  width: 100%;
  margin: 16px 0;
  display: flex;
  align-items: center;
}

.main-form-checkbox .el-checkbox {
  width: 100%;
}

.main-form-checkbox span {
  color: #cf4444;
  text-decoration: underline;
  cursor: pointer;
  margin: 0 4px;
}

/* 按钮悬停效果增强 */
.main-form-btn .el-button {
  width: 100%;
  transition: all 0.3s ease;
}

.main-form-btn .el-button:not(:disabled):hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(32, 160, 255, 0.3);
}
</style>
