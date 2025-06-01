<script setup>
import { ref, onMounted, reactive } from 'vue';
import Main from './main.vue';
import { RouterView } from 'vue-router';
import { useMasterPinia } from '@/stores/masterPinia';
import axios from 'axios';
import apiClient from '@/utils/api';
import { useRouter } from 'vue-router';

const router = useRouter();
const MasterPinia = useMasterPinia();
onMounted(() => {
  document.title = "账号管理";
});


const rows = ref([
  '我的账户', '绑定手机', '登录密码', '绑定邮箱'
])


const rows2 = ref([
  '忘记密码', '登录情况'
])

const rows3 = ref([
  '登录记录', '账号注销'
])


// 用户资料数据
const userProfile = reactive({
  username: MasterPinia.name,
  email: MasterPinia.email,
  avatar: MasterPinia.avatar,
  signature: MasterPinia.signature
})





// 表单验证规则
const rules = reactive({
  username: [
    { required: true, message: '用户名不能为空', trigger: 'blur' },
    { min: 2, max: 16, message: '长度在2到16个字符', trigger: 'blur' }
  ],
  avatar: [
    { type: 'url', message: '请输入有效的URL地址', trigger: 'blur' }
  ],
  signature: [
    { required: true, message: '签名不能为空', trigger: 'blur' },
    { min: 2, max: 50, message: '长度在0到50个字符', trigger: 'blur' }
  ]
})

const profileForm = ref(null)
const submitting = ref(false)

// 提交修改
const updateProfile = async () => {
  try {
    submitting.value = true

    // 表单验证
    await profileForm.value.validate()

    console.log(MasterPinia.name)
    console.log(userProfile.username)
    // 检查用户名是否已存在

    if (userProfile.avatar != MasterPinia.avatar || userProfile.signature != MasterPinia.signature) {
      await apiClient.post('/profiles/PostProfile', { "signature": userProfile.signature, "avatar_url": userProfile.avatar })
        .then((response) => {
          console.log(response.data)
          MasterPinia.signature = userProfile.signature
          MasterPinia.avatar = userProfile.avatar
        })
        .catch((error) => {
          console.error('Error updating profile:', error)
        })

    }
    // 这里添加实际API调用

    if (userProfile.username != MasterPinia.name) {
      await apiClient.post('/profiles/upUserName', {
        "name": userProfile.username
      })
        .then((response) => {
          console.log(response.data)
          MasterPinia.name = userProfile.username
        })
        .catch((error) => {
          console.error('Error updating profile:', error)
        })
    }
  } catch (error) {
    if (error?.fields) {
      console.error('请检查表单输入')
    }
    console.error('更新失败', error)
  } finally {
    submitting.value = false
  }
}


const Path = (item) => {
  const routeMap = {
    '我的账户': '/user/main',
    '绑定手机': '/user/phone',
    '登录密码': '/user/password',
    '绑定邮箱': '/user/email',
    '忘记密码': '/user/forget',
    '登录情况': '/user/location',
    '登录记录': '/user/log',
    '账号注销': '/404'
  }

  if (routeMap[item]) {
    // 确保使用path跳转
    router.push(routeMap[item])
    setInterval(() => {
      window.location.reload();
    }, 500)
  }
}

</script>



<template>
  <el-container direction="horizontal">
    <el-header height="60px">
      <span class="manage-header-left">
        <img src="../../../assets/login.png" alt="">
        <p>账号设置</p>
      </span>
      <div class="manage-header-info">
        <span>
          <p>意见反馈</p>
        </span>
        <span>
          <p>在线客服</p>
        </span>
        <span>
          <p>网站首页</p>
        </span>
        <span> <el-avatar :size="40" :src="MasterPinia.avatar"></el-avatar></span>
      </div>
    </el-header>
    <el-aside width="250px" class="aside-left">
      <div class="aside-left-main">
        <span class="aside-left-item" v-for="(item, index) in rows" :key="index" @click="Path(item)">
          <p>{{ item }}</p>
          <div class="border"></div>
        </span>
        <span class="aside-left-item" v-for="(item, index) in rows2" :key="index" @click="Path(item)"
          :class="index === 0 ? 'margin-top' : ''">
          <p>{{ item }}</p>
          <div class="border"></div>
        </span>
        <span class="aside-left-item" v-for="(item, index) in rows3" :key="index" @click=" Path(item)"
          :class="index === 0 ? 'margin-top' : ''">
          <p>{{ item }}</p>
          <div class="border"></div>
        </span>
      </div>
    </el-aside>
    <el-main>
      <router-view v-slot="{ Component, route }">
        <transition name="fade" mode="out-in" appear>
          <keep-alive>
            <component :is="Component" :key="route.path" />
          </keep-alive>
        </transition>
      </router-view>
    </el-main>
    <el-aside width="400px" class="aside-right">
      <div class="aside-right-main">
        <div class="camera-lens"></div>
        <div class="aside-right-avatar">
          <el-avatar :size="80" :src="MasterPinia.avatar"></el-avatar>
          <strong>Hi,{{ MasterPinia.name }}</strong>
          <p>小海网盘技术加密，保证您的资料安全</p>
        </div>

        <div class="line"></div>
        <div class="aside-right-body">

          <div style="display: flex; flex-direction: row;  justify-content: space-around;align-items: flex-start;">
            <p>意见反馈</p>
            <span>更多》</span>
          </div>
          <el-card class="profile-section" shadow="never">
            <template #header>
              <div class="card-header">
                <span>修改个人资料</span>
              </div>
            </template>
            <el-scrollbar height="380px" noresize>
              <el-form :model="userProfile" :rules="rules" ref="profileForm" label-width="120px" label-position="left"
                @submit.prevent="updateProfile">
                <el-form-item label="用户名：" prop="username">
                  <el-input v-model="userProfile.username" placeholder="请输入用户名" clearable />
                </el-form-item>

                <el-form-item label="电子邮箱：" prop="email">
                  <el-input v-model="userProfile.email" type="email" placeholder="请输入邮箱" clearable disabled />
                </el-form-item>

                <el-form-item label="个性签名：" prop="signature">
                  <el-input v-model="userProfile.signature" type="textarea" placeholder="请输入个性签名" clearable autosize
                    maxlength="50" resize="vertical" />
                </el-form-item>

                <el-form-item label="头像URL：" prop="avatar">
                  <el-input v-model="userProfile.avatar" placeholder="请输入头像链接" clearable />
                  <el-image v-if="userProfile.avatar" :src="userProfile.avatar" class="avatar-preview" fit="cover">
                    <template #error>
                      <div class="image-error">
                        <el-icon>
                          <Picture />
                        </el-icon>
                      </div>
                    </template>
                  </el-image>
                </el-form-item>

                <el-form-item>
                  <el-button type="primary" native-type="submit" :loading="submitting">
                    保存修改
                  </el-button>
                </el-form-item>
              </el-form>
            </el-scrollbar>
          </el-card>

        </div>


      </div>
    </el-aside>
  </el-container>
  <!-- 这个是个人主页 -->
