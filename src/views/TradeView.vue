<template>
  <div class="trade-bg">
    <GuideButton ref="guideBtn" />
    
    <div class="trade-content">
      <div class="item-section-own">
        <div class="label-row">
          <span class="label">Owned Item</span>
          <span class="label">Quantity</span>
        </div>
        <div class="input-row">
          <button 
            class="input input-name item-btn"
            @click="goSelect('owned')"
            type="button"
          >
            <span v-if="ownedItemName">{{ ownedItemName }}</span>
            <span v-else>+</span>
          </button>
          <input
            v-model.number="ownedItemQty"
            :placeholder="ownedQtyHint"
            type="number"
            min="1"
            class="input input-qty"
            :class="{ 'error': errors.quantity_a }"
          />
        </div>
        <div v-if="errors.item_a" class="error-message">{{ errors.item_a }}</div>
        <div v-if="errors.quantity_a" class="error-message">{{ errors.quantity_a }}</div>
      </div>

      <div class="arrow-row">
        <span class="arrow-icon">↓</span>
      </div>

      <div class="item-section-desire">
        <div class="label-row">
          <span class="label">Desired Item</span>
          <span class="label">Quantity</span>
        </div>
        <div class="input-row">
          <button 
            class="input input-name item-btn"
            @click="goSelect('desired')"
            type="button"
          >
            <span v-if="desiredItemName">{{ desiredItemName }}</span>
            <span v-else>+</span>
          </button>
          <input
            v-model.number="desiredItemQty"
            :placeholder="desiredQtyHint"
            type="number"
            min="1"
            class="input input-qty"
            :class="{ 'error': errors.quantity_b }"
          />
        </div>
        <div v-if="errors.item_b" class="error-message">{{ errors.item_b }}</div>
        <div v-if="errors.quantity_b" class="error-message">{{ errors.quantity_b }}</div>
      </div>

      <div class="button-section">
        <button 
          ref="submitBtn"
          class="submit-btn" 
          @click="submitTrade"
          :disabled="isLoading"
        >
          {{ isLoading ? 'Loading...' : 'Add Trade' }}
        </button>
      </div>
      
      <div v-if="errors.general" class="general-error">{{ errors.general }}</div>
    </div>
    
    <BottomBar :showMenu="true" title="Trade" currentView="trade" />
  </div>
</template>

<script setup>
import BottomBar from "@/components/BottomBar.vue"
import GuideButton from "@/components/GuideButton.vue"
import { ref, computed, onMounted, onActivated, onUnmounted, watch, nextTick } from "vue"
import { useRoute, useRouter } from "vue-router"
import { useUserStore } from "@/stores/user"

const router = useRouter()
const route = useRoute()
const userStore = useUserStore()

const ownedItemName = ref("")
const ownedItemQty = ref()
const desiredItemName = ref("")
const desiredItemQty = ref()
const isLoading = ref(false)
const errors = ref({
  item_a: '',
  quantity_a: '',
  item_b: '',
  quantity_b: '',
  general: ''
})

const submitBtn = ref(null)
const guideBtn = ref(null)  // Ref for GuideButton

// Authentication check function
function checkAuthStatus() {
  userStore.restoreUser()
  if (!userStore.isLoggedIn || !userStore.email) {
    router.replace({ name: 'login' })
    return false
  }
  return true
}

onMounted(() => {
  if (!checkAuthStatus()) return
  
  syncFromQuery()
  
  if (submitBtn.value) {
    submitBtn.value.addEventListener('focus', () => {
      submitBtn.value.scrollIntoView({ behavior: 'smooth', block: 'center' });
    });
  }

  // Auto focus on GuideButton after DOM render
  nextTick(() => {
    if (guideBtn.value && guideBtn.value.$el) {
      guideBtn.value.$el.focus();
    }
  });
})

onActivated(() => {
  checkAuthStatus()
})

function handleVisibilityChange() {
  if (!document.hidden) {
    setTimeout(() => {
      checkAuthStatus()
    }, 100)
  }
}

