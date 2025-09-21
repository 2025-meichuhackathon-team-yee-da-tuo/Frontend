<template>
  <div class="select-bg">
    <div class="search-bar">
      <span class="search-icon"></span>
      <input type="text" v-model="search" placeholder="search record..." />
    </div>
    <div class="records">
      <div v-if="isLoading" class="recent-label">Loading...</div>
      <div v-else-if="filteredRecords.length === 0 && !isLoading" class="recent-label">No transaction records found</div>
      <div v-else v-for="item in filteredRecords" :key="item.id" class="record-row">
        <span class="item-left">{{ item.leftName }} {{ item.leftCount }}</span>
        <span class="exchange-arrow">⇄</span>
        <span class="item-right">{{ item.rightName }} {{ item.rightCount }}</span>
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
.select-bg {
  width: 100%;
  max-width: 100vw;
  min-height: 100vh;
  background: #222;
  color: #fff;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  position: relative;
}

.search-bar {
  width: 100%;
  max-width: 100%;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  border-radius: 12px;
  padding: 1rem 1rem 0.8rem 1rem;
  position: sticky;
  top: 0;
  z-index: 101;
  background: #222;
  
  .search-icon {
    flex: 0 0 auto;  
    display: inline-block;
    width: 13px;
    height: 13px;
    position: relative;
    margin-right: 5px;
    
    &::before {
      content: '';
      display: block;
      width: 8px;
      height: 8px;
      border: 1px solid #fff;
      border-radius: 50%;
      position: absolute;
      left: 1px;
      top: 1px;
      box-sizing: border-box;
      background: transparent;
    }
    
    &::after {
      content: '';
      display: block;
      width: 4px;
      height: 1px;
      border-radius: 2px;
      background: #fff;
      position: absolute;
      bottom: 2.7px;
      right: 2.7px;
      transform: rotate(45deg);
    }
  }
  
  input {
    flex: 1 1 0;  
    width: 100%;
    min-width: 0;
    background: #fff;
    border: 0;
    border-radius: 4px;
    padding: 6px 10px;
    font-size: 0.88rem;
    outline: none;
    
    &:focus {
      outline: 3px solid #FF9800 !important;
      outline-offset: 2px;
      box-shadow: 0 0 0 1px rgba(255, 152, 0, 0.3) !important;
    }
  }
}

.recent-label {
  color: #bbb;
  font-size: 0.62rem;
  font-weight: 400;
  margin: 0.5rem 0 0.3rem 0.2rem;
  letter-spacing: 1px;
}

.records {
  width: 90%;
  margin: 0px auto;
  padding-bottom: 4rem;
}

.record-row {
  background: #fff;
  color: #222;
  border-radius: 8px;
  display: flex;
  align-items: center;
  margin-bottom: 12px;
  padding: 12px 24px;
  font-size: 1rem;
  font-weight: 600;
  
  .item-left, .item-right {
    flex: 1;
    color: #222;
    text-align: center;
  }
  
  .exchange-arrow {
    flex: 0 0 50px;
    font-size: 1.2rem;
    color: #666;
    text-align: center;
  }
}

@media (max-width: 300px) {
  .record-row {
    padding: 8px 12px;
    font-size: 0.85rem;
  }
}

@media (max-width: 200px) {
  .select-bg {
    font-size: 0.49rem;
    padding: 0vh 0vw 0vh 0vw;
  }
  .search-bar {
    padding: 0.5rem 0.4rem;
    
    .search-icon {
      width: 8px;
      height: 8px;
      margin-right: 3px;
      
      &::before {
        width: 5px;
        height: 5px;
      }
      
      &::after {
        width: 2px;
        height: 1px;
      }
    }
    
    input {
      padding: 3px 5px;
      font-size: 0.6rem;
    }
  }
  
  .record-row {
    padding: 5px 8px;
    font-size: 0.7rem;
    margin-bottom: 8px;
  }
  
  .recent-label {
    font-size: 0.5rem;
    margin: 0.3rem 0 0.2rem 0.1rem;
  }
}
</style>

