<template>
  <div class="guide-overlay">
    <div class="guide-content" @click="closeGuide" @contextmenu.prevent="nextImage">
      <img :src="currentImageSrc" alt="guide" class="guide-image" />
    </div>
    <div class="guide-bottombar">
      <BottomBar :showMenu="false" :title="title" :currentView="currentView" />
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, readonly } from 'vue'
import { useRouter } from 'vue-router'
import BottomBar from '@/components/BottomBar.vue'

// Props 定義
const props = defineProps({
  // 圖片路徑數組
  images: {
    type: Array,
    required: true,
    validator: (images) => {
      return images.length > 0 && images.every(img => typeof img === 'string')
    }
  },
  // 指南標題
  title: {
    type: String,
    default: 'Guide'
  },
  // 當前視圖名稱
  currentView: {
    type: String,
    default: 'guide'
  },
  // 是否啟用循環切換（到達最後一張後回到第一張）
  loop: {
    type: Boolean,
    default: false
  }
})

// Emits 定義
const emit = defineEmits(['close', 'imageChange'])

const router = useRouter()

// 響應式數據
const currentImageIndex = ref(0)
const totalImages = computed(() => props.images.length)

// 當前圖片源
const currentImageSrc = computed(() => {
  return props.images[currentImageIndex.value]
})

// 切換到下一張圖片
function nextImage() {
  if (props.loop) {
    // 循環模式：到達最後一張後回到第一張
    currentImageIndex.value = (currentImageIndex.value + 1) % totalImages.value
  } else {
    // 非循環模式：只有在不是最後一頁時才能切換
    if (currentImageIndex.value < totalImages.value - 1) {
      currentImageIndex.value++
    }
  }
  
  // 發送圖片切換事件
  emit('imageChange', {
    index: currentImageIndex.value,
    total: totalImages.value,
    direction: 'next'
  })
}

// 切換到上一張圖片
function prevImage() {
  if (props.loop) {
    // 循環模式：到達第一張後回到最後一張
    currentImageIndex.value = currentImageIndex.value === 0 
      ? totalImages.value - 1 
      : currentImageIndex.value - 1
  } else {
    // 非循環模式：只有在不是第一頁時才能切換
    if (currentImageIndex.value > 0) {
      currentImageIndex.value--
    }
  }
  
  // 發送圖片切換事件
  emit('imageChange', {
    index: currentImageIndex.value,
    total: totalImages.value,
    direction: 'prev'
  })
}

// 關閉指南
function closeGuide() {
  emit('close')
  router.back()
}

// 鍵盤事件處理
function handleKeydown(event) {
  switch (event.key) {
    case 'ArrowRight':
    case 'ArrowDown':
      event.preventDefault()
      nextImage()
      break
    case 'ArrowLeft':
    case 'ArrowUp':
      event.preventDefault()
      prevImage()
      break
    case 'Escape':
      event.preventDefault()
      closeGuide()
      break
  }
}

// 生命週期鉤子
onMounted(() => {
  document.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleKeydown)
})

// 暴露方法給父組件使用
defineExpose({
  nextImage,
  prevImage,
  closeGuide,
  currentImageIndex: readonly(currentImageIndex),
  totalImages: readonly(totalImages)
})
</script>

<style scoped>
.guide-overlay {
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: column;
  background: rgba(0, 0, 0, 0.9);
  position: fixed;
  top: 0;
  left: 0;
  z-index: 1000;
}

.guide-content {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  padding-bottom: 6rem; /* 為 BottomBar 預留空間 */
  cursor: pointer;
  overflow: hidden;
}

.guide-image {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
  border-radius: 0.5rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5);
}

.guide-bottombar {
  flex-shrink: 0;
}

@media (max-width: 300px) {
  .guide-content {
    padding: 1rem;
  }
}

@media (max-width: 200px) {
  .guide-content {
    padding: 0.5rem;
  }
}
</style>
