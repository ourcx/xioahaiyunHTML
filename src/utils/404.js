
import router from '@/router'
import { useManagementStore } from '@/stores/management'
/**
 * 检查目标路径是否存在有效路由
 * @param {string} targetPath 要检查的路由路径
 * @returns {boolean} 是否存在匹配的路由
 */
export function checkPermission(targetPath,id) {
  try {
    // 使用 Vue Router 的解析方法检查路径
    const managementStore=useManagementStore()
    if(targetPath==="/conversation/person/window"){
      return managementStore.dataListSide.filter(item=>item.id==id)
    }

    
    const resolved = router.resolve(targetPath)
    return resolved.matched.length > 0
  } catch (error) {
    return false
  }
}
