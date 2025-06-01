<script setup>
import 'animate.css';
import { toRaw } from 'vue'
//这个东西是那里对面的，还要生成一个自己的，再写一个或者在这里做修改
const props = defineProps({
  data: {
    type: Object,
    default: () => {
      return {}
    }
  }
})

const data=toRaw(props.data)

const {name,message,time,id,avatar}={...data}

</script>



<template>
<div class="conversation-main">
  <div class="conversation-time">
    <div class="time-system">{{ time }}</div>
  </div>
  <div class="conversation">
    <div class="conversation-avatar">
      <div class="person">
        <span>
          <img :src="avatar"/>
        </span>
      </div>
    </div>
    <div class="conversation-body">
      <div class="name">{{ name }}</div>
      <div class="location">
        <div class="location-body animate__bounceIn">
          <div class="connet">
            {{ message }}
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
</template>



<style scoped>
.conversation-main {
  height: auto;
  width: 100%;
  display: flex;
  flex-direction: column;
  margin-top: 18px;
  position: relative;
  z-index: 1005;

}



.conversation{
  margin-top: 20px;
  width: 980px;
  height: 100%;
  display: flex;
  padding: 0 24px;
  margin: 8px 0;
  overflow: hidden;
}

.conversation-avatar{
  width: 32px;
  height: 100%;

}

.conversation-body{
  width: 30%;
  height: 100%;
  margin: 0 10px;
  display: flex;
  flex-direction: column;
}
.name{
  font-size: 12px;
  color: rgba(174, 174, 174, 0.675);
  margin-bottom: 6px;
  text-align: left;
  height: 16px;
}

.location{
  display: flex;
  position: relative;
  height: 100%;
}

.location-body{
  width: 100%;
  height: 100%;
  background-color: #ffffff;
  border-top-left-radius: 5px;  /* 左上角 */
  border-top-right-radius: 30px; /* 右上角 */
  border-bottom-left-radius: 15px; /* 左下角 */
  border-bottom-right-radius: 25px; /* 右下角 */
  padding: 12px;
  position: relative;
  color: black;
}



.connet{
  width: 100%;
  word-break: break-word;
}

img{
  border-radius: 50%;
  width: 32px;
}

.conversation-time{
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
}

.time-system{
  height: 100%;
  font-size: 12px;
  color: rgba(174, 174, 174, 0.675);
}
</style>
