// 
<template>
  <div class="select-bg">
    <div class="search-bar">
      <span class="search-icon"></span>
      <input ref="searchInput" type="text" v-model="search" placeholder="search item..." />
    </div>
    <div class="records">
      <div v-if="filteredItems.length >= 0" class="recent-label">
        {{ (search || '').trim() ? 'Search Results' : 'Recent Items' }}
      </div>
      <div v-if="isLoading" class="loading-message">Loading...</div>
      <div v-else-if="filteredItems.length === 0 && !(search || '').trim()" class="no-items-message">
        No recent items found
      </div>
      <div v-else
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
        <span class="item-name">{{ item.name }}</span>
      </div>
    </div>
    <BottomBar :showMenu="false" title="Select Item" currentView="select_item" />
  </div>
</template>

<style lang="scss" scoped>
.fixed-lightbulb {
  position: fixed;
  top: 5vw;
  left: 5vw;
  font-size: 6vw;
  pointer-events: none;
}
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
  }
}
.recent-label {
  color: #bbb;
  font-size: 0.62rem;
  font-weight: 400;
  margin: 0.5rem 0 0.3rem 0.2rem;
  letter-spacing: 1px;
}

.loading-message, .no-items-message {
  color: #888;
  font-size: 0.9rem;
  text-align: center;
  padding: 2rem 1rem;
  font-style: italic;
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
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 12px;
  padding: 3px 12px;
  font-size: 1rem;
  font-weight: 600;
  transition: all 0.2s ease;
  
  &:focus {
    outline: 3px solid #FF9800 !important; 
    outline-offset: 2px; 
    box-shadow: 0 0 0 1px rgba(255, 152, 0, 0.3) !important;
  }
}


@media (max-width: 200px) {
  .select-bg {
    font-size: 0.49rem;
    padding: 0vh 0vw 0vh 0vw;
  }
  .search-bar {
    padding: 0.5rem 0.7rem 0.5rem 0.7rem;
    border-radius: 6px;
    .search-icon {
      width: 7px;
      height: 7px;
      &::before {
        width: 6px;
        height: 6px;
        border: 1px solid #fff;
        left: 0px;
        top: 0px;
      }
      &::after {
        width: 3.5px;
        height: 1px;
        bottom: 0.5px;
        right: 0px;
      }
    }
    input {
      padding: 4px 6px;
      border-radius: 4px;
      font-size: 0.6rem;
    }
  }
  .records {
    width: 90%;
  }
  .record-row {
    border-radius: 5px;
    margin-bottom: 7px;
    padding: 2px 3px;
    font-size: 0.52rem;
  }
}

</style>

<script>
import BottomBar from "@/components/BottomBar.vue";
import { useRoute, useRouter } from "vue-router";
import { useUserStore } from "@/stores/user";

