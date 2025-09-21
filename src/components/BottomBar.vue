<template>
  <div class="btm-bar">
    <span
      v-if="showMenu"
      class="btm-bar-btn"
      aria-label="page selection"
      @click="goToMenu"
    >
      <img src="@/assets/Icons/hamburger-bar.svg" alt="page selection" />
    </span>
    
    <div v-else class="btm-bar-spacer"></div>

    <div class="btm-bar-header">{{ title }}</div>

    <span class="btm-bar-btn" aria-label="back" @click="goBack">
      <img src="@/assets/Icons/back-arrow.svg" alt="back to previous page" />
    </span>
  </div>
</template>

<script>
import { useRouter, useRoute } from 'vue-router';
import { onMounted, onUnmounted } from 'vue'
import { useNavigationStore } from '@/stores/navigation'

export default {
  props: {
    showMenu: {
      type: Boolean,
      default: true,
    },
    title: {
      type: String,
      default: "",
    },
    currentView: {
      type: String,
      default: "",
    }
  },
  setup(props) {
    const router = useRouter();
    const route = useRoute();
    const navigationStore = useNavigationStore();
    
    function goBack() {
      const currentPage = route.name;
      
      // 檢查是否通過menu導航到當前頁面
      if (navigationStore.isViaMenu(currentPage)) {
        // 如果是通過menu導航的，直接回到來源頁面
        const previousPage = navigationStore.getPreviousPage(currentPage);
        if (previousPage && previousPage !== 'unknown') {
          // 清除當前頁面的導航歷史
          navigationStore.clearHistory(currentPage);
          // 導航到來源頁面
          router.push({ name: previousPage });
          return;
        }
      }
      
      // 如果沒有記錄的導航歷史，使用默認的返回行為
      if (currentPage === 'menu') {
        router.back();
      } else if (currentPage === 'detailed_item') {
        // 從詳細項目頁面返回到儀表板
        router.push({ name: 'dashboard' });
      } else {
        // 其他頁面的默認行為
        router.back();
      }
    }
    
    function goToMenu() {
      router.push({ name: 'menu', query: { view: props.currentView } })
    }
    
    function handleEsc(e) {
      if (e.key === 'Escape' && props.showMenu) {
        goToMenu()
      }
    }
    
    onMounted(() => {
      document.addEventListener('keydown', handleEsc)
    })
    
    onUnmounted(() => {
      document.removeEventListener('keydown', handleEsc)
    })
    
    return { goBack, goToMenu }
  }
};
</script>

<style scoped>
.btm-bar {
  position: sticky;
  bottom: 0;
  left: 0;
  right: 0;
  width: 100vw;
  min-height: 3.5rem;
  background: #19181a;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 -2px 16px #0004;
  z-index: 100;
  padding: 0.5rem 0.75rem;
  box-sizing: border-box;
  margin-top: auto;
}

.btm-bar-btn {
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.75rem;
  min-width: 2.5rem;
  min-height: 2.5rem;
  transition: background-color 0.2s ease;
  border-radius: 0.5rem;
  
  &:hover {
    background: rgba(255, 255, 255, 0.1);
  }
  
  img {
    width: 1.5rem;
    height: 1.5rem;
    display: block;
    filter: brightness(0) invert(1);
  }
}

.btm-bar-spacer {
  min-width: 2.5rem;
  min-height: 2.5rem;
  padding: 0.75rem;
}

.btm-bar-btn:focus {
  outline: none;
  box-shadow: none;
}

.btm-bar-header {
  flex: 1;
  text-align: center;
  font-weight: bold;
  font-size: 1.2rem;
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 0.5rem;
}

@media (max-width: 480px) {
  .btm-bar {
    min-height: 3rem;
    padding: 0.375rem 0.5rem;
  }
  
  .btm-bar-btn {
    padding: 0.5rem;
    min-width: 2.25rem;
    min-height: 2.25rem;
    
    img {
      width: 1.25rem;
      height: 1.25rem;
    }
  }
  
  .btm-bar-spacer {
    min-width: 2.25rem;
    min-height: 2.25rem;
    padding: 0.5rem;
  }
  
  .btm-bar-header {
    font-size: 1rem;
  }
}

@media (max-width: 300px) {
  .btm-bar {
    min-height: 2.5rem;
    padding: 0.25rem;
  }
  
  .btm-bar-btn {
    padding: 0.25rem;
    min-width: 1.75rem;
    min-height: 1.75rem;
    
    img {
      width: 0.875rem;
      height: 0.875rem;
    }
  }
  
  .btm-bar-spacer {
    min-width: 1.75rem;
    min-height: 1.75rem;
    padding: 0.25rem;
  }
  
  .btm-bar-header {
    font-size: 1rem;
  }
}

@media (max-width: 200px) {
  .btm-bar {
    min-height: 1.6rem;
    padding: 0.17rem;
  }
  
  .btm-bar-btn {
    padding: 0.17rem;
    min-width: 1.17rem;
    min-height: 1.17rem;
    
    img {
      width: 0.58rem;
      height: 0.58rem;
    }
  }
  
  .btm-bar-spacer {
    min-width: 1.17rem;
    min-height: 1.17rem;
    padding: 0.17rem;
  }
  
  .btm-bar-header {
    font-size: 0.66rem;
  }
}
.icon {
  width: 24px;
  height: 24px;
  object-fit: contain;
  display: block;
  margin: 0 auto;
}
.user-icon {
  transform: translate(4px); 
}
.globe-icon {
  margin: 0 auto;
}
.icon {
  width: 24px;
  height: 24px;
  object-fit: contain;
  display: block;
  margin: 0 auto;
}
.user-icon {
  transform: translate(4px); 
}
.globe-icon {
  margin: 0 auto;
}
</style>
