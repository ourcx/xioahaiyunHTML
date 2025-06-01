
// stores/chatStore.js
import { defineStore } from 'pinia'
import axios from 'axios';
import { toRaw } from 'vue'
import apiClient from '@/utils/api';
import { useNewMessageStore } from './newmessage';




export const useManagementStore = defineStore('ManagementChat', {
  state: () => ({
    dataListSide: [
      {
        src: 'https://s2.loli.net/2025/05/29/HSaD38fFVYmiWIo.png',
        name: '群组',
        date: '刚刚',
        id: "322323",
        // 加上一个后台生成的群id码
        group: true,
        progreCount: 0
      },
      //在这里修改date的值，选择缓存的数据和自己的数据
    ],
    bookList: [],
    clickStaus: []
  }),
  actions: {
    addAdtaListSide(data) {
      this.dataListSide = this.dataListSide.slice(0)
      const isIdExist = dataListSide.some(item => item.id === data.id);
      if (isIdExist) return;
      //存在一样的id就不要加东西进去了，id是存在于注册数据库的唯一值
      this.dataListSide.push({
        src: data.avatar,
        name: data.toUser,
        date: data.time,
        connet: data.message,
        id: data.id
      })
    },

    async updateListSide() {
      this.dataListSide = this.dataListSide.slice(0)
      const newMessageStore = useNewMessageStore()
      const response = await apiClient.get('/profiles/getRBook');
      response.data.data.forEach(item => { this.dataListSide.push(item), newMessageStore.updateUnread(item) });
    },

    initBookList(i) {
      this.bookList.push(i)
    },


    clickSendData(data) {
      if (this.clickStaus.includes(data)) return
      if (this.clickStaus.length > 0) {
        this.clickStaus.pop()
      }
      this.clickStaus.push(data)
    },

    //收到消息页面滚动
    changeTime(id, time) {
      const index = this.dataListSide.find(item => item.id === id);
      index.date = time ? time : "未知"
    },
    //还需要制作一个，当前时间在一天以内表示成非日期的数字
    formatTimeToHHmm(datetimeStr) {
      const date = new Date(datetimeStr);
      if (isNaN(date)) return '未知'; // 处理解析失败

      // 补零函数：将数字转为两位数
      const pad = (num) => num.toString().padStart(2, '0');

      const hours = pad(date.getHours());
      const minutes = pad(date.getMinutes());

      return `${hours}:${minutes}`;
    },

    //判断时间是否在同一天以内
    isWithinOneDay(inputDate) {
      // 统一转换为 Date 对象
      const date = new Date(inputDate);
      if (isNaN(date)) return false; // 无效日期直接返回 false

      // 当前时间和传入日期的差值（毫秒）
      const diff = Date.now() - date.getTime();

      // 判断差值是否在 24 小时内（0 ≤ diff ≤ 86400000）
      return diff >= 0 && diff <= 86400000;
    },

    // 改进后的验证函数
    async sendJwtToBackend() {
      try {
        const jwt = localStorage.getItem('jwt')

        // 基础校验
        if (!jwt?.trim()) {
          console.warn('空值')
          return false
        }

        // 明确设置请求头
        const response = await axios.post('/user/parseJwt',
          { jwt },
        )

        // 根据业务需求调整判断逻辑
        if (response.status === 200) {
          return true
        }

        // 清除无效 token
        // localStorage.removeItem('jwt')
        return false
      } catch (error) {
        return false

      }
    },
    async progress() {
      await apiClient.get('/data/total').then(res => {
        const progreCount = localStorage.getItem('progreCount')
        if(parseInt(progreCount) == parseInt(res.data.data)&&progreCount) {
          this.progreCount = progreCount
          return
        }
         localStorage.setItem('progreCount', res.data.data)
        this.progreCount = res.data.data
      })
    },
  }

}
)
