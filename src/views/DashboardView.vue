<template>
  <div class="dashboard-bg">
    <GuideButton />
    
    <div class="dashboard-content">
      <div class="dashboard-header">
        <span class="item-title">{{ itemName }}</span>
        <div class="title-divider"></div>
      </div>
      
      <div class="records">
        <div
          v-for="record in records"
          :key="record.id"
          class="record-row"
        >
          <span class="item-left">{{ record.leftName }} {{ record.leftCount }}</span>
          <span class="exchange-arrow">⇄</span>
          <span class="item-right">{{ record.rightName }} {{ record.rightCount }}</span>
        </div>
      </div>
    </div>
    
    <BottomBar
      :showMenu="true"
      title="Dashboard"
      currentView="dashboard"
    />
  </div>
</template>

<script setup>
import BottomBar from "@/components/BottomBar.vue"
import GuideButton from "@/components/GuideButton.vue"
import { ref, onMounted } from "vue"
import { useRoute, useRouter } from "vue-router"

const router = useRouter()
const route = useRoute()

const itemName = ref("")
const records = ref([
  { id: 1, leftName: "蘋果", leftCount: 2, rightName: "鳳梨", rightCount: 1 },
  { id: 2, leftName: "蘋果", leftCount: 1, rightName: "芒果", rightCount: 1 },
  { id: 3, leftName: "葡萄", leftCount: 3, rightName: "蘋果", rightCount: 3 },
  { id: 4, leftName: "柚子", leftCount: 1, rightName: "蘋果", rightCount: 2 },
])

onMounted(() => {
  itemName.value = route.params.item || "物品詳情"
})

function goBack() {
  router.push({ name: "select_item" })
}
</script>

<style lang="scss" scoped>
.dashboard-bg {
  width: 100vw;
  min-height: 100vh;
  background: #2d2d2d;
  color: #fff;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  position: relative;
}
.dashboard-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 3rem 0.7rem 1.2rem 0.7rem;
  box-sizing: border-box;
  overflow-y: auto;
}

.dashboard-header {
  width: 90%;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 1.2rem;
}

.item-title {
  font-size: 2rem;
  font-weight: 700;
  color: #fff;
  letter-spacing: 2px;
  text-align: center;
  width: 100%;
  margin-bottom: 0.5rem;
}

.title-divider {
  width: 100%;
  height: 2px;
  background: #fff;
  opacity: 0.45;
  margin-bottom: 0.2rem;
  border-radius: 1.5px;
}

.records {
  width: 90%;
  display: flex;
  flex-direction: column;
  gap: 14px; 
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
  .dashboard-content {
    padding: 2rem 0.4rem 0.8rem 0.4rem;
  }
  
  .dashboard-header {
    margin-bottom: 0.8rem;
  }
  
  .item-title {
    font-size: 1.4rem;
    letter-spacing: 1px;
  }
  
  .title-divider {
    height: 1.5px;
    margin-bottom: 0.15rem;
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
}

@media (max-width: 200px) {
  .dashboard-content {
    padding: 1.33rem 0.27rem 0.53rem 0.27rem;
  }
  
  .dashboard-header {
    margin-bottom: 0.53rem;
  }
  
  .item-title {
    font-size: 0.93rem;
    margin-bottom: 0.33rem;
    letter-spacing: 0.67px;
  }
  
  .title-divider {
    height: 1px;
    margin-bottom: 0.1rem;
  }
  
  .records {
    gap: 0.4rem;
  }
  
  .record-row {
    border-radius: 0.33rem;
    padding: 0.33rem 0.5rem;
    font-size: 0.67rem;
    
    .exchange-arrow {
      flex: 0 0 2rem; 
      font-size: 1.07rem; 
      -webkit-text-stroke: 0.33px #222;
    }
  }
}
</style>
