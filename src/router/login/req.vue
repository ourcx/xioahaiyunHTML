<script setup>
import { ref, toRaw, onUnmounted } from 'vue'
import axios from 'axios'
import { useRouter } from 'vue-router'

const router = useRouter()

const activeIndex = ref('1')
const checked = ref(false)
const alert = ref(false)
// 存储通知实例
const notificationRef = ref(null);
const countdown = ref(0)
const isCounting = ref(false)
let timer = null
// 清理定时器
const clearTimer = () => {
  if (timer) {
    clearInterval(timer)
    timer = null
  }
}

const obj = ref({
  name: '',
  password: '',
  email: '',
  code: '',
})

// 启动倒计时
const startCountdown = async () => {
  if (toRaw(obj.value).email == '') {
    closeMessage()
    openMsg('错误', '邮箱不能为空', 'error')
    return
  }

  isCounting.value = true
  countdown.value = 60
  timer = setInterval(() => {
    countdown.value -= 1
    if (countdown.value <= 0) {
      clearTimer()
      isCounting.value = false
    }
  }, 1000)


  const email = {
    email: toRaw(obj.value).email,
  }

  await axios.post(`/user/sendEmail`, email).then((response) => {
    if (response.data.code == 200) {
      openMsg('成功', '验证码已发送，请注意查收', 'success')
    } else {
      closeMessage()
      openMsg('错误', '验证码发送失败，请稍后再试', 'error')
    }
  })
}

async function postData() {
  if (toRaw(obj.value).name == '' && toRaw(obj.value).password == '' && toRaw(obj.email) == '') {
    alert.value = true
    setInterval(() => {
      alert.value = false
    }, 5500)
    return



  }
  console.log(toRaw(obj.value))
  await axios.post(`/user/userReq`, toRaw(obj.value)).then((response) => {
    if (response.data.code == 200) {
      openMsg('成功', '注册成功，请登录', 'success')
      router.push({
        path: '/login',
      })
    }
  }).catch((error) => {
    closeMessage()
    openMsg('错误', '注册失败，请稍后再试', 'error')

  })
}


//消息提示函数
const openMsg = (title, message, type) => {
   notificationRef.value =ElNotification({
    title: title,
    message: message,
    type: type,
  })
}
//每次添加了这类函数都会导致scss全局状态出错




const closeMessage = () => {
  if (notificationRef.value) {
    notificationRef.value.close()
    notificationRef.value = null
  }
}
//使用这个减少页面上显示的notification的数量
// 组件卸载时清理
onUnmounted(clearTimer)
</script>

<template>
  <el-alert title="邮箱账号密码不能为空" type="error" v-if="alert" />
  <div class="container custom-element-theme" >
    <img src="../../assets/login.png" alt="">
    <div
      style="position: absolute;top: 270px;left: 70px;font-size: 40px;color: black; font-family: 隶书;user-select: none;">
      小海网盘</div>
    <div class="main">
      <el-menu>
        <el-menu-item style="display: flex; align-items: center;justify-content: center;">账号注册</el-menu-item>
      </el-menu :default-active="activeIndex">
      <el-form class="main-form">
        <el-form-item label="邮箱">
          <el-input v-model="obj.email" placeholder="邮箱"></el-input>
        </el-form-item>
        <el-form-item label="用户">
          <el-input v-model="obj.name" placeholder="填写你的名字"></el-input>
        </el-form-item>
        <el-form-item label="密码">
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
        <div class="main-form-checkbox"><el-checkbox v-model="checked"
            size="large">阅读并接受<span>网盘用户协议</span>和<span>隐私政策</span></el-checkbox></div>
        <el-form-item class="main-form-btn">
          <el-button class="btn" type="primary" @click="postData" :disabled="!checked">注册</el-button>
        </el-form-item>
        <div class="main-form-bottom">
          <a href="#" title="QQ" class="QQ"></a>
          <a href="#" title="微信" class="wx"></a>
          <a href="#" title="飞书" class="fs"></a>
          <a href="#" title="微博" class="wb"></a>
        </div>
      </el-form>
    </div>
  </div>
</template>

<style>


body {
  background: linear-gradient(to top right, rgba(127, 255, 212), rgba(255, 192, 203, 0.5));
}

body::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(128, 128, 128, 0.3);
  pointer-events: none;
  z-index: 1;
}

/* body,
html {
  height: 100%;
  margin: 0;
  position: relative;
} */
</style>

<style scoped>
/* 通过容器类名限定作用域 */
/* 主颜色变量定义 */
.custom-element-theme {
  /* 基础颜色 */
  --el-color-primary: #27ba9b;
  --el-color-success: #1dc779;
  --el-color-warning: #ffb302;
  --el-color-danger: #e26237;
  --el-color-error: #cf4444;
  --el-color-info: #f1f3f8;

  /* 主色衍生色 */
  --el-color-primary-light-3: rgba(39, 186, 155, 0.3);
  --el-color-primary-dark-2: #1f9d84;
}

