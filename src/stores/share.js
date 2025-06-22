import { defineStore } from 'pinia'
import apiClient from '@/utils/api'
import { useRouter } from 'vue-router'
import { useRoute } from 'vue-router'

export const useShareStore = defineStore('share', {
  state: () => ({
    uuid: '',
    pwd: '',
    userId: useRoute().query.userId || '', // 从路由查询参数获取userId
    check: false,
    verifiedShares: {} // 存储已验证的分享ID
  }),
  actions: {
    addShare (por) {
      this.uuid = por
    },
    addPwd (por) {
      this.pwd = por
    },
    async CheckShare () {
      // 1. 提前获取 router 实例 (确保在 setup 中已定义)
      const router = useRouter()

      // 2. 处理空值情况更友好
      if (!this.pwd || !this.uuid) {
        // 可以添加用户提示
        console.warn('密码或UUID为空')
        router.push({ path: '/s', query: { one_id: this.uuid || 'unknown',userId: this.userId || 'unknown' } })
        return
      }

      try {
        // 3. 统一使用 async/await 风格
        const response = await apiClient.post('/user/checked', {
          one_id: this.uuid,
          Password: this.pwd
        })
        if (response.data.code === 200) {
          // 5. 修复变量名: 使用 this.uuid 而不是 uuid
          this.verifiedShares[this.uuid] = {
            verified: true,
            expires: Date.now() + 2 * 60 * 60 * 1000 // 2小时有效期
          }

          // 6. 保存到 sessionStorage
          localStorage.setItem('verifiedShares', JSON.stringify(this.verifiedShares))
        } else {
          // 处理非200状态码
          console.error('验证失败:', response.data)
          router.push({ path: '/s', query: { one_id: this.uuid,userId:this.userId } })
        }
      } catch (err) {
        // 7. 统一错误处理
        console.error('API请求失败:', err)
        router.push({ path: '/s', query: { one_id: this.uuid,userId:this.userId } })
      }
    }
  }
})
