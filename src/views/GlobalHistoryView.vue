<template>
  <div class="menu-bg">
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
    <BottomBar :showMenu="true" 
               :titleIcon="require('@/assets/Icons/globe.svg')" 
               :titleIconAlt="'globe icon'"
                :titleIconClass="'globe-icon'"
               @goBack="goBack"/>
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
  // margin-bottom: 16px;
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
    // 放大鏡柄
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
  margin-top: 14px;
  padding: 12px 24px;
  font-size: 1.35rem;
  font-weight: 600;
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
const login = ref({
  email: "",
  password: "",
});

function goBack() {
  router.back();
}

function onLogin() {
  console.log("Login info", login.value);
}
export default {
  name: "HistoryPage",
  components: { BottomBar },
  data() {
    return {
      search: "",
      records: [
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
      ]
    };
  },
  computed: {
    filteredRecords() {
      if (!this.search) return this.records;
      const keyword = this.search.trim();
      return this.records.filter(
        (r) =>
          `${r.leftName}${r.leftCount}`.includes(keyword) ||
          `${r.rightName}${r.rightCount}`.includes(keyword)
      );
    }
  },
};
</script>

