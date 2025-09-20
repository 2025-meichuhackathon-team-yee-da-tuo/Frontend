# GuideTemplate 使用教學

## 概述

`GuideTemplate` 是一個通用的指南組件模板，用於創建圖片輪播指南頁面。它提供了完整的鍵盤導航、圖片切換、和響應式布局功能。

## 功能特色

- ✅ **圖片輪播**：支持多張圖片切換
- ✅ **鍵盤導航**：左右方向鍵、上下方向鍵、ESC 鍵
- ✅ **滑鼠操作**：右鍵切換圖片，點擊空白處關閉
- ✅ **循環模式**：可選擇是否循環播放
- ✅ **邊界限制**：可選擇在第一頁/最後一頁停止切換
- ✅ **事件回調**：提供關閉和圖片切換事件
- ✅ **響應式設計**：適配各種屏幕尺寸
- ✅ **BottomBar 整合**：內建底部導航欄

## 基本使用

### 1. 創建指南頁面

```vue
<template>
  <GuideTemplate
    :images="myGuideImages"
    title="我的指南"
    currentView="my-guide"
    :loop="false"
    @close="handleClose"
    @imageChange="handleImageChange"
  />
</template>

<script setup>
import GuideTemplate from '@/components/GuideTemplate.vue'

// 導入圖片
import image1 from '@/assets/Guide/my-guide/step1.png'
import image2 from '@/assets/Guide/my-guide/step2.png'
import image3 from '@/assets/Guide/my-guide/step3.png'

// 定義圖片數組
const myGuideImages = [
  image1,
  image2,
  image3
]

// 處理關閉事件
function handleClose() {
  console.log('Guide closed')
}

// 處理圖片切換事件
function handleImageChange(data) {
  console.log(`Image changed to ${data.index + 1}/${data.total}`)
}
</script>
```

### 2. 在路由中使用

```javascript
// router/index.js
import MyGuideView from '@/views/MyGuideView.vue'

const routes = [
  {
    path: '/my-guide',
    name: 'my-guide',
    component: MyGuideView,
  }
]
```

### 3. 從其他頁面跳轉

```vue
<!-- 在其他組件中 -->
<template>
  <button @click="goToGuide">查看指南</button>
</template>

<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

function goToGuide() {
  router.push({ name: 'my-guide' })
}
</script>
```

## Props 詳細說明

| 屬性 | 類型 | 必填 | 默認值 | 說明 |
|------|------|------|--------|------|
| `images` | Array | ✅ | - | 圖片路徑數組 |
| `title` | String | ❌ | 'Guide' | 指南標題（顯示在 BottomBar） |
| `currentView` | String | ❌ | 'guide' | 當前視圖名稱 |
| `loop` | Boolean | ❌ | false | 是否循環播放 |

### images 屬性

必須是字符串數組，包含所有指南圖片的導入路徑：

```javascript
// ✅ 正確用法
const images = [
  import('../assets/guide/step1.png'),
  import('../assets/guide/step2.png'),
  import('../assets/guide/step3.png')
]

// ❌ 錯誤用法 - 字符串路徑不會被正確解析
const images = [
  '@/assets/guide/step1.png',
  '@/assets/guide/step2.png'
]
```

## Events 事件說明

### @close

當用戶關閉指南時觸發：

```javascript
function handleClose() {
  // 可以在這裡添加關閉時的邏輯
  // 例如：統計使用情況、重置狀態等
}
```

### @imageChange

當用戶切換圖片時觸發，提供詳細的切換信息：

```javascript
function handleImageChange(data) {
  console.log(data)
  // 輸出示例：
  // {
  //   index: 1,        // 當前圖片索引（從 0 開始）
  //   total: 4,        // 總圖片數量
  //   direction: 'next' // 切換方向：'next' 或 'prev'
  // }
}
```

## 操作方式

### 鍵盤操作

| 按鍵 | 功能 |
|------|------|
| `→` 或 `↓` | 下一張圖片 |
| `←` 或 `↑` | 上一張圖片 |
| `ESC` | 關閉指南 |

### 滑鼠操作

| 操作 | 功能 |
|------|------|
| 右鍵點擊 | 下一張圖片 |
| 點擊空白處 | 關閉指南 |

## 循環模式 vs 邊界模式

### 邊界模式（loop: false）

- 在第一頁按左鍵不會切換
- 在最後一頁按右鍵不會切換
- 適用於：步驟式指南、教學流程

```vue
<GuideTemplate
  :images="images"
  :loop="false"
  title="步驟指南"
/>
```

### 循環模式（loop: true）

- 到達最後一頁後會回到第一頁
- 到達第一頁後會回到最後一頁
- 適用於：圖片展示、產品輪播

