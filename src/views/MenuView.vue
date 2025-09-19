<template>
  <div class="menu-bg">
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
    <div class="btm-bar">
      <span class="btm-bar-btn" aria-label="back" @click="goBack">
        <img src="@/assets/Icons/back-arrow.svg" alt="back to previous page" />
      </span>
    </div>
  </div>
</template>

<script setup>
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
  ],
  login: [
    { label: "Login", to: { name: "login" } },
    { label: "Register", to: { name: "register" } },
  ],
  trade: [{ label: "Trade", to: { name: "trade" } }],
  histroy: [
    {label: "Global", to: {name: "<global_history"}},
    {label: "User", to: {name: "<user_history"}}
  ],
};

const menuItems = computed(() => menuMap[route.query.view] || []);

function handleMenuClick(item) {
  activeMenu.value = item.to.name;
  if (item.to) router.push(item.to);
}

function goBack() {
  router.back();
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
  align-items: center;
  padding: 2rem 0.7rem 1.2rem 0.7rem;
  box-sizing: border-box;
  position: fixed;
  left: 0;
  top: 0;
  z-index: 1000;
}
.menu-title {
  font-size: 2rem;
  font-weight: bold;
}
.menu-list {
  list-style: none;
  width: 100%;
  padding: 0;
  margin: 0;
}
.menu-list-item {
  margin-bottom: 0.2rem;
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
  box-shadow: 0 2px 12px #0001;
  text-decoration: none;
}
.menu-list-item.active .menu-btn,
.menu-btn:active {
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
}
.menu-close-btn:hover {
  opacity: 1;
}
.btm-bar {
  position: fixed;
  left: 0;
  right: 0;
  bottom: -0.2rem;
  width: 100vw;
  background: #19181a;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 -2px 16px #0004;
}
.btm-bar-btn {
  margin-left: auto;
  padding: 0.2rem 0.5rem 0rem 0.5rem;
  cursor: pointer;
}
@media (max-width: 240px) {
  .menu-bg {
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
