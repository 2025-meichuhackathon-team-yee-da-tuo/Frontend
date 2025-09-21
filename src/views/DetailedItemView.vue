<template>
  <div class="select-bg" role="main" aria-label="Item Details Page">
    <GuideButton ref="guideBtn" />
    
    <!-- Error Message -->
    <div v-if="error" class="error-message" role="alert" aria-live="polite">
      <div class="error-content">
        <span class="error-icon">⚠️</span>
        <span class="error-text">{{ error }}</span>
        <button @click="retryFetch" class="retry-btn" aria-label="Retry loading">
          Retry
        </button>
      </div>
    </div>
    
    <!-- Item Trade Pie Chart -->
    <div v-if="!error && itemName" class="pie-chart-container">
      <ItemTradePie :item="itemName" api-base="/api/trade" :size="140" />
    </div>
    
    <div class="content">
      <div class="records" role="region" aria-label="Trading History">
        <div class="recent-label" aria-level="2" role="heading">
          {{ itemName }} Trading History
        </div>
        
        <!-- Loading State -->
        <div v-if="isLoading" class="loading-container" role="status" aria-live="polite">
          <div class="loading-spinner"></div>
          <div class="loading-message">Loading trading history...</div>
        </div>
        
        <!-- Empty State -->
        <div v-else-if="tradeHistory.length === 0 && !isLoading" class="no-records" role="status">
          <div class="no-records-icon">📊</div>
          <div class="no-records-text">No trading records found for {{ itemName }}</div>
          <button @click="goToTrade" class="create-trade-btn" aria-label="Create new trade">
            Create First Trade
          </button>
        </div>
        
        <!-- Trade Records List -->
        <div v-else class="records-list" role="list">
          <div 
            v-for="(record, index) in tradeHistory" 
            :key="record.id" 
            class="record-row" 
            role="listitem"
            :aria-label="`Trade ${index + 1}: ${record.leftName} ${record.leftCount} for ${record.rightName} ${record.rightCount}`"
          >
            <div class="item-left" aria-label="Left item">
              <span class="item-name">{{ record.leftName }}</span>
              <span class="item-count">{{ record.leftCount }}</span>
            </div>
            <div class="exchange-arrow" aria-hidden="true">⇄</div>
            <div class="item-right" aria-label="Right item">
              <span class="item-name">{{ record.rightName }}</span>
              <span class="item-count">{{ record.rightCount }}</span>
            </div>
            <div v-if="record.timestamp" class="trade-timestamp" aria-label="Trade timestamp">
              {{ formatTimestamp(record.timestamp) }}
            </div>
          </div>
        </div>
      </div>
    </div>

    <BottomBar :showMenu="false" title="Item Details" currentView="detailedItem" />
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

/* Error Message Styles */
.error-message {
  background: #ff4444;
  color: white;
  padding: 1rem;
  margin: 1rem;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(255, 68, 68, 0.3);
}

.error-content {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.error-icon {
  font-size: 1.2rem;
}

.error-text {
  flex: 1;
  font-size: 0.9rem;
}

.retry-btn {
  background: rgba(255, 255, 255, 0.2);
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.3);
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.8rem;
  transition: all 0.2s ease;
  
  &:hover {
    background: rgba(255, 255, 255, 0.3);
  }
  
  &:focus {
    outline: 2px solid #FF9800;
    outline-offset: 2px;
  }
}

/* Pie Chart Container */
.pie-chart-container {
  padding: 1rem;
  display: flex;
  justify-content: center;
  align-items: center;
}

/* Loading Styles */
.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem 2rem;
  color: #ccc;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 3px solid #333;
  border-top: 3px solid #FF9800;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 1rem;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.loading-message {
  font-size: 0.9rem;
  font-style: italic;
}

/* No Records Styles */
.no-records {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem 2rem;
  text-align: center;
  color: #ccc;
}

.no-records-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
  opacity: 0.7;
}

.no-records-text {
  font-size: 1rem;
  margin-bottom: 1.5rem;
  line-height: 1.4;
}

.create-trade-btn {
  background: #FF9800;
  color: #222;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 6px;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background: #ffb74d;
    transform: translateY(-1px);
  }
  
  &:focus {
    outline: 2px solid #FF9800;
    outline-offset: 2px;
  }
  
  &:active {
    transform: translateY(0);
  }
}

