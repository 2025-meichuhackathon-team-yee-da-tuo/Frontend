<template>
  <GuideTemplate
    :images="tradeGuideImages"
    title="Trade Guide"
    currentView="guide"
    :loop="false"
    @close="handleClose"
    @imageChange="handleImageChange"
  />
</template>

<script setup>
import GuideTemplate from '@/components/GuideTemplate.vue'

// 導入交易指南圖片
import tradeView1 from '@/assets/Guide/trade/trade_view_1.png'
import tradeView2 from '@/assets/Guide/trade/trade_view_2.png'
import tradeView3 from '@/assets/Guide/trade/trade_view_3.png'
import tradeView4 from '@/assets/Guide/trade/trade_view_4.png'

// 定義交易指南圖片數組
const tradeGuideImages = [
  tradeView1,
  tradeView2,
  tradeView3,
  tradeView4
]

// 處理關閉事件
function handleClose() {
  console.log('Guide closed')
}

// 處理圖片切換事件
function handleImageChange(data) {
  console.log(`Image changed to ${data.index + 1}/${data.total}, direction: ${data.direction}`)
}
</script>

<!-- 樣式已移至 GuideTemplate 組件中 -->
