<template>
  <div class="select-bg">
    <GuideButton ref="guideBtn" />
    <ItemTradePie :item="itemName" api-base="/api/trade" />
    <div class="content">
      <div class="records">
        <div class="recent-label">{{ itemName }} Trading History</div>
        
        <div v-if="isLoading" class="loading-message">Loading...</div>
        <div v-else-if="tradeHistory.length === 0 && !isLoading" class="no-records">No trading records found</div>
        <div v-else v-for="record in tradeHistory" :key="record.id" class="record-row" @click="goToTrade(record)" @keydown="handleTradeKeydown($event, record)" tabindex="0">
          <div class="item-left">{{ record.leftName }} {{ record.leftCount }}</div>
          <div class="exchange-arrow">⇄</div>
          <div class="item-right">{{ record.rightName }} {{ record.rightCount }}</div>
        </div>
      </div>
    </div>

    <BottomBar :showMenu="true" title="Item Details" currentView="detailedItem" />
  </div>
</template>

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

.content {
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 3rem 0 3rem 0;
  box-sizing: border-box;
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
  flex: 1;
}

.loading-message, .no-records {
  text-align: center;
  color: #ccc;
  font-size: 0.9rem;
  padding: 2rem;
  font-style: italic;
}

.record-row {
  background: #fff;
  border-radius: 8px;
  display: flex;
  align-items: center;
  padding: 12px 24px;
  font-size: 1rem;
  font-weight: 600;
  margin-bottom: 12px;
  transition: all 0.2s ease;
  cursor: pointer;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  
  &:focus {
    outline: 3px solid #FF9800 !important;
    outline-offset: 2px;
    box-shadow: 0 0 0 1px rgba(255, 152, 0, 0.3) !important;
  }
  
  &:hover {
    background: #f5f5f5;
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }
  
  &:active {
    transform: translateY(0);
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
  }
  
  .item-left, .item-right {
    flex: 1;
    color: #222;
    font-weight: 600;
    text-align: center;
  }
  
  .exchange-arrow {
    flex: 0 0 50px;
    text-align: center;
    color: #666;
    font-size: 1.2rem;
    font-weight: 400;
  }
}

@media (max-width: 480px) {
  .content {
    padding: 2rem 0 2rem 0;
  }
}

@media (max-width: 300px) {
  .content {
    padding: 2rem 0 0.8rem 0;
  }

  .record-row {
    padding: 8px 16px;
    font-size: 0.85rem;
    
    .item-left, .item-right {
      font-size: 0.85rem;
    }
    
    .exchange-arrow {
      flex: 0 0 40px;
      font-size: 1rem;
    }
  }
  
  .loading-message, .no-records {
    font-size: 0.8rem;
    padding: 1.5rem;
  }
}

@media (max-width: 200px) {
  .content {
    padding: 1.33rem 0 0.53rem 0;
  }

  .record-row {
    padding: 6px 12px;
    font-size: 0.7rem;
    margin-bottom: 8px;
    
    .item-left, .item-right {
      font-size: 0.7rem;
      min-width: 0;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    
    .exchange-arrow {
      flex: 0 0 30px;
      font-size: 0.8rem;
    }
  }
  
  .recent-label {
    font-size: 0.5rem;
    margin: 0.3rem 0 0.2rem 0.1rem;
  }
  
  .loading-message, .no-records {
    font-size: 0.6rem;
    padding: 1rem;
  }
}
</style>

<script>
import GuideButton from "@/components/GuideButton.vue";
import BottomBar from "@/components/BottomBar.vue";
import ItemTradePie from '@/components/ItemTradePie.vue';
export default {
  name: "DetailedItemView",
  components: { 
    GuideButton, 
    BottomBar
  },
  data() {
    return {
      itemName: "",
      isLoading: false,
      error: null,
      tradeHistory: []
    };
  },
  mounted() {
    this.itemName = this.$route.params.itemName || "";
    this.fetchTradeHistory();
  },
  watch: {
    '$route.params.itemName'() {
      this.itemName = this.$route.params.itemName || "";
      this.fetchTradeHistory();
    }
  },
  methods: {
    async fetchTradeHistory() {
      if (!this.itemName) return;
      
      this.isLoading = true;
      this.error = null;

      const params = new URLSearchParams({
        target: this.itemName
      });

      try {
        const response = await fetch(`/api/trade/trade-history?${params.toString()}`, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' }
        });

        const data = await response.json();

        if (response.ok) {
          if (data.trade_history && Array.isArray(data.trade_history)) {
            this.tradeHistory = data.trade_history.map((item, index) => ({
              id: item.trade_id || index + 1,
              leftName: item.item_a,
              leftCount: item.quantity_a,
              rightName: item.item_b,
              rightCount: item.quantity_b,
              timestamp: item.timestamp
            }));
          } else {
            this.tradeHistory = [];
          }
        } else {
          console.error('Failed to fetch trade history:', data);
          this.tradeHistory = [];
        }
      } catch (err) {
        console.error("Error fetching trade history:", err);
        this.error = "Failed to load trade history";
        this.tradeHistory = [];
      } finally {
        this.isLoading = false;
      }
    },
    
    goBack() {
      this.$router.push('/dashboard');
    },
    
    goToTrade(record = null) {
      const query = {};
      
      if (record) {
        query.item_a = record.leftName;
        query.quantity_a = record.leftCount;
        query.item_b = record.rightName;
        query.quantity_b = record.rightCount;
      } else {
        query.item_a = this.itemName;
        query.quantity_a = 1;
      }

      this.$router.push({
        path: '/trade',
        query: query
      });
    },
    
    handleTradeKeydown(e, record) {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        this.goToTrade(record);
      }
    }
  }
};
</script>