<script setup>
import { useMasterPinia } from "@/stores/masterPinia";
import { ref } from "vue";
import apiClient from "@/utils/api";
const MasterPinia = useMasterPinia();
const input = ref({
  old: '',
  new: '',
});
const hand = ref('');
const handleSubmit = async () => {
  if  (!input.value.old || !input.value.new) {
    hand.value=  "请输入密码";
    return;
  }
  await apiClient.put(`/pwd/passwordChange`, {
    old: input.value.old,
    new: input.value.new
  }).then((res) => {
    if (res.data.code === 200) {
      hand.value= "修改成功";
    }else{
      hand.value=  "修改失败";
    }
  }).catch(() => {
    hand.value=  "密码错误"
  })
}

</script>


<template>
  <div class="main">
    <div class="loginStatue">
      <div class="loginStatue-input">
        <span class="title">修改密码</span>
        <p>用户名</p>
        <el-input v-model="MasterPinia.name" style="width: 100%" disabled :placeholder="MasterPinia.name" />
        <p>旧密码</p>
        <el-input v-model="input.old" style="width: 100%" placeholder="输入新密码" />
        <p>新密码</p>
        <el-input v-model="input.new" style="width: 100%" placeholder="输入新密码" class="input" />
        <el-button type="primary" size="large" @click="handleSubmit">更改密码</el-button>
      </div>
      <div style="max-width: 600px">
        <el-alert :title="hand" type="success" v-if="hand=='修改成功'"/>
        <el-alert :title="hand" type="error" v-if="hand=='修改失败'"/>
        <el-alert :title="hand" type="warning"  v-if="hand=='密码错误'||hand=='请输入密码'" />
      </div>
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

.title {
  font-size: 35px;
  font-weight: bold;
  color: #000000;
  margin-bottom: 20%;
  text-align: center;
}


.loginStatue-input {
  width: 100%;
  height: auto;
  border-radius: 10px;
  position: relative;
  margin-bottom: 1%;
}

.input {
  margin-bottom: 5%;
}

p {
  margin-top: 3%;
}
</style>
