
import { defineStore } from "pinia"
import apiClient from "@/utils/api";
export const useD3Store = defineStore('D3', {
  state: () => ({
    datas: []
  }),
  actions: {
    async getUersList() {
      if  (this.datas.length > 0) return
      const response = await apiClient.get(`/data/proportion`);
      // 如果请求成功，处理响应数据
      if (response.status === 200) {
          const data = response.data
          const total = parseInt(localStorage.getItem('progreCount')) * 1024 * 1204
          this.datas.push(
            { name: "文档", value: parseInt(data.doc / total * 100) },
            { name: "图片", value: parseInt(data.img / total * 100) },
            { name: "视频", value: parseInt(data.video / total * 100) },
            { name: "音频", value: parseInt(data.mp3 / total * 100) },
            { name: "其他", value: parseInt((1 - data.doc / total - data.img / total - data.video / total - data.mp3 / total) * 100) },
          )
        return response
      }
    }
  }
})
