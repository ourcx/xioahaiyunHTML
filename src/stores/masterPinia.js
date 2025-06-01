import axios from 'axios'
import { defineStore } from 'pinia'

//一些全局的数据，比如用户信息，菜单信息等，可以放在这里
export const useMasterPinia = defineStore('masterPinia', {
  state: () => (
    {
      avatar: '',
      signature:'',
      email:'',
      name: '',
    }
  ),
  actions: {
    async setData() {
      axios.get('/profiles/GetProfile', {
        headers: {
          // 从 localStorage 或其他存储中获取 token
          'Authorization': `${localStorage.getItem('jwt')}`
        }
      })
        .then(response => {
          // 处理成功响应\
          this.avatar = response.data.data.avatar_url;
          this.signature = response.data.data.signature;
          this.email = response.data.data.Email;
          this.name = response.data.data.name;
          localStorage.setItem('email', this.email)
          //更新三个基础数据
          console.log(this.avatar);
        })
        .catch(error => {
          // 处理错误
          console.error("Failed to fetch profile:", error);
        });
    }
  }
})