export default {
  name: "SelectItemPage",
  components: { BottomBar },
  data() {
    return {
      search: "",
      hoverItem: null,
      items: [],
      recentItems: [], 
      isLoading: false,
      _debounceTimer: null
    };
  },
  computed: {
    filteredItems() {
      const searchTerm = (this.search || "").trim();
      
      if (searchTerm) {
        return this.items;
      }
      
      return this.recentItems;
    }
  },
  watch: {
    search(newVal) {
      if (this._debounceTimer) clearTimeout(this._debounceTimer);
      this._debounceTimer = setTimeout(() => {
        const keyword = (newVal || "").trim();
        if (!keyword) {
          this.items = [];
          return;
        }
        this.fetchFuzzyItems(keyword);
      }, 1);
    }
  },
  mounted() {
    this.$nextTick(() => {
      if (this.$refs.searchInput) {
        this.$refs.searchInput.focus();
      }
    });
    
    this.fetchRecentItems();
  },
  unmounted() {
    if (this._debounceTimer) {
      clearTimeout(this._debounceTimer);
    }
  },
  methods: {
    async fetchRecentItems() {
      try {
        const userStore = useUserStore();
        userStore.restoreUser();
        const userEmail = userStore.email;
        
        if (!userEmail) {
          console.error("No user email found");
          this.recentItems = [];
          return;
        }
        
        const params = new URLSearchParams({
          user: userEmail,
          limit: -1 
        });

        const resp = await fetch(`/api/trade/recent-items?${params.toString()}`, {
          method: "GET",
          headers: { "Content-Type": "application/json" }
        });
        
        if (resp.ok) {
          const data = await resp.json();
          console.log('Recent items API response:', data);
          
          if (data.recent_items && Array.isArray(data.recent_items)) {
            this.recentItems = data.recent_items.map((itemObj, i) => ({ 
              id: `recent_${i + 1}`, 
              name: itemObj.item 
            }));
          } else {
            this.recentItems = [];
          }
        } else {
          console.error("Failed to fetch recent items:", resp.status);
          this.recentItems = [];
        }
      } catch (err) {
        console.error("Error fetching recent items:", err);
        this.recentItems = [];
      }
    },

    async fetchFuzzyItems(keyword) {
      this.isLoading = true;

      const params = new URLSearchParams({
        q: keyword
      });

      try {
        const resp = await fetch(`/api/search/fuzzy-search?${params.toString()}`, {
          method: "GET",
          headers: { "Content-Type": "application/json" }
        });
        const data = await resp.json();
        const norm = s => (s ?? "").trim().toLowerCase();
        const hasExact = data.some(name => norm(name) === norm(keyword));

        const merged = hasExact ? data : [keyword, ...data];

        this.items = merged.map((name, i) => ({ id: `search_${i + 1}`, name }));
      } catch (err) {
        console.error("Error fetching fuzzy items:", err);
        this.items = keyword ? [{ id: 'search_1', name: keyword }] : [];
      } finally {
        this.isLoading = false;
      }
    },

    selectItem(item) {
      const type = this.$route.query.type
      let newQuery = {
        ownedItem: this.$route.query.ownedItem || "",
        desiredItem: this.$route.query.desiredItem || "",
      }
      if (type === 'owned') newQuery.ownedItem = item.name
      if (type === 'desired') newQuery.desiredItem = item.name

      this.$router.push({ name: 'trade', query: newQuery })
    },
    scrollIntoView(e) {
      setTimeout(() => {
        const element = e.target;
        const elementRect = element.getBoundingClientRect();
        const viewportHeight = window.innerHeight;
        const searchBarHeight = 35;
        const bottomBarHeight = 80;
        console.log('elementRect.top:', elementRect.top);
        console.log('searchBarHeight:', searchBarHeight);
        if (elementRect.bottom > viewportHeight - bottomBarHeight) {
          element.scrollIntoView({ 
            block: 'center', 
            behavior: 'smooth' 
          });
        }
        else if (elementRect.top < searchBarHeight) {
          element.scrollIntoView({ 
            block: 'center', 
            behavior: 'smooth' 
          });
        }
      }, 25);
    },
    handleRowKeydown(e, idx) {
      const keys = [
        "0","1","2","3","4","5","6","7","8","9","*","#",
        ..."abcdefghijklmnopqrstuvwxyz",
        ..."ABCDEFGHIJKLMNOPQRSTUVWXYZ"
      ];
      if (keys.includes(e.key)) {
        if (this.$refs.searchInput && this.$refs.searchInput.focus) {
          if (document.activeElement == this.$refs.searchInput)
            this.search += e.key;
          this.$refs.searchInput.focus();
          const inputEl = this.$refs.searchInput;
          if (inputEl.setSelectionRange) {
            inputEl.setSelectionRange(this.search.length, this.search.length);
          }
          e.preventDefault();
        }
      }
      if (e.key === "ArrowUp") {
        e.preventDefault();
        if (idx > 0) {
          this.$refs.rows[idx - 1].focus();
        } else {
          if (this.$refs.searchInput && this.$refs.searchInput.focus) {
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
    },
  }
};
</script>