/* 按钮全局状态控制 */
.custom-element-theme :deep(.el-button) {
  /* 基础状态 */
  --el-button-bg-color: var(--el-color-primary);
  --el-button-border-color: var(--el-color-primary);
  --el-button-text-color: white;

  /* 禁用状态 */
  --el-button-disabled-bg-color: var(--el-color-primary-light-3);
  --el-button-disabled-border-color: var(--el-color-primary-light-3);
  --el-button-disabled-text-color: white;

  /* 激活状态 */
  --el-button-active-bg-color: var(--el-color-primary-dark-2);
  --el-button-active-border-color: var(--el-color-primary-dark-2);

  /* 悬停状态 */
  --el-button-hover-bg-color: color-mix(in srgb, var(--el-color-primary) 90%, white);
}

/* 特殊按钮强制样式 */
.custom-element-theme :deep(.force-primary.el-button) {
  &,
  &:hover,
  &:active,
  &.is-disabled {
    background-color: var(--el-color-primary) !important;
    border-color: var(--el-color-primary) !important;
    opacity: 1;

    /* 禁用状态透明度控制 */
    &.is-disabled {
      opacity: 0.6;
    }
  }
}

/* 注册按钮禁用状态增强 */
.custom-element-theme :deep(.btn.is-disabled) {
  background-color: var(--el-color-primary-light-3) !important;
  border-color: var(--el-color-primary-light-3) !important;
  cursor: not-allowed;

  /* 保持文字可读性 */
  span {
    color: rgba(255, 255, 255, 0.9) !important;
  }
}

.container {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 740px;
  height: 450px;
  background: linear-gradient(to top right, aquamarine, pink);
  border-radius: 20px;
  z-index: 10001;
  box-shadow: 6px 6px 15px rgba(101, 213, 189, 0.14);
}

.container img {
  float: left;
  width: 40%;
  user-select: none;
}

.main {
  display: flex;
  flex-direction: column;
  align-content: center;
  justify-content: space-between;
  float: right;
  width: 60%;
  height: 100%;
  background-color: #ffffff;
  border-top-right-radius: 20px;
  border-bottom-right-radius: 20px;
}

/* 表单容器优化 */
.main-form {
  position: relative;
  width: 100%;
  max-width: 400px;
  /* 增加最大宽度限制 */
  margin: 0 auto;
  padding: 24px;
  border-radius: 8px;
}

/* 表单项间距优化 */
.el-form-item {
  width: 100%;
  margin-bottom: 20px;
}

/* 输入框样式统一 */
.el-input {
  width: 100%;
  text-align: center;
}

/* 验证码输入容器 */
.code-input-container {
  display: flex;
  gap: 12px;
  width: 100%;
}

/* 输入框自适应 */
.code-input {
  flex: 1;
}

/* 验证码按钮样式 */
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

/* 社交图标容器优化 */
.main-form-bottom {
  display: flex;
  justify-content: center;
  gap: 16px;
  /* 使用现代gap属性替代margin */
  margin-top: 24px;
}

/* 社交图标通用样式 */
.main-form-bottom a {
  display: inline-block;
  width: 40px;
  height: 40px;
  background-size: cover;
  background-position: center;
  transition: transform 0.3s ease;
  border-radius: 50%;
}

.main-form-bottom a:hover {
  transform: scale(1.1);
}

/* 具体图标样式优化 */
.QQ {
  background-image: url(https://passport.baidu.com/passApi/img/bd-acc-qzone.png);
}

.wx {
  background-image: url(https://passport.baidu.com/passApi/img/bd-acc-weixin.png);
}

.fs {
  background-image: url(https://passport.baidu.com/passApi/img/bd-acc-dingtalk.png);
}

.wb {
  background-image: url(https://passport.baidu.com/passApi/img/bd-acc-tsina.png);
}

/* 响应式设计 */
@media (max-width: 768px) {
  .main-form {
    width: 90%;
    padding: 16px;
  }

  .el-form-item {
    margin-bottom: 16px;
  }

  .main-form-bottom {
    gap: 12px;
  }
}

/* 动画优化 */
.el-alert {
  width: 100%;
  max-width: 400px;
  position: fixed;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
  animation: slideInOut 4s ease forwards;
}

@keyframes slideInOut {
  0% {
    opacity: 0;
    transform: translate(-50%, -20px);
  }

  15%,
  85% {
    opacity: 1;
    transform: translate(-50%, 0);
  }

  100% {
    opacity: 0;
    transform: translate(-50%, -20px);
  }
}
</style>