function handleFocus() {
  setTimeout(() => {
    checkAuthStatus()
  }, 100)
}

onMounted(() => {
  if (checkAuthStatus()) {
    document.addEventListener('visibilitychange', handleVisibilityChange)
    window.addEventListener('focus', handleFocus)
  }
})

onUnmounted(() => {
  document.removeEventListener('visibilitychange', handleVisibilityChange)
  window.removeEventListener('focus', handleFocus)
})

watch(() => ownedItemName.value, () => { errors.value.item_a = '' })
watch(() => ownedItemQty.value, () => { errors.value.quantity_a = '' })
watch(() => desiredItemName.value, () => { errors.value.item_b = '' })
watch(() => desiredItemQty.value, () => { errors.value.quantity_b = '' })

const ownedQtyHint = computed(() => {
  if (!ownedItemQty.value) return "1"
  if (ownedItemQty.value < 1) return "INVALID"
  return ""
})

const desiredQtyHint = computed(() => {
  if (!desiredItemQty.value) return "2"
  if (desiredItemQty.value < 1) return "INVALID"
  return ""
})

async function submitTrade() {
  if (!checkAuthStatus()) return

  errors.value = {
    item_a: '',
    quantity_a: '',
    item_b: '',
    quantity_b: '',
    general: ''
  }

  if (!ownedItemName.value) errors.value.item_a = 'Please enter the name of the item you own'
  if (!ownedItemQty.value) errors.value.quantity_a = 'Please enter the quantity you own'
  if (!desiredItemName.value) errors.value.item_b = 'Please enter the name of the item you want'
  if (!desiredItemQty.value) errors.value.quantity_b = 'Please enter the quantity you want'

  if (ownedItemQty.value < 1) errors.value.quantity_a = 'Quantity must be greater than 0'
  if (desiredItemQty.value < 1) errors.value.quantity_b = 'Quantity must be greater than 0'
  
  if (errors.value.item_a || errors.value.quantity_a || errors.value.item_b || errors.value.quantity_b) return

  isLoading.value = true

  const params = new URLSearchParams({
    user_a: userStore.email,
    item_a: ownedItemName.value,
    quantity_a: parseInt(ownedItemQty.value).toString(),
    item_b: desiredItemName.value,
    quantity_b: parseInt(desiredItemQty.value).toString()
  })

  try {
    const response = await fetch(`/api/trade/new_trade?${params.toString()}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    })

    const data = await response.json()

    if (response.ok) {
      ownedItemName.value = ""
      ownedItemQty.value = null
      desiredItemName.value = ""
      desiredItemQty.value = null
      router.push({ name: 'menu', query: { view: 'history' } })
    } else {
      errors.value.general = 'Failed to create trade, please try again later'
    }
  } catch (error) {
    errors.value.general = 'Network error, please try again later'
  } finally {
    isLoading.value = false
  }
  
  ownedItemName.value = ""
  ownedItemQty.value = null
  desiredItemName.value = ""
  desiredItemQty.value = null
}

function goSelect(type) {
  if (!checkAuthStatus()) return
  
  router.push({
    name: "select_item", 
    query: {
      type,
      ownedItem: ownedItemName.value || "",
      desiredItem: desiredItemName.value || ""
    }
  })
}

function syncFromQuery(){
  if(route.query.ownedItem) ownedItemName.value = route.query.ownedItem
  if(route.query.desiredItem) desiredItemName.value = route.query.desiredItem
}

watch(() => route.query, syncFromQuery, { immediate: true, deep: true })
</script>

<style scoped>
.trade-bg {
  width: 100vw;
  min-height: 100vh;
  background: #222;
  color: #fff;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  position: relative;
}

.trade-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 3rem 0.7rem 3rem 0.7rem;
  box-sizing: border-box;
}

.label-row {
  width: 100%;
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.5rem;
  
  .label {
    font-size: 0.9rem;
    color: #ccc;
    font-weight: 500;
  }
}

.input-row {
  display: flex;
  gap: 0.6rem;
  width: 100%;
}

.input {
  border: 2px solid transparent;
  border-radius: 0.5rem;
  font-size: 1.2rem;
  padding: 0.6rem 0.8rem;
  box-sizing: border-box;
  background: #fff;
  color: #222;
  transition: all 0.2s ease;
  
  &:focus {
    outline: none;
    box-shadow: 0 0 0 2px rgba(255, 255, 255, 0.3);
  }
  
  &::placeholder {
    color: #999;
  }
  
  &.error {
    border-color: #ff4444;
    box-shadow: 0 0 0 2px rgba(255, 68, 68, 0.3);
  }
}

.input-name {
  flex: 3 1 0%;
  min-width: 0;
}

.input-qty {
  flex: 1 1 0%;
  max-width: 6rem;
  min-width: 0;
  text-align: center;
  
  &::placeholder {
    text-align: center;
  }
}

.error-message {
  color: #ff4444;
  font-size: 0.9rem;
  margin-top: 0.3rem;
  margin-left: 0.2rem;
}

.general-error {
  color: #ff4444;
  font-size: 0.9rem;
  margin-top: 1rem;
  text-align: center;
  padding: 0.5rem;
  background: rgba(255, 68, 68, 0.1);
  border-radius: 0.5rem;
  width: 100%;
  max-width: 420px;
}

.arrow-row {
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 0.2rem 0;
}

.arrow-icon {
  font-size: 2rem;
  color: #fff;
  font-weight: bold;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

.item-section-own, .item-section-desire {
  width: 100%;
  max-width: 420px;
  margin-top: 0.3rem;
  padding: 0.3rem 0.3rem;
  background: #232325;
  border-radius: 1.5rem;
  box-sizing: border-box;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.item-section-desire {
  margin-top: -0.3rem;
}

.button-section {
  margin-top: 0.7rem;
  width: 100%;
  max-width: 420px;
  display: flex;
  justify-content: center;
}

.submit-btn {
  padding: 0.75rem 3rem;
  background: #19181a;
  color: #fff;
  border: none;
  border-radius: 0.7rem;
  cursor: pointer;
  font-size: 1.1rem;
  font-weight: 600;
  transition: background-color 0.2s ease;
  
  &:hover:not(:disabled) {
    background: #000;
  }
  
  &:active:not(:disabled) {
    transform: translateY(1px);
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
}

.item-btn {
  cursor: pointer;
  
  &:hover {
    background: #f0f0f0;
  }
}

@media (max-width: 300px) {
  .trade-content {
    padding: 2rem 0.4rem 0.8rem 0.4rem;
  }
  
  .arrow-row {
    margin: 0.1rem 0;
  }
  
  .item-section {
    margin: 0.4rem 0;
  }
  
  .input {
    font-size: 0.9rem;
    padding: 0.45rem 0.5rem;
  }
  
  .input-qty {
    max-width: 5rem;
  }
  
  .label-row .label {
    font-size: 0.75rem;
  }
  
  .arrow-icon {
    font-size: 1.5rem;
  }
  
  .submit-btn {
    font-size: 0.9rem;
    padding: 0.6rem 2rem;
  }
  
  .error-message {
    font-size: 0.8rem;
  }
}

@media (max-width: 200px) {
  .trade-content {
    padding: 1.33rem 0.27rem 0.53rem 0.27rem;
  }
  
  .arrow-row {
    margin: 0.07rem 0;
  }
  
  .item-section {
    margin: 0.27rem 0;
    padding: 0.33rem 0.27rem;
    border-radius: 0.67rem;
  }
  
  .input {
    font-size: 0.6rem;
    padding: 0.3rem 0.33rem;
  }
  
  .input-row {
    gap: 0.2rem;
  }
  
  .input-qty {
    max-width: 3.33rem;
  }
  
  .label-row .label {
    font-size: 0.5rem;
  }
  
  .arrow-icon {
    font-size: 1rem;
  }
  
  .submit-btn {
    font-size: 0.6rem;
    padding: 0.4rem 1.33rem;
  }
  
  .error-message {
    font-size: 0.7rem;
  }
}
</style>
