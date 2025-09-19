<template>
  <div class="guide-button" @click="goGuide">
    <span class="guide-icon">
      <img src="@/assets/Icons/lightbulb.svg" alt="guide" />
    </span>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
const router = useRouter()
function goGuide() {
  router.push({ name: 'guide' });
}
</script>

<style scoped>
.guide-button {
  position: absolute;
  top: 1rem;
  left: 1rem;
  z-index: 10;
  cursor: pointer;
  transition: transform 0.2s ease;
  
  &:hover {
    transform: scale(1.1);
  }
  
  &:active {
    transform: scale(0.95);
  }
}

.guide-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  
  img {
    width: 2rem;
    height: 2rem;
    filter: brightness(0) invert(1);
    transition: all 0.3s ease;
  }
}


@media (max-width: 300px) {
  .guide-button {
    top: 0.5rem;
    left: 0.5rem;
  }
  
  .guide-icon img {
    width: 1.5rem;
    height: 1.5rem;
  }
}

@media (max-width: 200px) {
  .guide-button {
    top: 0.4rem;
    left: 0.4rem;
  }
  
  .guide-icon img {
    width: 1rem;
    height: 1rem;
  }
}
</style>
