<template>
  <div class="menu-bg">
    <div class="search-bar">
      <span class="search-icon"></span>
      <input type="text" v-model="search" placeholder="search item..." />
    </div>
    <div class="records">
      <div
        v-for="item in filteredItems"
        :key="item.id"
        :class="['record-row', 'select-row', { 'select-active': hoverItem === item.id }]"
        @mouseenter="hoverItem = item.id"
        @mouseleave="hoverItem = null"
        @click="goDashboard(item)"
        style="cursor:pointer;"
      >
        <span class="item-name">{{ item.name }}</span>
      </div>
    </div>
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
.menu-bg {
  width: 100%;
  height: 100%;
  overflow-x: hidden;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 2rem 0.7rem 1.2rem 0.7rem;
  box-sizing: border-box;
  left: 0;
  top: 0;
  z-index: 1000;
}
.search-bar {
  display: flex;
  align-items: center;
  width: 90%;
  border-radius: 12px;
  padding: 10px 16px;
  margin-left: 0; 
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
    flex: 1 1 0%;  
    flex: 1;
    background: #fff;
    border: 0;
    border-radius: 8px;
    padding: 8px 12px;
    font-size: 1.1rem;
    outline: none;
  }
}
.records {
  width: 90%;
  margin-bottom: 25px;
}
.record-row {
  background: #fff;
  border-radius: 11px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 14px;
  padding: 12px 24px;
  font-size: 1.35rem;
  font-weight: 600;
  .item-name {
    font-weight: bold;
    color: inherit; 
    text-align: center;
  }
}
.select-row {
  color: #222;
  border: 2px solid #e0e0e0;
  transition: background 0.3s, color 0.3s, transform 0.3s, box-shadow 0.3s;
  box-shadow: 0 2px 8px #2221;
}

.select-active,
.select-row:hover {
  background: #222;
  color: #fff;
  border-color: #ddd;
  transform: scale(1.05);
  box-shadow: 0 4px 18px #2226;
}

@media (max-width: 300px) {
  .menu-bg {
    font-size: 0.79rem;
    padding: 3vh 0vw 3vh 0vw;
  }
  .search-bar {
    .search-icon {
      width: 13px;
      height: 13px;
      margin-right: 5px;
      &::before {
        width: 8px;
        height: 8px;
        border: 1px solid #fff;
        left: 1px;
        top: 2px;
      }
      &::after {
        width: 4px;
        height: 1px;
        bottom: 2.7px;
        right: 2.7px;
      }
    }
    input {
      padding: 6px 10px;
      border-radius: 4px;
      font-size: 0.68rem;
    }
  }
  .record-row {
    border-radius: 8px;
    margin-top: 9px;
    padding: 3px 12px;
    font-size: 1rem;
    .item-left, .item-right {
      flex: 1;
      color: #222;
      text-align: center;
    }
    .exchange-arrow {
      flex: 0 0 40px;
      font-size: 1rem;
      -webkit-text-stroke: 0.5px #222;
      color: #222;
      text-align: center;
    }
  }
}

@media (max-width: 200px) {
  .menu-bg {
    font-size: 0.49rem;
    padding: 0vh 0vw 0vh 0vw;
  }
  .search-bar {
    .search-icon {
      width: 7px;
      height: 7px;
      margin-right: 5px;
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
        right: -0px;
      }
    }
    input {
      padding: 4px 6px;
      border-radius: 2px;
      font-size: 0.4rem;
    }
  }
  .records {
    width: 90%;
    margin-top: -8px;
  }
  .record-row {
    border-radius: 5px;
    margin-top: 7px;
    padding: 2px 3px;
    font-size: 0.52rem;
    .item-left, .item-right {
      flex: 1;
      color: #222;
      text-align: center;
    }
    .exchange-arrow {
      flex: 0 0;
      font-size: 0.5rem;
      -webkit-text-stroke: 0.5px #222;
      color: #222;
      text-align: center;
    }
  }
}

</style>

<script>
import BottomBar from "@/components/BottomBar.vue";
import { ref } from "vue";
import { useRouter } from "vue-router";
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
      items: [
        { id: 1, name: "蘋果" },
        { id: 2, name: "香蕉" },
        { id: 3, name: "芒果" },
        { id: 4, name: "西瓜" },
        { id: 5, name: "鳳梨" },
        { id: 6, name: "柳丁" },
        { id: 7, name: "柚子" },
        { id: 8, name: "葡萄" },
        { id: 9, name: "蜜棗" },
        { id: 10, name: "百香果" }
      ]
    };
  },
  computed: {
    filteredItems() {
      if (!this.search) return this.items;
      const keyword = this.search.trim();
      return this.items.filter(
        item => item.name.includes(keyword)
      );
    }
  },
  methods: {
    goDashboard(item) {
      // this.$router.push({ name: 'user_history' });
      this.$router.push({ name: 'dashboard', params: { item: item.name } });
    }
  }
};
</script>

