<template>
  <div class="history-bg">
    <GuideButton />
    
    <div class="history-content">
      <div class="search-bar">
        <span class="search-icon"></span>
        <input type="text" v-model="search" placeholder="search record..." />
      </div>
      <div class="records">
        <div v-if="isLoading" class="loading-message">Loading...</div>
        <div v-else-if="filteredRecords.length === 0 && !isLoading" class="no-records">No transaction records found</div>
        <div v-else v-for="item in filteredRecords" :key="item.id" class="record-row">
          <span class="item-left">{{ item.leftName }} {{ item.leftCount }}</span>
          <span class="exchange-arrow">⇄</span>
          <span class="item-right">{{ item.rightName }} {{ item.rightCount }}</span>
        </div>
      </div>
    </div>
    
    <BottomBar 
      :showMenu="true" 
      title="User History"
      currentView="user_history"
    />
  </div>
</template>

<script setup>
import BottomBar from "@/components/BottomBar.vue"
import GuideButton from "@/components/GuideButton.vue"
import { ref, computed, onMounted } from "vue"
import { useRouter } from "vue-router"
import { useUserStore } from "@/stores/user"

const router = useRouter()
const userStore = useUserStore()
const search = ref("")
const records = ref([])
const isLoading = ref(false)

onMounted(() => {
  userStore.restoreUser()
  if (!userStore.isLoggedIn) {
    router.push({ name: 'login' })
    return
  }
  fetchTradeHistory()
})

const filteredRecords = computed(() => {
  if (!search.value) return records.value
  const keyword = search.value.trim()
  return records.value.filter(
    (r) =>
      `${r.leftName}${r.leftCount}`.includes(keyword) ||
      `${r.rightName}${r.rightCount}`.includes(keyword)
  )
})

async function fetchTradeHistory() {
  if (!userStore.email) return
  
  isLoading.value = true

  const params = new URLSearchParams({
    user: userStore.email
  })

  try {
    const response = await fetch(`/api/trade/trade-history?${params.toString()}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    })

    const data = await response.json()

    if (response.ok) {
      if (data.trade_history && Array.isArray(data.trade_history)) {
        records.value = data.trade_history.map((item, index) => ({
          id: item.trade_id || index + 1,
          leftName: item.item_a,
          leftCount: item.quantity_a,
          rightName: item.item_b,
          rightCount: item.quantity_b,
          timestamp: item.timestamp
        }))
      } else {
        records.value = []
      }
    } else {
      console.error('Failed to fetch trade history:', data)
      records.value = []
    }
  } catch (error) {
    console.error('Network error:', error)
    records.value = []
  } finally {
    isLoading.value = false
  }
}
</script>

<style lang="scss" scoped>
.history-bg {
  width: 100vw;
  min-height: 100vh;
  background: #2d2d2d;
  display: flex;
  flex-direction: column; 
  box-sizing: border-box;
  position: relative;
}

.history-content {
  flex: 1; 
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 3rem 0.7rem 1.2rem 0.7rem;
  box-sizing: border-box;
  overflow-y: auto;
}

.search-bar {
  display: flex;
  align-items: center;
  width: 90%;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: 10px 16px;
  margin-bottom: 1rem;
  
  .search-icon {
    flex: 0 0 auto;  
    display: inline-block;
    width: 24px;
    height: 24px;
    position: relative;
    margin-right: 15px;
    
    &::before {
      content: '';
      display: block;
      width: 16px;
      height: 16px;
      border: 2px solid #fff;
      border-radius: 50%;
      position: absolute;
      left: 2px;
      top: 2px;
      box-sizing: border-box;
      background: transparent;
    }
    
    &::after {
      content: '';
      display: block;
      width: 8px;
      height: 2px;
      border-radius: 2px;
      background: #fff;
      position: absolute;
      bottom: 5px;
      right: 2px;
      transform: rotate(45deg);
    }
  }
  
  input {
    width: 100%;
    flex: 1;
    background: #fff;
    border: 0;
    border-radius: 8px;
    padding: 8px 12px;
    font-size: 1.1rem;
    outline: none;
    color: #222;
    
    &::placeholder {
      color: #999;
    }
  }
}

.records {
  width: 90%;
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.loading-message, .no-records {
  text-align: center;
  color: #ccc;
  font-size: 1.1rem;
  padding: 2rem;
}

.record-row {
  background: #fff;
  border-radius: 11px;
  display: flex;
  align-items: center;
  padding: 12px 24px;
  font-size: 1.35rem;
  font-weight: 600;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  
  .item-left, .item-right {
    flex: 1;
    color: #222;
    text-align: center;
  }
  
  .exchange-arrow {
    flex: 0 0 50px;
    font-size: 2.1rem;
    -webkit-text-stroke: 1px #222; 
    color: #222;
    text-align: center;
  }
}


@media (max-width: 300px) {
  .history-content {
    padding: 2rem 0.4rem 0.8rem 0.4rem;
  }
  
  .search-bar {
    padding: 8px 12px;
    
    .search-icon {
      width: 18px;
      height: 18px;
      margin-right: 8px;
      
      &::before {
        width: 12px;
        height: 12px;
        border: 1.5px solid #fff;
        left: 1px;
        top: 1px;
      }
      
      &::after {
        width: 6px;
        height: 1.5px;
        bottom: 2px;
        right: 2px;
      }
    }
    
    input {
      width: 100%;
      padding: 6px 10px;
      border-radius: 6px;
      font-size: 0.9rem;
    }
  }
  
  .records {
    gap: 9px;
  }
  
  .record-row {
    border-radius: 8px;
    padding: 8px 12px;
    font-size: 1rem;
    
    .exchange-arrow {
      flex: 0 0 40px;
      font-size: 1.6rem;
      -webkit-text-stroke: 0.5px #222;
    }
  }
  
  .loading-message, .no-records {
    font-size: 0.9rem;
    padding: 1.5rem;
  }
}

@media (max-width: 200px) {
  .history-content {
    padding: 1.33rem 0.2rem 0.53rem 0.2rem;
  }
  
  .search-bar {
    width: 95%;
    padding: 0.25rem 0.3rem; 
    border-radius: 0.5rem;
    margin-bottom: 0.5rem;
    
    .search-icon {
      width: 10px;
      height: 10px;
      margin-right: 0.2rem;
      
      &::before {
        width: 6px;
        height: 6px;
        border: 0.5px solid #fff;
        left: 1px;
        top: 1px;
      }
      
      &::after {
        width: 3px;
        height: 0.5px;
        bottom: 1px;
        right: 0.5px;
      }
    }
    
    input {
      width: 100%;
      padding: 0.2rem 0.25rem;
      border-radius: 0.2rem;
      font-size: 0.5rem;
      min-width: 0;
      
      &::placeholder {
        font-size: 0.45rem;
      }
    }
  }
  
  .records {
    width: 95%;
    gap: 0.3rem;
  }
  
  .record-row {
    border-radius: 0.25rem;
    padding: 0.2rem 0.3rem;
    font-size: 0.55rem;
    
    .item-left, .item-right {
      min-width: 0;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    
    .exchange-arrow {
      flex: 0 0 1.5rem;
      font-size: 0.8rem;
      -webkit-text-stroke: 0.2px #222;
    }
  }
  
  .loading-message, .no-records {
    font-size: 0.6rem;
    padding: 1rem;
  }
}
</style>