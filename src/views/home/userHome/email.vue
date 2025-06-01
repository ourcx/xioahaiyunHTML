<script setup>
import apiClient from '@/utils/api';
import { useRouter } from 'vue-router';
import { useMasterPinia } from "@/stores/masterPinia";
const router = useRouter();
const MasterPinia = useMasterPinia();
</script>


<template>
  <div class="main">
    <div class="loginStatue">
      <div>
        <span class="title">已绑定邮箱：{{ MasterPinia.email }}</span>
        <div class="lines">
          <p>绑定邮箱可提升账号防御能力<br>邮箱可用来登录所有小海产品</p>
        </div>
        <el-button type="primary" size="large">绑定邮箱</el-button>
      </div>
    </div>
  </div>
</template>


<style scoped>
.main{
  width: 100%;
  height: 100%;
  background-color: #ffffff;
  border-radius: 10px;
}

.loginStatue{
  width: 100%;
  height: 100%;
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  padding: 7% 5%;
}

.title {
  font-size: 35px;
  font-weight: bold;
  color: #000000;
  margin-bottom: 20%;
  text-align: center;
}

.lines{
  width: 100%;
  display: flex;
  margin-top: 3%;
  margin-bottom: 5%;
  color: rgb(136, 136, 136);
}

</style>
