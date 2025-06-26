<script setup>
import { ref, toRaw } from 'vue'
import axios from 'axios'
import { useRouter } from 'vue-router'

const router = useRouter()

const activeIndex = ref('1')
const checked = ref(false)
const alert = ref(false)
const visible = ref(false)

const obj = ref({
  email: '',
  password: '',
})

//登录返回应该jwt，jwt可以作为免登录的方法

async function postData() {
  if (toRaw(obj.value).name == '' && toRaw(obj.value).password == '') {
    alert.value = true
    setInterval(() => {
      alert.value = false
    }, 4500)
    return
  }
   try {
    // 1. 发送登录请求
    const response = await axios.post(
      '/user/userLongin',
      toRaw(obj.value),
      { headers: { 'Content-Type': 'application/json' } }
    );

    // 2. 保存服务端返回的新 JWT
    const newJwt = response.data.jwt;
    localStorage.setItem('jwt', newJwt);

    // 3. 发送 JWT 解析请求（验证有效性）
    await axios.post(
      '/user/parseJwt',
      { jwt: newJwt }, // 使用新获取的 JWT
      { headers: { 'Content-Type': 'application/json' } }
    );

    // 4. 验证通过后跳转到主页
    router.push({ path: '/firstFile' }).then(() => {
  window.location.reload()});

  } catch (error) {
    // 统一错误处理（登录失败或 JWT 解析失败）
    console.error('登录失败:', error);
    visible .value = true
  }
}

const reqData = () => {
  router.push({ path: '/req' })
  //刷新页面
  setTimeout(() => {
    window.location.reload()
  }, 300)
}



</script>

<template>
  <el-alert title="账号密码不能为空" type="error" v-if="alert" />
  <div class="container">
    <img src="../../assets/login.png" alt="">
    <div
      style="position: absolute;top: 270px;left: 70px;font-size: 40px;color: black; font-family: 隶书;user-select: none;">
      小海网盘</div>
    <div class="main">
      <el-menu>
        <el-menu-item>账号登录</el-menu-item>
      </el-menu :default-active="activeIndex">
      <el-form class="main-form">
        <el-form-item label="账号">
          <el-input v-model="obj.email" placeholder="手机号/用户名/邮箱"></el-input>
        </el-form-item>
        <el-form-item label="密码">
          <el-input type="password" v-model="obj.password" placeholder="密码"></el-input>
        </el-form-item>
        <el-form-item class="main-form-btn">
          <el-button class="btn" type="primary" @click="postData" :disabled="!checked">登录</el-button>
          <el-button class="btn" type="primary" @click="reqData">注册</el-button>
        </el-form-item>
        <p class="main-form-forget">忘记密码?></p>
        <div class="main-form-checkbox"><el-checkbox v-model="checked"
            size="large">阅读并接受<span>网盘用户协议</span>和<span>隐私政策</span></el-checkbox></div>
       <div class="main-form-bottom">
          <a href="#" title="QQ" class="QQ"></a>
          <a href="#" title="微信" class="wx"></a>
          <a href="#" title="飞书" class="fs"></a>
          <a href="#" title="微博" class="wb"></a>
        </div>
      </el-form>
    </div>
  </div>

  <el-dialog v-model="visible" :show-close="false" width="500" style="z-index: 10002;">
    <template #header="{ close, titleId, titleClass }">
      <div class="my-header">
        <h4 :id="titleId" :class="titleClass">账户或者密码错误</h4>
        <el-button type="danger" @click="close">
          <el-icon class="el-icon--left"><CircleCloseFilled /></el-icon>
          关闭
        </el-button>
      </div>
    </template>
   请检查密码或者账户是否正确，如果未注册请移步注册页面
  </el-dialog>
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
.my-header {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  gap: 16px;
  z-index: 10002;
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
  z-index: 1002;
  box-shadow: 6px 6px 15px rgba(101, 213, 189, 0.14);
}

.container img {
  float: left;
  width: 40%;
  user-select: none;
}

.main {
  float: right;
  width: 60%;
  height: 100%;
  background-color: rgba(255, 255, 255, 0.9);
  border-top-right-radius: 20px;
  border-bottom-right-radius: 20px;
}

.main-form {
  position: absolute;
  top: 40%;
  left: 70%;
  transform: translate(-50%, -50%);
  width: 300px;
}

.main-form-btn {
  position: absolute;
  top: 110%;
  width: 100%;
}

.btn {
  width: 70px;
  margin-left: 60px;
}

.main-form-btn .el-button:not(:disabled):hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(32,160,255,0.3);
}

.el-menu {
  top: 15px;
}


.el-menu-item {
  width: 100%;
  float: left;
  display: flex;
  justify-content: center;
  /* 水平方向居中 */
  align-items: center;
  /* 垂直方向居中 */
}

.main-form-forget {
  color: #27ba9b;
  float: right;
  top: 90%;
}

.main-form-checkbox {
  position: absolute;
  top: 130%;
  margin-top: 10px;
  margin-left: 35px;
}

.main-form-checkbox span {
  color: #cf4444;
}
/* 社交图标容器优化 */
.main-form-bottom {
  position: relative;
  top: 170px;
  display: flex;
  justify-content: center;
  gap: 16px; /* 使用现代gap属性替代margin */
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
.QQ { background-image: url(https://passport.baidu.com/passApi/img/bd-acc-qzone.png); }
.wx { background-image: url(https://passport.baidu.com/passApi/img/bd-acc-weixin.png); }
.fs { background-image: url(https://passport.baidu.com/passApi/img/bd-acc-dingtalk.png); }
.wb { background-image: url(https://passport.baidu.com/passApi/img/bd-acc-tsina.png); }

.el-alert {
  width: 250%;
  position: relative;
  top: -400px;
  animation: slidein 2s ease forwards, slidein 2s ease reverse 3s;
}


@keyframes slideInOut {
  0% {
    opacity: 0;
    transform: translate(-50%, -20px);
  }
  15%, 85% {
    opacity: 1;
    transform: translate(-50%, 0);
  }
  100% {
    opacity: 0;
    transform: translate(-50%, -20px);
  }
}


@keyframes slidein {
  from {
    width: 0%;
  }

  to {
    width: 250%;
  }
}
</style>
