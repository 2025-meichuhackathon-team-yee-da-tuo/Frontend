import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useNavigationStore = defineStore('navigation', () => {
  // 存儲每個頁面的來源頁面信息
  const pageHistory = ref(new Map())
  
  // 記錄從某個頁面導航到另一個頁面的關係
  function recordNavigation(fromPage, toPage, viaMenu = false) {
    if (viaMenu) {
      // 如果通過menu導航，記錄來源頁面
      pageHistory.value.set(toPage, {
        from: fromPage,
        viaMenu: true,
        timestamp: Date.now()
      })
    } else {
      // 直接導航，清除menu導航記錄
      pageHistory.value.delete(toPage)
    }
  }
  
  // 獲取指定頁面的來源頁面
  function getPreviousPage(currentPage) {
    const history = pageHistory.value.get(currentPage)
    return history ? history.from : null
  }
  
  // 檢查是否通過menu導航到當前頁面
  function isViaMenu(currentPage) {
    const history = pageHistory.value.get(currentPage)
    return history ? history.viaMenu : false
  }
  
  // 清除指定頁面的歷史記錄
  function clearHistory(page) {
    pageHistory.value.delete(page)
  }
  
  // 清除所有歷史記錄
  function clearAllHistory() {
    pageHistory.value.clear()
  }
  
  return {
    pageHistory,
    recordNavigation,
    getPreviousPage,
    isViaMenu,
    clearHistory,
    clearAllHistory
  }
})
