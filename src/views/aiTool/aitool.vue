<template>
  <el-main>
    <div class="chat-container">
      <!-- 聊天消息区域 -->
      <el-scrollbar class="chat-messages" ref="scrollbar" v-loading="loading">
        <div v-for="message in messages" :key="message.id" class="message-container"
          :class="{ 'ai-message': message.sender === 'DS', 'user-message': message.sender === MasterPinia.name }">
          <div class="message-bubble">
            <div class="message-header">
              <span class="sender">{{ message.sender }}</span>
              <span class="timestamp">{{ message.timestamp }}</span>
            </div>
            <div class="message-content">{{ message.content }}</div>
          </div>
        </div>
      </el-scrollbar>

      <!-- 输入区域 -->
      <div class="input-area">
        <el-input v-model="inputMessage" type="textarea" :rows="3" placeholder="请输入您的问题..."
          @keydown.enter.exact.prevent="sendMessage"></el-input>
        <el-button type="primary" @click="sendMessage" class="send-button">
          发送
        </el-button>
      </div>
    </div>
  </el-main>
</template>

<script setup>
import { ref, reactive, nextTick } from 'vue'
import apiClient from '@/utils/api'
import { useMasterPinia } from '@/stores/masterPinia'
// 消息数据
const MasterPinia = useMasterPinia()
const loading = ref(false)
const messages = reactive([
  {
    id: 1,
    sender: 'DS',
    content: '您好！我是DS人工智能助手，请问有什么可以帮您？',
    timestamp: getCurrentTime()
  }
])

const inputMessage = ref('')
const scrollbar = ref(null)

// 获取当前时间
function getCurrentTime() {
  return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}


const ds= async () => {
    loading.value = true
    const AI = await apiClient.put('/AI/chat', {
      role: "产品使用者，" + MasterPinia.name,
      content: inputMessage.value.trim()
    })
    if (AI.data.code === 200) {
      messages.push({
        id: messages.length + 1,
        sender: 'DeepSeek',
        content: AI.data.data + new Date().toLocaleTimeString(),
        timestamp: getCurrentTime()
      })
      loading.value = false
    } else {
      messages.push({
        id: messages.length + 1,
        sender: 'DS',
        content: '抱歉，无法获取AI回复，请稍后再试。',
        timestamp: getCurrentTime()
      })
    }
    loading.value = false
  }

// 发送消息
function sendMessage(){
  if (!inputMessage.value.trim()) return

  // 添加用户消息
  messages.push({
    id: messages.length + 1,
    sender: MasterPinia.name,
    content: inputMessage.value.trim(),
    timestamp: getCurrentTime()
  })

  ds()

  // 清空输入框
  inputMessage.value = ''

  // 滚动到底部
  nextTick(() => {
    const scrollView = scrollbar.value.$el.querySelector('.el-scrollbar__wrap')
    scrollView.scrollTop = scrollView.scrollHeight
  })
}
//把数据发回后端，后端把数据返回给前端才行，前端有跨域，发不出消息


</script>

<style scoped>
.chat-container {
  width: 100vw;
  height: 92vh;
  display: flex;
  flex-direction: column;
  max-width: 800px;
  padding: 20px;
  background-color: rgba(255, 255, 255, 0.7);
  position: fixed;
  left: 50%;
  transform: translateX(-50%);
  top: 60px;
  color: #000;
}

.chat-messages {
  flex: 1;
  margin-bottom: 20px;
  overflow-y: auto;
  padding: 10px;
  background-color: white;
  border-radius: 8px;

}

.message-container {
  margin: 10px 0;
  display: flex;

}

.message-container.user-message {
  justify-content: flex-end;


}

.message-bubble {
  padding: 12px 16px;
  border-radius: 12px;
  position: relative;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.ai-message .message-bubble {
  background-color: #ffffff;
  margin-left: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.user-message .message-bubble {
  background-color: #27ba9b;
  color: white;
  margin-right: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.message-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 5px;
  font-size: 0.8em;
}

.sender {
  font-weight: bold;
}

.timestamp {
  color: #666;
  margin-left: 15px;
}

.input-area {
  display: flex;
  gap: 10px;
}

.send-button {
  height: auto;
  align-self: flex-end;
}

.user-message .timestamp {
  color: rgba(255, 255, 255, 0.7);
}
</style>
