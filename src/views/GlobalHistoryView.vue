<template>
  <div class="history-bg">
    <GuideButton />
    
    <div class="history-content">
      <div class="search-bar">
        <span class="search-icon"></span>
        <input type="text" v-model="search" placeholder="search record..." />
      </div>
      <div class="records">
        <div v-for="item in filteredRecords" :key="item.id" class="record-row">
          <span class="item-left">{{ item.leftName }} {{ item.leftCount }}</span>
          <span class="exchange-arrow">⇄</span>
          <span class="item-right">{{ item.rightName }} {{ item.rightCount }}</span>
        </div>
      </div>
    </div>
    
    <BottomBar 
      :showMenu="true" 
      :titleIcon="require('@/assets/Icons/globe.svg')" 
      :titleIconAlt="'globe icon'"
      :titleIconClass="'globe-icon'"
      @goBack="goBack"
    />
  </div>
</template>

<script setup>
import BottomBar from "@/components/BottomBar.vue"
import GuideButton from "@/components/GuideButton.vue"
import { ref, computed } from "vue"
import { useRouter } from "vue-router"

const router = useRouter()

// 響應式數據
const search = ref("")
const records = ref([
  { id: 1, leftName: "蘋果", leftCount: 2, rightName: "鳳梨", rightCount: 1 },
  { id: 2, leftName: "香蕉", leftCount: 3, rightName: "橘子", rightCount: 2 },
  { id: 3, leftName: "蘋果", leftCount: 1, rightName: "芒果", rightCount: 1 },
  { id: 4, leftName: "西瓜", leftCount: 1, rightName: "香蕉", rightCount: 2 },
  { id: 5, leftName: "百香果", leftCount: 2, rightName: "西瓜", rightCount: 1 },
  { id: 6, leftName: "葡萄", leftCount: 3, rightName: "蘋果", rightCount: 3 },
  { id: 7, leftName: "鳳梨", leftCount: 1, rightName: "西瓜", rightCount: 1 },
  { id: 8, leftName: "柳丁", leftCount: 2, rightName: "香蕉", rightCount: 1 },
  { id: 9, leftName: "柚子", leftCount: 1, rightName: "蘋果", rightCount: 2 },
  { id: 10, leftName: "蜜棗", leftCount: 2, rightName: "葡萄", rightCount: 1 },
  { id: 11, leftName: "芒果", leftCount: 2, rightName: "柳丁", rightCount: 1 }
])

// 計算屬性
const filteredRecords = computed(() => {
  if (!search.value) return records.value
  const keyword = search.value.trim()
  return records.value.filter(
    (r) =>
      `${r.leftName}${r.leftCount}`.includes(keyword) ||
      `${r.rightName}${r.rightCount}`.includes(keyword)
  )
})

// 方法
function goBack() {
  router.back()
}
</script>

<style lang="scss" scoped>
.history-bg {
  width: 100vw;
  min-height: 100vh;
  background: #2d2d2d; /* 與其他頁面保持一致的背景色 */
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  position: relative; /* 讓 GuideButton 的 absolute 定位有參考點 */
}

.history-content {
  flex: 1; /* 佔據剩餘空間 */
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 3rem 0.7rem 1.2rem 0.7rem; /* 增加頂部 padding 避免與 GuideButton 重疊 */
  box-sizing: border-box;
  overflow-y: auto; /* 允許內容滾動 */
}

.search-bar {
  display: flex;
  align-items: center;
  width: 90%;
  background: rgba(255, 255, 255, 0.1); /* 添加背景色 */
  border-radius: 12px;
  padding: 10px 16px;
  margin-bottom: 1rem; /* 添加與記錄列表的間距 */
  
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
  gap: 14px; /* 使用 gap 取代 margin-top */
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

/* 響應式設計 */
@media (max-width: 480px) {
  .history-content {
    padding: 2.5rem 0.5rem 1rem 0.5rem;
  }
  
  .search-bar {
    width: 95%;
  }
  
  .records {
    width: 95%;
    gap: 12px;
  }
  
  .record-row {
    padding: 10px 18px;
    font-size: 1.2rem;
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
      padding: 6px 10px;
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
      font-size: 1.5rem;
      -webkit-text-stroke: 0.5px #222;
    }
  }
}

@media (max-width: 200px) {
  .history-content {
    padding: 1.33rem 0.27rem 0.53rem 0.27rem; /* 2rem * 2/3 等比例縮放 */
  }
  
  .search-bar {
    padding: 0.33rem 0.5rem; /* 縮放 padding */
    
    .search-icon {
      width: 12px; /* 18px * 2/3 */
      height: 12px;
      margin-right: 0.33rem;
      
      &::before {
        width: 8px; /* 12px * 2/3 */
        height: 8px;
        border: 1px solid #fff;
        left: 0px;
        top: 0px;
      }
      
      &::after {
        width: 4px; /* 6px * 2/3 */
        height: 1px;
        bottom: 1px;
        right: 1px;
      }
    }
    
    input {
      padding: 0.27rem 0.33rem; /* 等比例縮放 */
      font-size: 0.6rem; /* 0.9rem * 2/3 */
    }
  }
  
  .records {
    gap: 0.4rem; /* 9px * 2/3 ≈ 6px */
  }
  
  .record-row {
    border-radius: 0.33rem; /* 8px * 2/3 ≈ 5px */
    padding: 0.33rem 0.5rem; /* 等比例縮放 */
    font-size: 0.67rem; /* 1rem * 2/3 */
    
    .exchange-arrow {
      flex: 0 0 2rem; /* 40px * 2/3 ≈ 27px */
      font-size: 1rem; /* 1.5rem * 2/3 */
      -webkit-text-stroke: 0.33px #222;
    }
  }
}
</style>
