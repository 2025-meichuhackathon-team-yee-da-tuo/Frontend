<template>
  <div class="trade-bg">
    <GuideButton />
    
    <div class="trade-content">
      <div class="item-section">
        <div class="label-row">
          <span class="label">Owned Item</span>
          <span class="label">Quantity</span>
        </div>
        <div class="input-row">
          <input 
            v-model="ownedItemName" 
            class="input input-name"
            placeholder="Enter item name"
          />
          <input
            v-model.number="ownedItemQty"
            :placeholder="ownedQtyHint"
            type="number"
            min="1"
            class="input input-qty"
          />
        </div>
      </div>

      <div class="arrow-row">
        <span class="arrow-icon">↓</span>
      </div>

      <div class="item-section">
        <div class="label-row">
          <span class="label">Desired Item</span>
          <span class="label">Quantity</span>
        </div>
        <div class="input-row">
          <input 
            v-model="desiredItemName" 
            class="input input-name"
            placeholder="Enter item name"
          />
          <input
            v-model.number="desiredItemQty"
            :placeholder="desiredQtyHint"
            type="number"
            min="1"
            class="input input-qty"
          />
        </div>
      </div>

      <div class="button-section">
        <button class="submit-btn" @click="submitTrade">
          Add Trade
        </button>
      </div>
    </div>
    
    <BottomBar :showMenu="true" title="Trade" currentView="trade" />
  </div>
</template>

<script setup>
import BottomBar from "@/components/BottomBar.vue"
import GuideButton from "@/components/GuideButton.vue"
import { ref, computed } from "vue"
import { useRouter } from "vue-router"

const router = useRouter()

const ownedItemName = ref("")
const ownedItemQty = ref()
const desiredItemName = ref("")
const desiredItemQty = ref()

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

function goBack() {
  router.back()
}

function submitTrade() {
  if (!ownedItemName.value || !desiredItemName.value || !ownedItemQty.value || !desiredItemQty.value) {
    alert("請填寫所有必填欄位")
    return
  }
  
  if (ownedItemQty.value < 1 || desiredItemQty.value < 1) {
    alert("數量必須大於 0")
    return
  }
  
  const tradeData = {
    owned: {
      name: ownedItemName.value,
      quantity: ownedItemQty.value
    },
    desired: {
      name: desiredItemName.value,
      quantity: desiredItemQty.value
    }
  }
  
  console.log("Trade data:", tradeData)
  alert("交易已提交:\n" + JSON.stringify(tradeData, null, 2))
}
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
  padding: 3rem 0.7rem 1.2rem 0.7rem;
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
  border: none;
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

.item-section {
  width: 100%;
  max-width: 420px;
  margin: 0.5rem 0;
  padding: 0.8rem 0.7rem;
  background: #232325;
  border-radius: 1.5rem;
  box-sizing: border-box;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.button-section {
  margin-top: 1rem;
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
  
  &:hover {
    background: #000;
  }
  
  &:active {
    transform: translateY(1px);
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
}
</style>
