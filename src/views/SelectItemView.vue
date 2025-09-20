<template>
  <div class="select-bg">
    <div class="search-bar">
      <span class="search-icon"></span>
      <input ref="searchInput" type="text" v-model="search" placeholder="search item..." />
    </div>
    <div class="records">
      <div v-if="isLoading" class="loading-message">Loading...</div>
      <div v-else
        v-for="item in filteredItems"
        :key="item.id"
        class="record-row"
        tabindex="0"
        ref="rows"
        @focus="scrollIntoView($event)"
        @click="selectItem(item)"
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
      }, 150);
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

        if (resp.ok && Array.isArray(data)) {
          // API 回傳的是字串陣列 → 轉成 { id, name } 給前端用
          this.items = data.map((name, idx) => ({ id: idx + 1, name }));
        } else {
          console.error("Failed to fetch fuzzy items:", data);
          this.items = [];
        }
      } catch (err) {
        console.error("Error fetching fuzzy items:", err);
        this.items = [];
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
    }
  }
};
const search = ref("");
const searchInput = ref(null);

function handleKeyDown(e) {
  const keys = ['0','1','2','3','4','5','6','7','8','9','*','#'];
  const tag = document.activeElement.tagName.toLowerCase();
  // 如果不是在 input/textarea 並且按的是目標鍵
  if (keys.includes(e.key) && tag !== 'input' && tag !== 'textarea') {
    if (searchInput.value) {
      searchInput.value.focus();
      search.value += e.key; // 寫入 value
      e.preventDefault();    // 防止原本行為
    }
  }
}

onMounted(() => {
  document.addEventListener('keydown', handleKeyDown);
});
onUnmounted(() => {
  document.removeEventListener('keydown', handleKeyDown);
});

</script>