</template>


<style scoped>
.el-container {
  height: 1000px;
  width: 1530px;
  position: relative;
}

.el-header {
  top: 0;
  position: fixed;
  width: 100%;
  border: 1px solid #B3C0D1;
  background-color: white;
  z-index: 10001;
}

.manage-header-left {
  float: left;
  height: 100%;
  width: 200px;
  justify-content: center;
  align-items: center;
  display: flex;
  color: black;
}

.manage-header-left img {
  width: 60px;
  height: 100%;
  margin-right: 10%;
}

.manage-header-info {
  float: right;
  width: 400px;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: black;
}

.manage-header-info span {
  margin-left: 10%;
}

.el-aside {
  background-color: #f2f2f2;
  color: black;
  height: 100%;
}

.aside-left {
  color: black;
  display: flex;
  align-items: center;
  justify-content: center;

}

.aside-left-main {
  width: 100%;
  height: 100%;
  background-color: rgb(255, 255, 255);
  padding: 30% 0;
  user-select: none;
  margin-right: 20px;
}

.aside-left-item {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 60px;
}

.margin-top {
  margin-top: 30px;
  position: relative;
}

.aside-left-item p {
  width: 100%;
  text-align: center;
}

.border {
  width: 5px;
  height: 30px;
}


.aside-left-item:hover {
  color: #1f957c;
}

.aside-left-item:hover .border {
  background-color: #1f957c;
}


.aside-left-item .border:hover {
  background-color: #1f957c;
}



.aside-right {
  color: black;
  display: flex;
  align-items: center;
  justify-content: center;

}

.aside-right-main {
  width: 80%;
  height: 80%;
  border-radius: 20px;
  background-color: white;
  box-shadow: 0 0 0 5px rgba(0, 0, 0, 0.7), 2px 2px 10px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.camera-lens {
  width: 20px;
  /* 设置圆形的直径 */
  height: 20px;
  /* 设置高度与宽度相同，确保是一个圆形 */
  background-color: #333;
  /* 深灰色背景，模拟摄像头镜头 */
  border-radius: 50%;
  /* 使形状变成完美的圆形 */
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.6);
  /* 添加阴影效果，增加立体感 */
  position: relative;
  /* 为内部可能需要的额外元素定位 */
  left: 50%;
  transform: translateX(-50%);
}

.camera-lens::after {
  content: '';
  position: absolute;
  top: 25%;
  left: 25%;
  width: 50%;
  height: 50%;
  background-color: #fff;
  /* 内部反光或镜头效果 */
  border-radius: 50%;
}

.aside-right-avatar {
  width: 100%;
  height: 35%;
  display: flex;
  align-items: center;
  flex-direction: column;
  padding-top: 20%;
}

.aside-right-avatar strong {
  margin-top: 5%;
  font-size: 30px;
  font-weight: bolder;
}

.aside-right-avatar p {
  margin-top: 5%;
  font-size: small;
  font-weight: lighter;
}

.line {
  width: 80%;
  height: 1px;
  background-color: #000000;
  position: relative;
  left: 10%;
}

.aside-right-body {
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  gap: 5px;
  flex-direction: column;
}

.aside-right-body p {
  font-size: 20px;
  font-weight: bolder;
  color: #000000;
  width: 70%;
  height: 30px;
}

.aside-right-body span {
  font-size: 20px;
  font-weight: bolder;
  color: #1f957c;
  opacity: 0.6;
  background: url(https://ppui-static-wap.cdn.bcebos.com/static/manage/img/more_icon_normal.60bdf6d.png);
  background-size: 6px 10px;
}


.el-main {
  height: 100%;
  color: black;
  padding: 70px 10px;
}

.el-card__body {
  border: none !important;
}

.profile-section {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin-bottom: 20px;
  position: relative;
  border: none !important;
}

.avatar-preview {
  margin-top: 10px;
  width: 100px;
  height: 100px;
  border-radius: 8px;
  border: none !important;
}

.image-error {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
}

.feedback-section {
  margin-top: 2rem;
  padding-top: 1.5rem;
}

.profile-section {
  margin-bottom: 20px;
}

.avatar-preview {
  margin-top: 10px;
  width: 100px;
  height: 100px;
  border-radius: 8px;
}

.image-error {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  background: #f5f7fa;
  color: #909399;
}

.feedback-section {
  margin-top: 2rem;
  padding-top: 1.5rem;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.loading {
  padding: 20px;
  text-align: center;
}
</style>
