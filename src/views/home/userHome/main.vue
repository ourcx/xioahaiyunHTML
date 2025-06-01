<script setup>

const list = [
  {
    title: "我的登录保护",
    content: "建议开启登录保护444444444444444444444444",
    button: "去开启",
  },
  {
    title: "我的登录保护",
    content: "建议开启登录保护444444444444444444444444",
    button: "去开启",
  },
  {
    title: "我的登录保护",
    content: "建议开启登录保护444444444444444444444444",
    button: "去开启",
  },
  {
    title: "我的登录保护",
    content: "建议开启登录保护444444444444444444444444",
    button: "去开启",
  },
  {
    title: "我的登录保护",
    content: "建议开启登录保护444444444444444444444444",
    button: "去开启",
  },
  {
    title: "我的登录保护",
    content: "建议开启登录保护444444444444444444444444",
    button: "去开启",
  },
]



</script>


<template>
  <div class="main">
    <div class="loginStatue">
      <div class="loginStatue-title">
        <span>90</span>
        <div class="loginStatue-title-text">
          <p>⭐⭐⭐⭐⭐</p>
          <p>您的账号安全状态较好，请完善以下信息</p>
        </div>
        <el-button round size="large">检测</el-button>
      </div>
      <div class="loginStatue-content-title">
        <div class="login-title" v-for="(item, index) in list" :key="index">
            <span>我的登录保护</span>
          <p>建议开启登录保护444444444444444444444444</p>
          <div>去开启<span>></span></div>
        </div>
      </div>
    </div>
    <div class="loginStatue-content">
      <!-- 弄一个登录记录显示 -->
        <span class="loginStatue-reactive-restart">
          <el-image style="width: 50px; height: 50px" src="https://s2.loli.net/2025/03/23/5XUf6tCi9ubsQRg.png"/>
          <div>
            <p>账号申述</p>
            <p>登录异常，手机停用</p>
          </div>
        </span>
        <span class="loginStatue-reactive-remove">
          <el-image style="width: 50px; height: 50px" src="https://s2.loli.net/2025/03/23/vwRrfzensbk8I2t.png"/>
          <div>
            <p>账号注销</p>
            <p>永久注销，谨慎操作</p>
          </div>
        </span>
    </div>
  </div>
</template>


<style scoped>
*{
  user-select: none;
}

.main {
  width: 100%;
  height: 100%;
  border-radius: 10px;
  display: flex;
  flex-direction: column;
}

.loginStatue {
  width: 100%;
  height: 50%;
  background-color: #ffffff;
  border-radius: 10px;
  padding: 10px;
  display: flex;
  flex-direction: column;

}

.loginStatue-title {
  width: 100%;
  height: 20%;
  border-radius: 10px;
  background: linear-gradient(to right, #01d701, #9cf19c);
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 0 10px;
  color: white;
}

.loginStatue-title span {
  font-size: 60px;
}

.loginStatue-title-text {
  display: flex;
  flex-direction: column;
  width: 200%;
  margin-left: 10px;
  font-size: smaller;
}

.loginStatue-title-text button {
  width: 30px;
}

.loginStatue-content-title {
  width: 100%;
  height: 90%;
  margin-top: 1%;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  padding: 20px 10px;
  flex-wrap: wrap;
}

.login-title {
  width: 30%;
  height: 40%;
  display: flex;
  flex-direction: column;
  align-items: baseline;
  justify-content: center;
  background-color:#f6fbfb;
  color: black;
  padding-left: 3%;
  border-radius: 10px;
}

.login-title span {
  width: 100%;
  font-size: 18px;
  margin-bottom: 1%;
  font-style: italic;
}

.login-title p {
  width: 60%;
  margin-bottom: 1%;
  color: #9c9c9c;
  white-space: nowrap;
  /* 防止文本换行 */
  overflow: hidden;
  /* 隐藏超出范围的文本 */
  text-overflow: ellipsis;
  /* 超出部分显示省略号 ("...") */
}

.loginStatue-content{
  width: 100%;
  height: 15%;
  margin-top: 2%;
  border-radius: 10px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  gap: 5%;
}

.loginStatue-content span {
  width: 100%;
  height: 100%;
  background-color: #ffffff;
  border-radius: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: row;
}
.loginStatue-reactive-restart:hover{
  border: 1px solid #27ba9b;
}
.loginStatue-reactive-restart:hover  div p:first-child{
  color: #27ba9b;
}
.loginStatue-reactive-restart:hover  div p:last-child{
  color: #27ba9b;
}

.loginStatue-reactive-restart div{
  display: flex;
  flex-direction: column;
  width: 50%;
  gap: 1%;
}

.loginStatue-reactive-restart div p:first-child{
  font-size: 25px;
  color: #000000;
}

.loginStatue-reactive-restart div p:last-child{
  font-size: 15px;
  color: #a2a2a2;
  white-space: nowrap;
  /* 防止文本换行 */
  overflow: hidden;
  /* 隐藏超出范围的文本 */
  text-overflow: ellipsis;
  /* 超出部分显示省略号 ("...") */
}

.loginStatue-reactive-remove:hover{
  border: 1px solid #27ba9b;
}
.loginStatue-reactive-remove:hover  div p:first-child{
  color: #27ba9b;
}
.loginStatue-reactive-remove:hover  div p:last-child{
  color: #27ba9b;
}



.loginStatue-reactive-remove div{
  display: flex;
  flex-direction: column;
  width: 50%;
  gap: 1%;
}

.loginStatue-reactive-remove div p:first-child{
  font-size: 25px;
  color: #000000;
}

.loginStatue-reactive-remove div p:last-child{
  font-size: 15px;
  color: #a2a2a2;
  white-space: nowrap;
  /* 防止文本换行 */
  overflow: hidden;
  /* 隐藏超出范围的文本 */
  text-overflow: ellipsis;
  /* 超出部分显示省略号 ("...") */
}
</style>
