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

<script setup>
import { ref, computed, watch, onMounted, onUnmounted, nextTick } from "vue";
import { useRoute, useRouter } from "vue-router";
import BottomBar from "@/components/BottomBar.vue";

const route = useRoute();
const router = useRouter();

// state
const search = ref("");
const items = ref([]);
const isLoading = ref(false);
const hoverItem = ref(null);

// refs
const searchInput = ref(null);
const rows = ref([]);

// computed
const filteredItems = computed(() => items.value);

// debounce
let _debounceTimer = null;

// methods
async function fetchFuzzyItems(keyword) {
  isLoading.value = true;
  const params = new URLSearchParams({ q: keyword });
  try {
    const resp = await fetch(`/api/search/fuzzy-search?${params.toString()}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" }
    });
    const data = await resp.json();
    const norm = (s) => (s ?? "").trim().toLowerCase();
    const hasExact = data.some((name) => norm(name) === norm(keyword));
    const merged = hasExact ? data : [keyword, ...data];
    items.value = merged.map((name, i) => ({ id: i + 1, name }));
  } catch (err) {
    console.error("Error fetching fuzzy items:", err);
    items.value = keyword ? [{ id: 1, name: keyword }] : [];
  } finally {
    isLoading.value = false;
  }
}

function selectItem(item) {
  const type = route.query.type;
  const newQuery = {
    ownedItem: route.query.ownedItem || "",
    desiredItem: route.query.desiredItem || "",
  };
  if (type === "owned") newQuery.ownedItem = item.name;
  if (type === "desired") newQuery.desiredItem = item.name;
  router.push({ name: "trade", query: newQuery });
}

function scrollIntoView(e) {
  // keep same behavior as Options API version
  setTimeout(() => {
    const element = e.target;
    const elementRect = element.getBoundingClientRect();
    const viewportHeight = window.innerHeight;
    const searchBarHeight = 35;
    const bottomBarHeight = 80;
    if (elementRect.bottom > viewportHeight - bottomBarHeight) {
      element.scrollIntoView({ block: "center", behavior: "smooth" });
    } else if (elementRect.top < searchBarHeight) {
      element.scrollIntoView({ block: "center", behavior: "smooth" });
    }
  }, 0);
}

function handleRowKeydown(e, idx) {
  if (e.key === "Enter") {
    e.preventDefault();
    const item = filteredItems.value[idx];
    if (item) selectItem(item);
    return;
  }
  // typing letters/numbers should go to search input
  if (
    e.key.length === 1 &&
    !e.ctrlKey && !e.metaKey && !e.altKey
  ) {
    search.value += e.key;
    if (searchInput.value && searchInput.value.focus) {
      searchInput.value.focus();
      if (searchInput.value.setSelectionRange) {
        const len = String(search.value).length;
        searchInput.value.setSelectionRange(len, len);
      }
    }
    e.preventDefault();
    return;
  }
  if (e.key === "ArrowUp") {
    e.preventDefault();
    if (idx > 0 && rows.value?.[idx - 1]) {
      rows.value[idx - 1].focus();
    } else if (searchInput.value && searchInput.value.focus) {
      searchInput.value.focus();
    }
    return;
  }
  if (e.key === "ArrowDown") {
    e.preventDefault();
    if (idx < filteredItems.value.length - 1 && rows.value?.[idx + 1]) {
      rows.value[idx + 1].focus();
    }
    return;
  }
}

// global keydown to route typing to search when not focused
function handleKeyDown(e) {
  const isInputFocused = document.activeElement === searchInput.value;
  if (
    !isInputFocused &&
    e.key.length === 1 &&
    !e.ctrlKey && !e.metaKey && !e.altKey
  ) {
    search.value += e.key;
    if (searchInput.value && searchInput.value.focus) {
      searchInput.value.focus();
      nextTick(() => {
        if (searchInput.value?.setSelectionRange) {
          const len = String(search.value).length;
          searchInput.value.setSelectionRange(len, len);
        }
      });
    }
    e.preventDefault();
  }
}

function goBack() {
  router.back();
}

// watchers
watch(search, (newVal) => {
  if (_debounceTimer) clearTimeout(_debounceTimer);
  _debounceTimer = setTimeout(() => {
    const keyword = (newVal || "").trim();
    if (!keyword) {
      items.value = [];
      return;
    }
    fetchFuzzyItems(keyword);
  }, 1);
});

// lifecycle
onMounted(() => {
  document.addEventListener("keydown", handleKeyDown);
});
onUnmounted(() => {
  document.removeEventListener("keydown", handleKeyDown);
});
</script>