/* Records List */
.records-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.record-row {
  background: #fff;
  border-radius: 8px;
  display: flex;
  align-items: center;
  padding: 12px 24px;
  font-size: 1rem;
  font-weight: 600;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  position: relative;
  
  .item-left, .item-right {
    flex: 1;
    color: #222;
    font-weight: 600;
    text-align: center;
    display: flex;
    flex-direction: column;
    align-items: center;
    
    .item-name {
      font-size: 0.9rem;
      margin-bottom: 0.2rem;
    }
    
    .item-count {
      font-size: 0.8rem;
      color: #666;
      font-weight: 500;
    }
  }
  
  .exchange-arrow {
    flex: 0 0 50px;
    text-align: center;
    color: #666;
    font-size: 1.2rem;
    font-weight: 400;
  }
  
  .trade-timestamp {
    position: absolute;
    top: 0.5rem;
    right: 0.5rem;
    font-size: 0.7rem;
    color: #999;
    font-weight: 400;
  }
}

@media (max-width: 480px) {
  .content {
    padding: 2rem 0 2rem 0;
  }
  
  .error-message {
    margin: 0.5rem;
    padding: 0.75rem;
  }
  
  .error-content {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.75rem;
  }
  
  .retry-btn {
    align-self: flex-end;
  }
  
  .pie-chart-container {
    padding: 0.5rem;
  }
  
  .pie-chart-container :deep(.item-trade-pie) {
    --pie-size: 120px;
  }
  
  .loading-container {
    padding: 2rem 1rem;
  }
  
  .no-records {
    padding: 2rem 1rem;
  }
  
  .no-records-icon {
    font-size: 2.5rem;
  }
  
  .no-records-text {
    font-size: 0.9rem;
  }
  
  .create-trade-btn {
    padding: 0.6rem 1.2rem;
    font-size: 0.85rem;
  }
}

@media (max-width: 300px) {
  .content {
    padding: 2rem 0 0.8rem 0;
  }

  .error-message {
    margin: 0.25rem;
    padding: 0.5rem;
  }
  
  .error-text {
    font-size: 0.8rem;
  }
  
  .retry-btn {
    padding: 0.4rem 0.8rem;
    font-size: 0.7rem;
  }
  
  .pie-chart-container {
    padding: 0.25rem;
  }
  
  .pie-chart-container :deep(.item-trade-pie) {
    --pie-size: 100px;
  }
  
  .loading-container {
    padding: 1.5rem 0.5rem;
  }
  
  .loading-spinner {
    width: 30px;
    height: 30px;
  }
  
  .loading-message {
    font-size: 0.8rem;
  }
  
  .no-records {
    padding: 1.5rem 0.5rem;
  }
  
  .no-records-icon {
    font-size: 2rem;
  }
  
  .no-records-text {
    font-size: 0.8rem;
  }
  
  .create-trade-btn {
    padding: 0.5rem 1rem;
    font-size: 0.8rem;
  }

  .record-row {
    padding: 8px 16px;
    font-size: 0.85rem;
    
    .item-left, .item-right {
      .item-name {
        font-size: 0.8rem;
      }
      
      .item-count {
        font-size: 0.7rem;
      }
    }
    
    .exchange-arrow {
      flex: 0 0 40px;
      font-size: 1rem;
    }
    
    .trade-timestamp {
      font-size: 0.6rem;
    }
  }
}