```vue
<GuideTemplate
  :images="images"
  :loop="true"
  title="圖片展示"
/>
```

## 實際範例

### 範例 1：交易指南（當前實現）

```vue
<!-- views/TradeGuideView.vue -->
<template>
  <GuideTemplate
    :images="tradeGuideImages"
    title="Trade Guide"
    currentView="trade-guide"
    :loop="false"
    @close="handleClose"
    @imageChange="handleImageChange"
  />
</template>

<script setup>
import GuideTemplate from '@/components/GuideTemplate.vue'

import tradeView1 from '@/assets/Guide/trade/trade_view_1.png'
import tradeView2 from '@/assets/Guide/trade/trade_view_2.png'
import tradeView3 from '@/assets/Guide/trade/trade_view_3.png'
import tradeView4 from '@/assets/Guide/trade/trade_view_4.png'

const tradeGuideImages = [
  tradeView1,
  tradeView2,
  tradeView3,
  tradeView4
]

function handleClose() {
  console.log('Trade guide closed')
}

function handleImageChange(data) {
  console.log(`Trade guide: viewing step ${data.index + 1}/${data.total}`)
}
</script>
```

### 範例 2：產品展示指南

```vue
<!-- views/ProductGuideView.vue -->
<template>
  <GuideTemplate
    :images="productImages"
    title="Product Gallery"
    currentView="product-guide"
    :loop="true"
    @close="handleClose"
    @imageChange="handleImageChange"
  />
</template>

<script setup>
import GuideTemplate from '@/components/GuideTemplate.vue'

import product1 from '@/assets/Guide/products/product1.png'
import product2 from '@/assets/Guide/products/product2.png'
import product3 from '@/assets/Guide/products/product3.png'

const productImages = [product1, product2, product3]

function handleClose() {
  // 記錄用戶瀏覽了產品指南
  analytics.track('product_guide_closed')
}

function handleImageChange(data) {
  // 記錄用戶瀏覽的產品
  analytics.track('product_viewed', {
    product_index: data.index + 1,
    direction: data.direction
  })
}
</script>
```

## 最佳實踐

### 1. 圖片準備

- 確保所有圖片尺寸一致或相近
- 使用高解析度圖片以適應不同屏幕
- 圖片格式建議使用 PNG（支持透明度）或 JPG（文件較小）

### 2. 文件組織

```
src/assets/Guide/
├── trade/           # 交易指南
│   ├── trade_view_1.png
│   ├── trade_view_2.png
│   └── ...
├── products/        # 產品指南
│   ├── product1.png
│   ├── product2.png
│   └── ...
└── features/        # 功能指南
    ├── feature1.png
    ├── feature2.png
    └── ...
```

### 3. 路由命名

```javascript
// 建議的命名規範
const routes = [
  {
    path: '/guide/trade',
    name: 'trade-guide',
    component: TradeGuideView,
  },
  {
    path: '/guide/products',
    name: 'products-guide', 
    component: ProductsGuideView,
  },
  {
    path: '/guide/features',
    name: 'features-guide',
    component: FeaturesGuideView,
  }
]
```

### 4. 事件處理

```javascript
// 建議在事件處理中添加有用的邏輯
function handleClose() {
  // 記錄用戶行為
  analytics.track('guide_closed', {
    guide_type: 'trade',
    time_spent: Date.now() - startTime
  })
}

function handleImageChange(data) {
  // 可以根據需要添加特殊邏輯
  if (data.index === data.total - 1) {
    // 最後一張圖片，可以顯示完成提示
    showCompletionToast()
  }
}
```

## 故障排除

### 常見問題

1. **圖片無法顯示**
   - 確保使用 `import` 語句導入圖片，不要使用字符串路徑
   - 檢查圖片文件是否存在

2. **鍵盤事件無效**
   - 確保沒有其他組件阻止了事件傳播
   - 檢查是否有其他事件監聽器衝突

3. **布局問題**
   - 確保父組件沒有設置特殊的 CSS 樣式
   - 檢查 z-index 是否被其他元素覆蓋

### 調試技巧

```javascript
// 在 handleImageChange 中添加調試信息
function handleImageChange(data) {
  console.log('Guide Debug:', {
    currentIndex: data.index,
    totalImages: data.total,
    direction: data.direction,
    imageSrc: props.images[data.index]
  })
}
```

## 更新日誌

- **v1.0.0** - 初始版本，基本功能實現
- **v1.1.0** - 添加循環模式和事件回調
- **v1.2.0** - 優化響應式設計和鍵盤導航

---

如有任何問題或建議，請聯繫開發團隊。
