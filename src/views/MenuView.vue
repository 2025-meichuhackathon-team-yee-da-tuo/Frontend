<template>
  <div class="menu-bg">
    <div class="menu-content">
      <div class="menu-title">Menu</div>
      <ul class="menu-list">
        <li
          v-for="item in menuItems"
          :key="item.label"
          class="menu-list-item"
          :class="{ active: item.to && activeMenu === item.to.name }"
        >
          <button class="menu-btn" @click="handleMenuClick(item)">
            {{ item.label }}
          </button>
        </li>
      </ul>
    </div>
    <BottomBar :showMenu="false" title="Menu" />
  </div>
</template>

<script setup>
import BottomBar from "@/components/BottomBar.vue";
import { useRoute, useRouter } from "vue-router";
import { computed, ref, onMounted, nextTick } from "vue";
import { useUserStore } from "@/stores/user";
import { useNavigationStore } from "@/stores/navigation";

const router = useRouter();
const route = useRoute();
const userStore = useUserStore();
const navigationStore = useNavigationStore();

const activeMenu = ref("");

onMounted(() => {
  activeMenu.value = route.query.view || "";
});

const menuMap = {
  register: [
    { label: "Register", to: { name: "register" } },
    { label: "Login", to: { name: "login" } },
    { label: "Trade", to: { name: "trade" } },
    { label: "Dashboard", to: { name: "dashboard" } },
    { label: "Logout", action: "logout" },
    { label: "History", to: { name: "user_history" } },
    { label: "Global History", to: { name: "global_history" } },
  ],
  login: [
    { label: "Login", to: { name: "login" } },
    { label: "Register", to: { name: "register" } },
    { label: "Trade", to: { name: "trade" } },
  ],
  trade: [
    { label: "Trade", to: { name: "trade" } },
    { label: "History", to: { name: "user_history" } },
    { label: "Dashboard", to: { name: "dashboard" } },
    { label: "Logout", action: "logout" },
  ],
  user_history: [
    {label: "User", to: {name: "user_history"}},
    {label: "Global", to: {name: "global_history"}},
    {label: "Trade", to: {name: "trade"}},
    { label: "Logout", action: "logout" },
  ],
  global_history: [
    {label: "Global", to: {name: "global_history"}},
    {label: "User", to: {name: "user_history"}},
    {label: "Trade", to: {name: "trade"}},
    { label: "Logout", action: "logout" },
  ],
  dashboard: [
    { label: "Dashboard", to: { name: "dashboard" } },
    { label: "Trade", to: { name: "trade" } },
    { label: "History", to: { name: "user_history" } },
    { label: "Logout", action: "logout" },
  ],
  detailedItem: [
    { label: "Dashboard", to: { name: "dashboard" } },
    { label: "Trade", to: { name: "trade" } },
    { label: "History", to: { name: "user_history" } },
    { label: "Logout", action: "logout" },
  ],
};

const menuItems = computed(() => menuMap[route.query.view] || []);

function handleMenuClick(item) {
  if (item.action === "logout") {
    handleLogout();
  } else if (item.to) {
    activeMenu.value = item.to.name || "";
    router.replace(item.to);
  }
}

async function handleLogout() {
  try {
    userStore.logout();
    
    await nextTick();
    
    await router.replace({ name: "login" });
  } catch (error) {    
    window.location.href = '/login';
  }
}
</script>



<style scoped>
.menu-bg {
  width: 100vw;
  min-height: 100vh;
  background: #222;
  color: #fff;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
}

.menu-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 2rem 0.7rem 1.2rem 0.7rem;
  box-sizing: border-box;
}

.menu-title {
  font-size: 2rem;
  font-weight: bold;
  margin-bottom: 1rem;
}

.menu-list {
  list-style: none;
  width: 100%;
  padding: 0;
  margin: 0;
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  gap: 0.2rem;
}

.menu-list-item {
  display: flex;
  align-items: center;
  justify-content: center;
}

.menu-btn {
  width: 90%;
  padding: 0.7rem;
  border-radius: 0.8rem;
  background: #19191b;
  font-size: 1.25rem;
  color: #fff;
  border: 2px solid transparent;
  text-align: center;
  cursor: pointer;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  text-decoration: none;
  transition: all 0.2s ease;
  
  &:focus {
    outline: 3px solid #FF9800 !important; /* 橙色邊框，與圖片中的效果一致 */
    outline-offset: 2px; /* 邊框與按鈕的間距 */
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1), 0 0 0 1px rgba(255, 152, 0, 0.3) !important; /* 保持原有陰影並添加focus效果 */
  }
  
  &:hover {
    background: #2a2a2d;
  }
  
  &:hover:focus {
    background: #2a2a2d; /* hover + focus 時保持hover的背景色 */
  }
}

.menu-list-item.active .menu-btn,
.menu-btn:active {
  background: #333;
  color: #fff;
}

.menu-list-item.active .menu-btn:focus {
  outline: 3px solid #FF9800 !important; /* 保持一致的橙色focus樣式 */
  outline-offset: 2px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1), 0 0 0 1px rgba(255, 152, 0, 0.3) !important;
}

.menu-close-btn {
  width: 70%;
  margin-top: 2.5rem;
  border-radius: 0.8rem;
  font-size: 1.1rem;
  padding: 0.4rem 0;
  background: #39394a;
  color: #fff;
  border: 2px solid transparent;
  cursor: pointer;
  opacity: 0.82;
  transition: all 0.2s ease;
  
  &:focus {
    outline: 3px solid #FF9800 !important; /* 與其他按鈕保持一致的focus樣式 */
    outline-offset: 2px;
    box-shadow: 0 0 0 1px rgba(255, 152, 0, 0.3) !important;
    opacity: 1;
  }
  
  &:hover {
    opacity: 1;
  }
  
  &:hover:focus {
    opacity: 1;
  }
}


@media (max-width: 300px) {
  .menu-content {
    padding: 1.2rem 0.4rem 0.8rem 0.4rem;
  }
  
  .menu-title {
    font-size: 1.5rem;
  }
  
  .menu-btn {
    font-size: 1rem;
    padding: 0.5rem;
  }
  
  .menu-btn:focus {
    outline-width: 2px !important; /* 小屏幕上使用較細的邊框 */
    outline-offset: 1px;
  }
}

@media (max-width: 200px) {
  .menu-content {
    padding: 1.1rem 0.2rem 0.8rem 0.2rem;
  }
  
  .menu-title {
    font-size: 1.45rem;
  }
  
  .menu-btn {
    font-size: 1rem;
  }
  
  .menu-btn:focus {
    outline-width: 2px !important; /* 超小屏幕上也使用較細的邊框 */
    outline-offset: 1px;
  }
}
</style>