<template>
  <div class="focus-example">
    <h2>Focus樣式示例</h2>
    
    <!-- 基礎樣式示例 -->
    <div class="example-section">
      <h3>基礎Focus樣式</h3>
      <button class="focus-primary">基礎按鈕</button>
      <input class="focus-input" placeholder="輸入框" />
      <a href="#" class="focus-link">鏈接</a>
    </div>
    
    <!-- 狀態樣式示例 -->
    <div class="example-section">
      <h3>狀態Focus樣式</h3>
      <button class="focus-success">成功按鈕</button>
      <button class="focus-warning">警告按鈕</button>
      <button class="focus-error">錯誤按鈕</button>
      <button class="focus-disabled" disabled>禁用按鈕</button>
    </div>
    
    <!-- 特殊效果示例 -->
    <div class="example-section">
      <h3>特殊效果</h3>
      <button class="focus-glow">發光效果</button>
      <button class="focus-none">無Focus樣式</button>
    </div>
    
    <!-- 自定義顏色示例 -->
    <div class="example-section">
      <h3>自定義顏色</h3>
      <button 
        class="focus-custom" 
        style="--focus-color: #E91E63; --focus-width: 5px; --focus-offset: 4px;"
      >
        自定義粉色
      </button>
      <button 
        class="focus-custom" 
        style="--focus-color: #673AB7; --focus-width: 4px; --focus-offset: 3px;"
      >
        自定義紫色
      </button>
    </div>
  </div>
</template>

<script setup>
// 這個組件展示各種focus樣式的使用
</script>

<style scoped>
.focus-example {
  padding: 2rem;
  background: #f5f5f5;
  min-height: 100vh;
}

.example-section {
  margin-bottom: 2rem;
  padding: 1rem;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.example-section h3 {
  margin-top: 0;
  color: #333;
  border-bottom: 2px solid #eee;
  padding-bottom: 0.5rem;
}

button, input, a {
  margin: 0.5rem;
  padding: 0.75rem 1.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  background: white;
  cursor: pointer;
  text-decoration: none;
  display: inline-block;
  color: #333;
}

input {
  cursor: text;
}

a {
  color: #2196F3;
}

button:hover, a:hover {
  background: #f0f0f0;
}

button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
</style>
