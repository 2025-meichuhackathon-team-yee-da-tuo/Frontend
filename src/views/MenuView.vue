<template>
  <div class="menu-bg">
    <div class="menu-content">
      <div class="menu-title">Menu</div>
      <ul class="menu-list">
        <li
          v-for="item in menuItems"
          :key="item.label"
          class="menu-list-item"
          :class="{ active: activeMenu === item.to.name }"
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
import { computed, ref, onMounted } from "vue";

const router = useRouter();
const route = useRoute();

const activeMenu = ref("");

onMounted(() => {
  activeMenu.value = route.query.view || "";
});

const menuMap = {
  register: [
    { label: "Register", to: { name: "register" } },
    { label: "Login", to: { name: "login" } },
    { label: "Guide", to: { name: "guide" } },
  ],
  login: [
    { label: "Login", to: { name: "login" } },
    { label: "Register", to: { name: "register" } },
    { label: "Guide", to: { name: "guide" } },
  ],
  trade: [
    { label: "Trade", to: { name: "trade" } },
    { label: "Guide", to: { name: "guide" } },
  ],

};

const menuItems = computed(() => menuMap[route.query.view] || []);

function handleMenuClick(item) {
  activeMenu.value = item.to.name;
  if (item.to) router.push(item.to);
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
  border: none;
  text-align: center;
  cursor: pointer;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  text-decoration: none;
  transition: background-color 0.2s ease;
  
  &:hover {
    background: #2a2a2d;
  }
}

.menu-list-item.active .menu-btn,
.menu-btn:active {
  background: #333;
  color: #fff;
}

.menu-close-btn {
  width: 70%;
  margin-top: 2.5rem;
  border-radius: 0.8rem;
  font-size: 1.1rem;
  padding: 0.4rem 0;
  background: #39394a;
  color: #fff;
  border: none;
  cursor: pointer;
  opacity: 0.82;
  transition: opacity 0.2s;
  
  &:hover {
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
}
</style>
