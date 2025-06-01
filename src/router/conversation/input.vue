<script setup>
import { ref,toRaw } from 'vue';
import { defineProps } from 'vue';
import { useChatStore } from '@/stores/chat';
import { useRoute } from 'vue-router';
const route = useRoute();
import { useManagementStore } from '@/stores/management';

const ManagementStore = useManagementStore();
const piniaData = ManagementStore.clickStaus



const chatStore = useChatStore()
const messageText = ref('')

const handleSend = () => {
  if (messageText.value.trim()&&route.query.group) {
    chatStore.sendMessage(messageText.value,"")
    messageText.value = ''
  }else if(messageText.value.trim()&&route.query.id){
    chatStore.sendMessage(messageText.value,toRaw(piniaData)[0].id)
    messageText.value = ''
  }
}


const props = defineProps({
  drawer: Boolean
});

//相关的按键发送
// 处理键盘事件
const handleKeyDown = (event) => {
  // 检测是否按下 Ctrl/Cmd + Enter
  const isCtrlEnter = (event.ctrlKey || event.metaKey) && event.key === 'Enter';
  if (isCtrlEnter) {
    // 如果内容非空（去除首尾空格）
    if (messageText.value.trim()) {
      handleSend();
    }
    // 阻止默认换行行为
    event.preventDefault();
  }
};

</script>


<template>
  <div class="input-main">
    <el-input type="textarea" :autosize="{ minRows: 5 }" placeholder="请输入文本内容....." v-model="messageText" resize="none"
      :input-style="{ height: '100%', border: '0', 'white-space': 'pre-wrap' }" show-word-limit class="auto-wrap-input" @keydown="handleKeyDown" clearable>
    </el-input>
    <div class="el-button-group">
      <el-popover title="提示" content="点击可以提交相关的内容,也可以通过Ctrl+Enter来进行发送" placement="top-start" v-if="messageText.trim()">
        <template #reference>
          <el-button @click="handleSend">提交</el-button>
        </template>
      </el-popover>
    </div>

  </div>
</template>


<style scoped>
.input-main {
  top: 35px;
  position: relative;
  width: 100%;
  height: 110px;
  display: flex;
  align-items: center;
}

.auto-wrap-input {
  width: 92%;
  position: relative;
}

.el-input {
  width: 100%;
  height: 110px;
  resize: none;
  overflow: hidden;
}

.el-input:focus {
  border: none !important;
  /* 去掉焦点时的边框 */
  box-shadow: none !important;
  /* 去掉焦点时的阴影 */
}

.auto-wrap-input .el-input__inner {
  white-space: pre-wrap;
  word-wrap: break-word;
  overflow-wrap: break-word;
}

.auto-wrap-input {
  border: none !important;
  /* 去掉焦点时的边框 */
  box-shadow: none !important;
  /* 去掉焦点时的阴影 */
  border-radius: 0 !important;
}

.el-button {
  position: relative;
  right: 0;
}

svg {
  width: 100%;
  height: 100%;
}

.el-button-group {
  background: radial-gradient(circle, rgba(233, 248, 245, 1), rgba(233, 248, 245, 0));
  height: 100%;
  display: flex;
  align-items: center;
}
</style>
