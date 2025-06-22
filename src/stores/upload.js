
import { defineStore } from "pinia"
import apiClient from "@/utils/api";
export const useUpLoadStore = defineStore('upload', {
  state: () => ({
    centerDialogVisible: false,
  }),
  actions: {
    async ChangeUpload(file) {
      this.centerDialogVisible=!this.centerDialogVisible
    },
    //请求需要的预签名URL
    async getUploadUrl(Name) {
      const url= await apiClient.post('/files/Url', {
        filename: Name
      })
      console.log(url.data.data.url);
      return url.data.data.url
    }
  }
})
