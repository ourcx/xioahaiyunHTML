// stores/message.js
import { defineStore } from 'pinia'

export const useNewMessageStore = defineStore('message', {
  state: () => ({
    unread:[],
  }),
  actions: {
    // 更新未读数量
    updateUnread(user) {
      this.unread.push({id:user.id,unreadCount:0})
      console.log(this.unread)
    },

    // 增加未读数
    increment(item) {
      const unreadItem = this.unread.find(i => i.id === item.id)
      if (unreadItem) {
        unreadItem.unreadCount++
      }
    },

    // 重置未读数
    re(item) {
      const unreadItem = this.unread.find(i => i.id === item.id)
      if (unreadItem) {
        unreadItem.unreadCount = 0
      }
    },

  },
  persist: true // 持久化配置
})
