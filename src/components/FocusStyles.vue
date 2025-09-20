<template>
  <!-- 這是一個純樣式組件，不需要模板內容 -->
</template>

<script setup>
// 這個組件只提供樣式，不需要JavaScript邏輯
</script>

<style scoped>
/* 可重用的Focus樣式類別 - 統一規格 */

/* 基礎Focus樣式 */
.focus-primary {
  transition: all 0.2s ease;
}

.focus-primary:focus {
  outline: 3px solid #FF9800 !important;
  outline-offset: 2px;
  box-shadow: 0 0 0 1px rgba(255, 152, 0, 0.3) !important;
}

/* 按鈕Focus樣式 */
.focus-button {
  transition: all 0.2s ease;
}

.focus-button:focus {
  outline: 3px solid #FF9800 !important;
  outline-offset: 2px;
  box-shadow: 0 0 0 1px rgba(255, 152, 0, 0.3) !important;
}

/* 輸入框Focus樣式 */
.focus-input {
  transition: all 0.2s ease;
}

.focus-input:focus {
  outline: 3px solid #FF9800 !important;
  outline-offset: 2px;
  box-shadow: 0 0 0 1px rgba(255, 152, 0, 0.3) !important;
}

/* 鏈接Focus樣式 */
.focus-link {
  transition: all 0.2s ease;
}

.focus-link:focus {
  outline: 3px solid #FF9800 !important;
  outline-offset: 2px;
  box-shadow: 0 0 0 1px rgba(255, 152, 0, 0.3) !important;
}

/* 發光效果Focus樣式 */
.focus-glow {
  transition: all 0.2s ease;
}

.focus-glow:focus {
  outline: 3px solid #FF9800 !important;
  outline-offset: 2px;
  box-shadow: 0 0 0 1px rgba(255, 152, 0, 0.3) !important;
}

/* 錯誤狀態Focus樣式 */
.focus-error {
  transition: all 0.2s ease;
}

.focus-error:focus {
  outline: 3px solid #FF9800 !important;
  outline-offset: 2px;
  box-shadow: 0 0 0 1px rgba(255, 152, 0, 0.3) !important;
}

/* 成功狀態Focus樣式 */
.focus-success {
  transition: all 0.2s ease;
}

.focus-success:focus {
  outline: 3px solid #FF9800 !important;
  outline-offset: 2px;
  box-shadow: 0 0 0 1px rgba(255, 152, 0, 0.3) !important;
}

/* 警告狀態Focus樣式 */
.focus-warning {
  transition: all 0.2s ease;
}

.focus-warning:focus {
  outline: 3px solid #FF9800 !important;
  outline-offset: 2px;
  box-shadow: 0 0 0 1px rgba(255, 152, 0, 0.3) !important;
}

/* 禁用Focus樣式 */
.focus-disabled:focus {
  outline: 3px solid #666 !important;
  outline-offset: 2px;
  box-shadow: 0 0 0 1px rgba(102, 102, 102, 0.3) !important;
}

/* 無Focus樣式 */
.focus-none:focus {
  outline: none !important;
  box-shadow: none !important;
}

/* 自定義顏色Focus樣式 - 可以通過CSS變量來控制 */
.focus-custom {
  transition: all 0.2s ease;
  --focus-color: #FF9800;
  --focus-width: 3px;
  --focus-offset: 2px;
  --focus-shadow-opacity: 0.3;
}

.focus-custom:focus {
  outline: var(--focus-width) solid var(--focus-color) !important;
  outline-offset: var(--focus-offset);
  box-shadow: 0 0 0 1px rgba(from var(--focus-color) r g b / var(--focus-shadow-opacity)) !important;
}
</style>