<template>
  <div class="btm-bar">
    <router-link
      v-if="showMenu"
      :to="{ name: 'menu', query: { view: 'register' } }"
      class="btm-bar-btn"
      aria-label="page selection"
    >
      <img src="@/assets/Icons/hamburger-bar.svg" alt="page selection" />
    </router-link>

    <div class="btm-bar-header">
      <img v-if="titleIcon" :src="titleIcon" :alt="titleIconAlt" :class="titleIconClass"/>
      <slot v-else>{{ title }}</slot>
    </div>

    <span class="btm-bar-btn" aria-label="back" @click="$emit('goBack')">
      <img src="@/assets/Icons/back-arrow.svg" alt="back to previous page" />
    </span>
  </div>
</template>

<script>
export default {
  props: {
    showMenu: { type: Boolean, default: true },
    title:    { type: String, default: "" },
    titleIcon: { type: String, default: "" },
    titleIconAlt: { type: String, default: "" },
    titleIconClass: { type: String, default: "" }
  },
};
</script>

<style scoped>
.btm-bar {
  position: fixed;
  left: 0;
  right: 0;
  height: 30px;  
  bottom: -0.2rem;
  width: 100%;
  background: #19181a;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 -2px 16px #0004;
  z-index: 100;
}
.btm-bar-btn {
  cursor: pointer;
  padding: 0.2rem 0.5rem 0rem 0.5rem;
}
.btm-bar-header {
  flex: 1;
  text-align: center;
  font-weight: bold;
  font-size: 1.2rem;
  color: #fff;
}
.user-icon {
  width: 24px;
  height: 24px;
  object-fit: contain;
  display: block;
  margin: 0 auto;
  transform: translate(4px); 
}
</style>
