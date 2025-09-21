<template>
  <div class="select-bg">
    <div class="search-bar">
      <span class="search-icon"></span>
      <input 
        ref="searchInput" 
        type="text" 
        v-model="search" 
        placeholder="search item..." 
        @keydown="handleSearchKeydown"
      />
    </div>
    <div class="records">
      <div v-if="isLoading" class="recent-label">Loading...</div>
      <div v-else-if="error" class="error-label">
        {{ error }}
        <button @click="retryFetch" class="retry-btn">Retry</button>
      </div>
      <div v-else-if="filteredItems.length === 0" class="recent-label">No items found</div>
      <div v-else class="recent-label">
        {{ search.trim() ? 'Search Results' : 'Popular Trading Items' }}
      </div>
      <div
        v-for="(item, idx) in filteredItems"
        :key="item.id"
        class="record-row"
        tabindex="0"
        ref="rows"
        @focus="scrollIntoView($event)"
        @click="selectItem(item)"
        @keydown="handleRowKeydown($event, idx)"
        style="cursor:pointer;"
      >
        <div class="item-info">
          <span class="item-name">{{ item.name }}</span>
        </div>
      </div>
    </div>
    <BottomBar :showMenu="true" title="Dashboard" currentView="dashboard" />
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

.error-label {
  color: #ff4444;
  font-size: 0.62rem;
  font-weight: 400;
  margin: 0.5rem 0 0.3rem 0.2rem;
  letter-spacing: 1px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.retry-btn {
  background: #ff4444;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 4px 8px;
  font-size: 0.6rem;
  cursor: pointer;
  transition: background 0.2s ease;
  
  &:hover {
    background: #ff6666;
  }
  
  &:focus {
    outline: 2px solid #FF9800;
    outline-offset: 1px;
  }
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
  justify-content: space-between;
  margin-bottom: 12px;
  padding: 12px 16px;
  font-size: 1rem;
  font-weight: 600;
  transition: all 0.2s ease;
  
  &:focus {
    outline: 3px solid #FF9800 !important;
    outline-offset: 2px;
    box-shadow: 0 0 0 1px rgba(255, 152, 0, 0.3) !important;
  }
  
  &:hover {
    background: #f5f5f5;
  }
  
  .item-info {
    display: flex;
    flex-direction: column;
    align-items: center;  
    gap: 4px;
    flex: 1;
  }
  
  .item-name {
    font-size: 1rem;
    font-weight: 600;
    color: #222;
  }
}

@media (max-width: 300px) {
  .record-row {
    padding: 8px 12px;
    font-size: 0.85rem;
    
    .item-name {
      font-size: 0.85rem;
    }
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
    
    .item-name {
      font-size: 0.7rem;
    }
  }
  
  .recent-label {
    font-size: 0.5rem;
    margin: 0.3rem 0 0.2rem 0.1rem;
  }
}
</style>

<script>
import BottomBar from "@/components/BottomBar.vue";

export default {
  name: "DashboardView",
  components: { BottomBar },
  props: {
    itemName: {
      type: String,
      default: null
    }
  },
  data() {
    return {
      search: "",
      items: [],
      defaultItems: [],
      isLoading: false,
      error: null,
      _debounceTimer: null
    };
  },
  computed: {
    filteredItems() {
      return this.items;
    }
  },
  watch: {
    search(newVal) {
      if (this._debounceTimer) clearTimeout(this._debounceTimer);
      this._debounceTimer = setTimeout(() => {
        const keyword = (newVal || "").trim();
        
        if (!keyword) {
          if (this.defaultItems.length > 0) {
            this.items = [...this.defaultItems];
          } else {
            this.fetchMostFrequentTrades();
          }
          return;
        }
        
        this.fetchFuzzyItems(keyword);
      }, 300);
    }
  },
  mounted() {
    if (this.itemName || this.$route.params.itemName) {
      console.log('Item detail view for:', this.itemName || this.$route.params.itemName);
      return;
    }

    this.$nextTick(() => {
      if (this.$refs.searchInput) {
        this.$refs.searchInput.focus();
      }
    });
    
    this.fetchMostFrequentTrades();
  },
  beforeDestroy() {
    if (this._debounceTimer) {
      clearTimeout(this._debounceTimer);
    }
  },
  methods: {
    async fetchMostFrequentTrades() {
      this.isLoading = true;
      this.error = null;

      try {
        const response = await fetch('/api/trade/most-freq-trade?limit=-1', {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' }
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        if (data && data.trade_items && Array.isArray(data.trade_items)) {
          const sortedItems = data.trade_items
            .filter(item => item.count > 0) 
            .sort((a, b) => (b.count || 0) - (a.count || 0))
            .map((item, idx) => ({
              id: idx + 1,
              name: item.item,
              count: item.count,
              rate_statistics: item.rate_statistics
            }));
          
          this.items = [...sortedItems];
          this.defaultItems = [...sortedItems]; 
        } else {
          console.error("Invalid data structure received:", data);
          this.error = "Invalid data received from server";
          this.items = [];
          this.defaultItems = [];
        }
      } catch (err) {
        console.error("Error fetching most frequent trades:", err);
        
        if (err.name === 'TypeError' && err.message.includes('fetch')) {
          this.error = "Network error - check connection";
        } else if (err.message.includes('HTTP error')) {
          this.error = `Server error: ${err.message}`;
        } else {
          this.error = "Failed to load items";
        }
        
        this.items = [];
        this.defaultItems = [];
      } finally {
        this.isLoading = false;
      }
    },

    async fetchFuzzyItems(keyword) {
      this.isLoading = true;
      this.error = null;

      const params = new URLSearchParams({
        q: keyword
      });

      try {
        const response = await fetch(`/api/search/fuzzy-search?${params.toString()}`, {
          method: "GET",
          headers: { "Content-Type": "application/json" }
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        if (Array.isArray(data)) {
          this.items = data.map((name, idx) => ({ 
            id: idx + 1, 
            name: name,
            count: null 
          }));
        } else {
          console.error("Invalid search results:", data);
          this.items = [];
        }
      } catch (err) {
        console.error("Error fetching fuzzy search results:", err);
        this.error = "Search failed - please try again";
        this.items = [];
      } finally {
        this.isLoading = false;
      }
    },

    retryFetch() {
      if (this.search.trim()) {
        this.fetchFuzzyItems(this.search.trim());
      } else {
        this.fetchMostFrequentTrades();
      }
    },

    selectItem(item) {
      this.$router.push(`/dashboard/${encodeURIComponent(item.name)}`);
    },

    scrollIntoView(e) {
      setTimeout(() => {
        const element = e.target;
        const elementRect = element.getBoundingClientRect();
        const viewportHeight = window.innerHeight;
        const searchBarHeight = 80;
        const bottomBarHeight = 80;
        
        if (elementRect.bottom > viewportHeight - bottomBarHeight) {
          element.scrollIntoView({ 
            block: 'center', 
            behavior: 'smooth' 
          });
        } else if (elementRect.top < searchBarHeight) {
          element.scrollIntoView({ 
            block: 'center', 
            behavior: 'smooth' 
          });
        }
      }, 50);
    },

    handleSearchKeydown(e) {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        if (this.$refs.rows && this.$refs.rows[0]) {
          this.$refs.rows[0].focus();
        }
      }
      
      if (e.key === "Escape") {
        e.preventDefault();
        this.search = "";
        if (this.$refs.searchInput) {
          this.$refs.searchInput.blur();
        }
      }
    },

    handleRowKeydown(e, idx) {
      const keys = [
        "0","1","2","3","4","5","6","7","8","9","*","#",
        ..."abcdefghijklmnopqrstuvwxyz",
        ..."ABCDEFGHIJKLMNOPQRSTUVWXYZ",
        " "
      ];

      if (keys.includes(e.key)) {
        if (this.$refs.searchInput) {
          if (document.activeElement !== this.$refs.searchInput) {
            this.search = e.key;
          } else {
            this.search += e.key;
          }
          this.$refs.searchInput.focus();
          this.$nextTick(() => {
            const inputEl = this.$refs.searchInput;
            if (inputEl.setSelectionRange) {
              inputEl.setSelectionRange(this.search.length, this.search.length);
            }
          });
          e.preventDefault();
        }
      }

      if (e.key === "ArrowUp") {
        e.preventDefault();
        if (idx > 0) {
          this.$refs.rows[idx - 1].focus();
        } else {
          if (this.$refs.searchInput) {
            this.$refs.searchInput.focus();
          }
        }
      }

      if (e.key === "ArrowDown") {
        e.preventDefault();
        if (idx < this.filteredItems.length - 1) {
          this.$refs.rows[idx + 1].focus();
        }
      }

      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        this.selectItem(this.filteredItems[idx]);
      }

      if (e.key === "Backspace" || e.key === "Delete") {
        e.preventDefault();
        this.search = this.search.slice(0, -1);
        if (this.$refs.searchInput) {
          this.$refs.searchInput.focus();
        }
      }

      if (e.key === "Escape") {
        e.preventDefault();
        this.search = "";
        if (this.$refs.searchInput) {
          this.$refs.searchInput.focus();
        }
      }
    },
    goItemDetail(name) {
      if (!name) return
      this.$router.push({ name: 'item_detail', params: { name } })
    },
  }
};
</script>