@media (max-width: 200px) {
  .content {
    padding: 1.33rem 0 0.53rem 0;
  }
  
  .error-message {
    margin: 0.1rem;
    padding: 0.4rem;
  }
  
  .error-text {
    font-size: 0.7rem;
  }
  
  .retry-btn {
    padding: 0.3rem 0.6rem;
    font-size: 0.6rem;
  }
  
  .pie-chart-container {
    padding: 0.1rem;
  }
  
  .pie-chart-container :deep(.item-trade-pie) {
    --pie-size: 80px;
  }
  
  .loading-container {
    padding: 1rem 0.25rem;
  }
  
  .loading-spinner {
    width: 25px;
    height: 25px;
  }
  
  .loading-message {
    font-size: 0.7rem;
  }
  
  .no-records {
    padding: 1rem 0.25rem;
  }
  
  .no-records-icon {
    font-size: 1.5rem;
  }
  
  .no-records-text {
    font-size: 0.7rem;
  }
  
  .create-trade-btn {
    padding: 0.4rem 0.8rem;
    font-size: 0.7rem;
  }

  .record-row {
    padding: 6px 12px;
    font-size: 0.7rem;
    
    .item-left, .item-right {
      .item-name {
        font-size: 0.7rem;
        min-width: 0;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      
      .item-count {
        font-size: 0.6rem;
      }
    }
    
    .exchange-arrow {
      flex: 0 0 30px;
      font-size: 0.8rem;
    }
    
    .trade-timestamp {
      font-size: 0.5rem;
    }
  }
  
  .recent-label {
    font-size: 0.5rem;
    margin: 0.3rem 0 0.2rem 0.1rem;
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
    BottomBar,
    ItemTradePie
  },
  data() {
    return {
      itemName: "",
      isLoading: false,
      error: null,
      tradeHistory: [],
      retryCount: 0,
      maxRetries: 3,
      abortController: null
    };
  },
  mounted() {
    this.initializeView();
  },
  
  beforeUnmount() {
    // Clean up any pending requests
    if (this.abortController) {
      this.abortController.abort();
    }
  },
  
  watch: {
    '$route.params.item': {
      handler(newItem) {
        this.itemName = newItem || "";
        this.retryCount = 0;
        this.fetchTradeHistory();
      },
      immediate: false
    }
  },
  methods: {
    initializeView() {
      this.itemName = this.$route.params.item || "";
      if (this.itemName) {
        this.fetchTradeHistory();
      } else {
        this.error = "No item specified";
      }
    },
    
    async fetchTradeHistory() {
      if (!this.itemName) {
        this.error = "No item specified";
        return;
      }
      
      // Cancel previous request if exists
      if (this.abortController) {
        this.abortController.abort();
      }
      
      this.abortController = new AbortController();
      this.isLoading = true;
      this.error = null;

      const params = new URLSearchParams({
        target: this.itemName
      });

      try {
        const response = await fetch(`/api/trade/trade-history?${params.toString()}`, {
          method: 'GET',
          headers: { 
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          signal: this.abortController.signal
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        if (data.trade_history && Array.isArray(data.trade_history)) {
          this.tradeHistory = data.trade_history.map((item, index) => ({
            id: item.trade_id || `trade-${index + 1}`,
            leftName: item.item_a || 'Unknown',
            leftCount: item.quantity_a || 0,
            rightName: item.item_b || 'Unknown',
            rightCount: item.quantity_b || 0,
            timestamp: item.timestamp || null
          }));
        } else {
          this.tradeHistory = [];
        }
        
        this.retryCount = 0; // Reset retry count on success
      } catch (err) {
        if (err.name === 'AbortError') {
          console.log('Request was cancelled');
          return;
        }
        
        console.error("Error fetching trade history:", err);
        this.handleFetchError(err);
      } finally {
        this.isLoading = false;
      }
    },
    
    handleFetchError(err) {
      if (this.retryCount < this.maxRetries) {
        this.retryCount++;
        this.error = `Failed to load trade history. Retrying... (${this.retryCount}/${this.maxRetries})`;
        
        // Auto retry after delay
        setTimeout(() => {
          this.fetchTradeHistory();
        }, 1000 * this.retryCount);
      } else {
        this.error = "Unable to load trade history. Please check your connection and try again.";
        this.tradeHistory = [];
      }
    },
    
    retryFetch() {
      this.retryCount = 0;
      this.error = null;
      this.fetchTradeHistory();
    },
    
    formatTimestamp(timestamp) {
      if (!timestamp) return '';
      
      try {
        const date = new Date(timestamp);
        const now = new Date();
        const diffMs = now - date;
        const diffMins = Math.floor(diffMs / (1000 * 60));
        const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
        const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
        
        if (diffMins < 1) return 'Just now';
        if (diffMins < 60) return `${diffMins}m ago`;
        if (diffHours < 24) return `${diffHours}h ago`;
        if (diffDays < 7) return `${diffDays}d ago`;
        
        return date.toLocaleDateString();
      } catch (err) {
        return 'Unknown time';
      }
    },
    
    goBack() {
      this.$router.push('/dashboard');
    },
    
    goToTrade(record = null) {
      if (!this.itemName) {
        console.warn('No item name available for trade navigation');
        return;
      }
      
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
    
  }
};
</script>