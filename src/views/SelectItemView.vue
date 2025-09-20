<template>
  <div class="select-bg">
    <div class="search-bar">
      <span class="search-icon"></span>
      <input ref="searchInput" type="text" v-model="search" placeholder="search item..." />
    </div>
    <div class="records">
      <div v-if="filteredItems.length >= 0" class="recent-label">Recent Record</div>
      <div v-if="isLoading" class="loading-message">Loading...</div>
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
import { ref, onMounted, onUnmounted } from "vue";
import { useRoute, useRouter } from "vue-router";
const router = useRouter();

function goBack() {
  router.back();
}

export default {
  name: "SelectItemPage",
  components: { BottomBar },
  data() {
    return {
      search: "",
      hoverItem: null,
      // 原本硬編的 items 移除，改成動態載入
      items: [],
      isLoading: false,
      _debounceTimer: null
    };
  },
  computed: {
    // 後端已經幫你做語意過濾了，這裡直接回傳目前 items
    filteredItems() {
      return this.items;
    }
  },
  watch: {
    // 監聽搜尋框輸入，做簡單 debounce 以減少請求
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
  methods: {
    async fetchFuzzyItems(keyword) {
      this.isLoading = true;

      // 參考 UserHistoryView.vue 的 GET 寫法
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

        // 合併：若沒有精確匹配，將 keyword 放最前；並做去重（以正規化後的字串為 key）
        const merged = hasExact ? data : [keyword, ...data];

        // 轉回你原本使用的 { id, name } 結構
        this.items = merged.map((name, i) => ({ id: i + 1, name }));
      } catch (err) {
        console.error("Error fetching fuzzy items:", err);
        // 即使失敗，也把輸入字放第一個，維持體驗
        this.items = keyword ? [{ id: 1, name: keyword }] : [];
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
        const searchBarHeight = 35; // 根據你的 BottomBar 高度調整
        const bottomBarHeight = 80; // 根據你的 BottomBar 高度調整
        // print elementRect.top
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
      // this.items[2] = {id: 3, name: e.key} // debug only
      if (e.key === "ArrowUp") {
        e.preventDefault();
        if (idx > 0) {
          this.$refs.rows[idx - 1].focus();
        } else {
          // focus 回 search bar
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
    }
  }
};

// 讓 searchInput 正確綁定到 input DOM
const searchInput = ref(null);

onMounted(() => {
  document.addEventListener("keydown", handleKeyDown);
});
onUnmounted(() => {
  document.removeEventListener("keydown", handleKeyDown);
});

</script>
