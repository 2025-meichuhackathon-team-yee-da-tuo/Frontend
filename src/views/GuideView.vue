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
  console.log('Guide closed')
}
function handleImageChange(data) {
  console.log(`Image changed to ${data.index + 1}/${data.total}, direction: ${data.direction}`)
}
</script>
