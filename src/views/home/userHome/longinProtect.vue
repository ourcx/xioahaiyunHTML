<script setup>
import { ref } from 'vue'

const value1 = ref(false)
</script>


<template>
  <div class="main">
    <div class="loginStatue">
      <div class="loginStatue-title">
        <p>账号保护</p>
        <p>通过拜神求佛完成对你的账号进行保护（开玩笑的），网盘对于账号的个人数据进行了bcrypt加密你的密码，使用jwt进行鉴权，基本上密码是安全的</p>
      </div>
      <div class="safe-body">
        <div class="safe-item">
          <li>
            <p class="safe-item-p">开启账号保护</p>
            <p class="safe-item-x">开启后，你的账号数据将进行bcrypt加密，使用jwt进行鉴权，密码是安全的</p>
          </li>
          <el-switch v-model="value1" />
        </div>
        <div class="safe-item">
          <li>
            <p class="safe-item-p">开启账号保护</p>
            <p class="safe-item-x">开启后，你的账号数据将进行bcrypt加密，使用jwt进行鉴权，密码是安全的</p>
          </li>
          <el-switch v-model="value1" />
        </div>
        <div class="safe-item">
          <li>
            <p class="safe-item-p">开启账号保护</p>
            <p class="safe-item-x">开启后，你的账号数据将进行bcrypt加密，使用jwt进行鉴权，密码是安全的</p>
          </li>
          <el-switch v-model="value1" />
        </div>
        <div class="safe-item">
          <li>
            <p class="safe-item-p">开启账号保护</p>
            <p class="safe-item-x">开启后，你的账号数据将进行bcrypt加密，使用jwt进行鉴权，密码是安全的</p>
          </li>
          <el-switch v-model="value1" />
        </div>
        <div class="safe-item">
          <li>
            <p class="safe-item-p">开启账号保护</p>
            <p class="safe-item-x">开启后，你的账号数据将进行bcrypt加密，使用jwt进行鉴权，密码是安全的</p>
          </li>
          <el-switch v-model="value1" />
        </div>
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
.loginStatue-title{
  width: 100%;
  height: auto;
  margin-bottom: 5%;
}

.loginStatue-title p:first-child{
  font-size: 35px;
  font-weight: bold;
  color: #000000;
}

.loginStatue-title p:last-child{
  font-size: 15px;
  color: #808080;
}
.safe-body{
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.safe-item{
  width: 100%;
  height: 20%;
  height: auto;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  list-style: none;
  border-bottom: 1px solid rgb(200, 199, 199);
  margin-bottom: 3%;
}

.safe-item-p{
  font-size: 20px;
  color: #000000;
  font-weight: bold;
}

.safe-item-x{
  font-size: 15px;
  color: #808080;
  margin-bottom: 5%;
}
</style>
