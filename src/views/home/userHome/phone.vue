<script setup>

</script>


<template>
  <div class="main">
    <div class="loginStatue">
      <p>已绑定手机</p>
      <span>15976714617</span>
      <p>一个手机号可以绑定5个百度账号，但该手机号只能登录其中一个账号。绑定手机号将作为您身份验证的重要方式，请谨慎操作！</p>
      <div class="mt-4">
        <el-button type="primary" size="large" >更换手机号</el-button>
        <el-button size="large" >取消手机号登录</el-button>
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

span{
  font-weight: 600;
  font-size: 300%;
}

p:last-child{
  margin-top: 1%;
  color: #9c9c9c;
}

.mt-4{
  margin-top: 5%;
  width: 100%;
}
</style>
