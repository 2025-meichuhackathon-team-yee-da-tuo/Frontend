<template>
  <router-view />
</template>

<style>
html, body, #app {
  width: 100vw;
  height: 100vh;
  margin: 0;
  padding: 0;
  background: #222;
  box-sizing: border-box;
}

/* 全局Focus Outline樣式自定義 - 統一所有元素 */
*:focus {
  outline: 3px solid #FF9800 !important; /* 橘色邊框，寬度3px */
  outline-offset: 2px; /* 邊框與元素的間距 */
  box-shadow: 0 0 0 1px rgba(255, 152, 0, 0.3) !important; /* 額外的陰影效果 */
}

/* 所有按鈕統一focus樣式 */
button:focus {
  outline: 3px solid #FF9800 !important; /* 橘色邊框，寬度3px */
  outline-offset: 2px;
  box-shadow: 0 0 0 1px rgba(255, 152, 0, 0.3) !important;
}

/* 所有輸入框統一focus樣式 */
input:focus, textarea:focus, select:focus {
  outline: 3px solid #FF9800 !important; /* 橘色邊框，寬度3px */
  outline-offset: 2px;
  box-shadow: 0 0 0 1px rgba(255, 152, 0, 0.3) !important;
}

/* 所有鏈接統一focus樣式 */
a:focus {
  outline: 3px solid #FF9800 !important; /* 橘色邊框，寬度3px */
  outline-offset: 2px;
  box-shadow: 0 0 0 1px rgba(255, 152, 0, 0.3) !important;
}

/* 禁用focus outline的類別（如果需要） */
.no-focus-outline:focus {
  outline: none !important;
  box-shadow: none !important;
}
</style>
