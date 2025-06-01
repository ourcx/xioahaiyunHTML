
import { defineStore } from "pinia"



// 在 store 中添加方法会更规范
export const useManagementFile = defineStore('file', {
  state: () => ({
    headerFile:"HomeHearder",
    //选中的时候的状态
    selectedFile: [],
    //选择的文件
    selects:'',
  }),
  actions: {
    move(){
      this.selects = "move"
    },
    copy(){
      this.selects = "copy"
    }
  }
})
