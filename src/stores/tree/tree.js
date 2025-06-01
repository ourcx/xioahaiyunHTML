
import { defineStore } from "pinia"
import { ref } from 'vue'
import { useFileTreeStore } from "./fileTree"


// 在 store 中添加方法会更规范
export const useCounterStore = defineStore('level', () => {
  const fileTreeStore = useFileTreeStore()
  const level = fileTreeStore.routeArr

  function addLevel(newLevel) {
    fileTreeStore.routeArr.push(newLevel)
  }

  function deleteLevel() {
    fileTreeStore.routeArr.pop()
  }

  function updateLevel(index, newLevel) {
    fileTreeStore.routeArr[index] = newLevel
  }

  function getLevel(level) {
    fileTreeStore.routeArr = level
  }

  return { level, addLevel,deleteLevel,updateLevel,getLevel }
  //可以在这里对一些规则进行操作
})
