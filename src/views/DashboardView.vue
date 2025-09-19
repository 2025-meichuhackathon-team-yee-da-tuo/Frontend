<template>
  <div class="menu-bg">
    <div class="dashboard-header">
      <span class="item-title">{{ itemName }}</span>
      <div class="title-divider"></div>
    </div>
    <div class="records">
      <div
        v-for="record in records"
        :key="record.id"
        class="record-row"
      >
        <span class="item-left">{{ record.leftName }} {{ record.leftCount }}</span>
        <span class="exchange-arrow">⇄</span>
        <span class="item-right">{{ record.rightName }} {{ record.rightCount }}</span>
      </div>
    </div>
    <BottomBar
      :showMenu="true"
      :titleIcon="require('@/assets/Icons/user.svg')"
      :titleIconAlt="'user icon'"
      :titleIconClass="'user-icon'"
      @goBack="goBack"
    />
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
.dashboard-header {
  width: 90%;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 1.2rem;
}
.item-title {
  font-size: 2rem;
  font-weight: 700;
  color: #fff;
  letter-spacing: 2px;
  text-align: center;
  width: 100%;
  margin-bottom: 0.5rem;
}
.title-divider {
  width: 100%;
  height: 2px;
  background: #fff;
  opacity: 0.45;
  margin-bottom: 0.2rem;
  border-radius: 1.5px;
}

@media (max-width: 300px) {
  .menu-bg {
    font-size: 0.79rem;
    padding: 3vh 0vw 3vh 0vw;
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
  .dashboard-header { margin-bottom: 0.8rem; }
  .item-title { font-size: 1.16rem; }
  .title-divider { height: 1px; margin-bottom: 0.14rem; }
}

@media (max-width: 200px) {
  .menu-bg {
    font-size: 0.49rem;
    padding: 2vh 0vw 0vh 0vw;
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
  .dashboard-header { margin-bottom: 0.28rem; }
  .item-title { font-size: 0.58rem; margin-bottom: 0.08rem; }
  .title-divider { height: 1px; margin-bottom: 0.08rem; }
}

</style>

<script>
import BottomBar from "@/components/BottomBar.vue";
import { ref } from "vue";
import { useRoute, useRouter } from "vue-router";
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
  name: "DashboardPage",
  components: { BottomBar },
  data() {
    return {
      records: [
        { id: 1, leftName: "蘋果", leftCount: 2, rightName: "鳳梨", rightCount: 1 },
        { id: 2, leftName: "蘋果", leftCount: 1, rightName: "芒果", rightCount: 1 },
        { id: 3, leftName: "葡萄", leftCount: 3, rightName: "蘋果", rightCount: 3 },
        { id: 4, leftName: "柚子", leftCount: 1, rightName: "蘋果", rightCount: 2 },
      ],
      itemName: "", 
    };
  },
  created() {
    const route = useRoute();
    this.itemName = route.params.item || "";
  },
  methods: {
    goBack() {
      this.$router.push({ name: "select_item" });
    },
  },
};
</script>

