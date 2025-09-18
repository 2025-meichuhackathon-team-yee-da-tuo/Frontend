<template>
  <div class="menu-bg">
    <span class="auth-ico fixed-lightbulb">
      <img src="@/assets/Icons/lightbulb.svg" alt="guide" />
    </span>
    <div class="item-section">
      <div class="label-row">
        <span class="label">Owned Item</span>
        <span class="label">Quantity</span>
      </div>
      <div class="input-row">
        <input v-model="ownedItemName" class="input input-name" />
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
        <input v-model="desiredItemName" class="input input-name" />
        <input
          v-model.number="desiredItemQty"
          :placeholder="desiredQtyHint"
          type="number"
          min="1"
          class="input input-qty"
        />
      </div>
    </div>
    <BottomBar :showMenu="true" title="Add Your Trade" @goBack="goBack" />
  </div>
</template>

<script setup>
import BottomBar from "@/components/BottomBar.vue";
import { ref, computed } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();
function goBack() {
  router.back();
}

const ownedItemQty = ref();
const desiredItemQty = ref();

const ownedQtyHint = computed(() => {
  if (!ownedItemQty.value) return "1";
  if (ownedItemQty.value < 1) return "INVALID";
  return "";
});

const desiredQtyHint = computed(() => {
  if (!desiredItemQty.value) return "2";
  if (desiredItemQty.value < 1) return "INVALID";
  return "";
});
</script>

<style scoped>
.fixed-lightbulb {
  position: fixed;
  top: 5vw;
  left: 5vw;
  font-size: 6vw;
  pointer-events: none;
}
.menu-bg {
  width: 100vw;
  min-height: 100vh;
  background: #222;
  color: #fff;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 2rem 0.7rem 1.2rem 0.7rem;
  box-sizing: border-box;
  position: fixed;
  left: 0;
  top: 0;
  z-index: 1000;
}
.menu-btn {
  width: 90%;
  padding: 0.7rem;
  border-radius: 0.8rem;
  background: #19191b;
  font-size: 1.25rem;
  color: #fff;
  border: none;
  text-align: center;
  cursor: pointer;
  box-shadow: 0 2px 12px #0001;
  text-decoration: none;
}
.menu-btn,
.menu-btn:active {
  color: #fff;
}
.label-row {
  width: 100%;
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.25rem;
}
.item-section {
  width: 100%;
  max-width: 420px;
  margin: 1rem 0 0.8rem 0;
  padding: 0.8rem 0.7rem;
  background: #232325;
  border-radius: 3rem;
  box-sizing: border-box;
}

.input-row {
  display: flex;
  gap: 0.6rem;
  width: 100%;
}

.input-name {
  flex: 3 1 0%;
  min-width: 0;
}

.input-qty {
  flex: 1 1 0%;
  max-width: 6rem;
  min-width: 0;
  text-align: left;
}
.input-qty::placeholder {
  text-align: left;
}

.input {
  width: 100%;
  box-sizing: border-box;
  font-size: 1.2rem;
  padding: 0.32rem 0.6rem;
}
.btm-bar-btn {
  cursor: pointer;
  padding: 0.2rem 0.5rem 0rem 0.5rem;
}
.arrow-icon {
  font-size: 2rem;
  color: #fff;
}
@media (max-width: 520px) {
  .item-section {
    max-width: 98vw;
    padding: 0.2rem 0.2rem;
  }
  .input {
    font-size: 1rem;
    padding: 0.28rem 0.4rem;
  }
  .input-row {
    gap: 0.35rem;
  }
  .btm-bar-header {
    font-size: 1rem;
    font-weight: bold;
    text-align: center;
    color: #fff;
  }
}
</style>
