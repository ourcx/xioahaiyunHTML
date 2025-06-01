import { defineStore } from "pinia"
import { ref } from 'vue'
import {useCounterStore} from '@/stores/tree/tree';

const levelStore = useCounterStore()

export const useEnterStore = defineStore('enter', () => {

  const rootLog = ref('')
  //这个东西会记录当前的文件夹,防止出现bug，既是当前的目录

  function enter(fileName) {

    if (fileName != rootLog.value) {
      levelStore.addLevel(fileName)
      //新进入的文件夹必须和当前的目录不一样
    }else{
      //文件夹相同，则不进行操作
      //这个操作必须只对文件夹类型的文件产生作用
    }


    //进入的时候发送点击进去的文件夹

    //发送网络请求去查找列表
  }
})
