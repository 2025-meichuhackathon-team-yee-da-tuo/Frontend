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

const props = defineProps({
  images: {
    type: Array,
    required: true,
    validator: (images) => {
      return images.length > 0 && images.every(img => typeof img === 'string')
    }
  },
  title: {
    type: String,
    default: 'Guide'
  },
  currentView: {
    type: String,
    default: 'guide'
  },
  loop: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['close', 'imageChange'])

const router = useRouter()

const currentImageIndex = ref(0)
const totalImages = computed(() => props.images.length)

const currentImageSrc = computed(() => {
  return props.images[currentImageIndex.value]
})

function nextImage() {
  if (props.loop) {
    currentImageIndex.value = (currentImageIndex.value + 1) % totalImages.value
  } else {
    if (currentImageIndex.value < totalImages.value - 1) {
      currentImageIndex.value++
    }
  }
  
  emit('imageChange', {
    index: currentImageIndex.value,
    total: totalImages.value,
    direction: 'next'
  })
}

function prevImage() {
  if (props.loop) {
    currentImageIndex.value = currentImageIndex.value === 0 
      ? totalImages.value - 1 
      : currentImageIndex.value - 1
  } else {
    if (currentImageIndex.value > 0) {
      currentImageIndex.value--
    }
  }
  
  emit('imageChange', {
    index: currentImageIndex.value,
    total: totalImages.value,
    direction: 'prev'
  })
}

function closeGuide() {
  emit('close')
  router.back()
}

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

onMounted(() => {
  document.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleKeydown)
})

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
  padding-bottom: 6rem; 
  cursor: pointer;
  overflow: hidden;
}

.guide-image {
  max-width: 100vw;
  max-height: 90vh;
  width: auto;
  height: auto;
  object-fit: contain;
  display: block;
  margin: 0 auto;
  margin-top: 3rem;
}


.guide-bottombar {
  flex-shrink: 0;
}

@media (max-width: 300px) {
  .guide-content {
    padding: 0rem;
  }
}

@media (max-width: 200px) {
  .guide-content {
    padding: 0.5rem;
  }
}
</style>
