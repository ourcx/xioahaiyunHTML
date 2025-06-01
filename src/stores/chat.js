// stores/chatStore.js
import { defineStore } from 'pinia'
import { useManagementStore } from './management'
import axios from 'axios'
import { useMasterPinia } from './masterPinia'
import { useNewMessageStore } from './newmessage'


export const useChatStore = defineStore('chat', {
  state: () => ({
    ws: null,
    dataCon: [],
    dataMy: [],
    //这些都是群组桶
    //私聊桶
    privateCon: [],
    privateMy: [],
    jwt: localStorage.getItem('jwt') || '',
    setTime: null,
  }),

  actions: {
    // 初始化 WebSocket 连接
    initWebSocket() {
      this.ws = new WebSocket("/chat/ws")
      this.ws.onopen = () => {
        console.log('WebSocket connected')
        this.ws.send(JSON.stringify({
          type: "online",
          jwt: this.jwt,
        }))
      }
      this.setTime = setInterval(() => {
        this.ws.send(JSON.stringify({
          type: "ping",
          jwt: this.jwt,
        }))
      }, 30000)


      this.ws.onmessage = (event) => {
        const msg = JSON.parse(event.data)
        //不应该用jwt来判断是我发信息还是接受信息，不能让jwt在广播里面乱串
        //所以要用邮箱来进行判断

        // 获取当前时间的日期部分（如 "2023-10-05"）
        const currentDate = new Date().toLocaleDateString();

        // 获取当前时间的时间部分（如 "15:30:00"）
        const timeString = new Date().toLocaleTimeString();

        // 拼接日期和时间（格式为 "YYYY-MM-DD HH:mm:ss"）
        const fullDateTimeString = `${currentDate} ${timeString}`;
        const currentEmail = localStorage.getItem('email')

        const masterPinia = useMasterPinia()

        if (msg.toUser) {
          console.log("私聊")
          if (msg.email == currentEmail) {
            this.privateMy.push({
              name: msg.username,
              message: msg.text,
              time: fullDateTimeString,
              id: msg.jwt,
              avatar: masterPinia.avatar,
              touser: msg.toUser,
              avatar: masterPinia.avatar,
            })
          } else {
            //接收私聊的消息
            //如果不是我发的消息、
            const newMessageStore = useNewMessageStore()
            this.privateCon.push({
              name: msg.username,
              message: msg.text,
              time: fullDateTimeString,
              id: msg.jwt,
              avatar: msg.avatar,
              touser: msg.toUser
            })
            //增加未读消息
            newMessageStore.increment(msg.toUser)
          }
          //接受私聊的消息
        } else {
          console.log("群聊")
          if (msg.text == "") return
          //接收群组的消息
          if (msg.email == currentEmail) {
            this.dataMy.push({
              name: msg.username,
              message: msg.text,
              time: fullDateTimeString,
              id: msg.jwt,
              avatar: masterPinia.avatar,
            })
          } else {
            this.dataCon.push({
              name: msg.username,
              message: msg.text,
              time: fullDateTimeString,
              id: msg.jwt,
              avatar: msg.avatar
            })
          }
        }
      }
    },

    // 发送消息方法
    sendMessage(messageText, touser) {
      const masterPinia = useMasterPinia()
      const message = {
        username: masterPinia.name,
        text: messageText,
        jwt: this.jwt,
        type: "message",
        touser: touser
      }
      console.log(message)
      this.ws.send(JSON.stringify(message))
    },


    //接受历史群组消息的方法

    async getHistory() {
      const masterPinia = useMasterPinia()
      console.log("获取历史消息")
      await axios.get('/chat/getGroupHistory').then(response => {
        const msgarr = response.data.messages

        const currentEmail = localStorage.getItem('email')
        msgarr.forEach((msg, index) => {
          console.log(msg)
          if (msg.email == currentEmail) {
            this.dataMy.push({
              name: msg.username,
              message: msg.text,
              time: msg.date,
              id: msg.jwt,
              avatar: masterPinia.avatar,
            })
          } else {
            this.dataCon.push({
              name: msg.username,
              message: msg.text,
              time: msg.date,
              id: msg.jwt,
              avatar: msg.avatar,
            })
          }
        })
      })
    },


    //切换联系人的时候，调用这个方法，使调度中心的数据重置
    resetData() {
      console.log("重置数据")
      this.dataCon = []
      this.dataMy = []
      this.privateCon = []
      this.privateMy = []
      this.jwt = localStorage.getItem('jwt') || ''
    },

    //使用这个方法可以持久化我们的数据
    saveData(stortageId, data) {
      if (!data) return
      localStorage.setItem(stortageId, JSON.stringify(data))
    },


    //使用这个封装拿到我们要的数据
    // Pinia Store 中的 getData 方法
    getData(storageId) {
      const data = localStorage.getItem(storageId);
      if (!data) return [];

      try {
        const parsed = JSON.parse(data);
        // 强制转换为数组
        return Array.isArray(parsed) ? parsed : [parsed];
      } catch {
        return [];
      }
    },



    // 关闭连接方法
    closeConnection() {
      console.log('WebSocket closed')
      // clearInterval(this.setTime)
      this.ws.close()
    }
  },


  //切换联系人的时候，调用这个方法，使调度中心的数据重置

}
)
