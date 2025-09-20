<template>
  <div class="login-bg">
    <GuideButton />
    <div class="login-content">
      <div class="login-form">
        <div class="form-group">
          <input
            v-model="email"
            type="email"
            placeholder="Email"
            class="form-input"
            :class="{ 'error': errors.email }"
          />
          <div v-if="errors.email" class="error-message">{{ errors.email }}</div>
        </div>

        <div class="form-group">
          <input
            v-model="password"
            type="password"
            placeholder="Password"
            class="form-input"
            :class="{ 'error': errors.password }"
          />
          <div v-if="errors.password" class="error-message">{{ errors.password }}</div>
        </div>

        <button 
          class="login-btn" 
          @click="submitLogin"
          :disabled="isLoading"
        >
          {{ isLoading ? 'Loading...' : 'Log In' }}
        </button>

        <div v-if="errors.general" class="general-error">{{ errors.general }}</div>
      </div>
    </div>
    <BottomBar :showMenu="true" title="Login" currentView="login" />
  </div>
</template>

<script setup>
import BottomBar from "@/components/BottomBar.vue"
import GuideButton from "@/components/GuideButton.vue"
import { ref, watch, onMounted, onActivated } from "vue"
import { useRouter } from "vue-router"
import { useUserStore } from "@/stores/user"

const router = useRouter()
const userStore = useUserStore()

const email = ref("")
const password = ref("")
const isLoading = ref(false)
const errors = ref({
  email: '',
  password: '',
  general: ''
})

function checkLoginStatus() {
  if (userStore.isLoggedIn && userStore.email) {
    router.replace({ name: 'trade' })
    return true
  }
  return false
}

onMounted(() => {
  checkLoginStatus()
})

onActivated(() => {
  checkLoginStatus()
})

function handleVisibilityChange() {
  if (!document.hidden) {
    setTimeout(() => {
      checkLoginStatus()
    }, 100)
  }
}

function handleFocus() {
  setTimeout(() => {
    checkLoginStatus()
  }, 100)
}

onMounted(() => {

  if (!checkLoginStatus()) {
    document.addEventListener('visibilitychange', handleVisibilityChange)
    window.addEventListener('focus', handleFocus)
  }
})

import { onUnmounted } from "vue"
onUnmounted(() => {
  document.removeEventListener('visibilitychange', handleVisibilityChange)
  window.removeEventListener('focus', handleFocus)
})

watch(() => email.value, () => { errors.value.email = '' })
watch(() => password.value, () => { errors.value.password = '' })

async function submitLogin() {
  errors.value = {
    email: '',
    password: '',
    general: ''
  }

  if (!email.value) errors.value.email = '請填寫信箱'
  if (!password.value) errors.value.password = '請填寫密碼'
  
  if (errors.value.email || errors.value.password) return

  isLoading.value = true

  const requestData = {
    email: email.value,
    password: password.value
  }

  try {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(requestData)
    })

    const data = await response.json()

    if (response.ok || data.status === 0) {
      userStore.login(email.value)
      router.push({ name: 'trade' })
    } else {
      switch (data.status) {
        case 1:
          errors.value.general = '登入失敗，請檢查您的信箱和密碼'
          break
        case 2:
          errors.value.general = '信箱或密碼錯誤'
          break
        default:
          errors.value.general = '登入失敗，請稍後再試'
      }
    }
  } catch (error) {
    errors.value.general = '網路錯誤，請稍後再試'
  } finally {
    isLoading.value = false
  }
}
</script>

<style scoped>
.login-bg {
  width: 100vw;
  min-height: 100vh;
  background: #222;
  color: #fff;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  position: relative;
}

.login-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 2rem 0.7rem 1.2rem 0.7rem;
  box-sizing: border-box;
}

.login-form {
  width: 100%;
  max-width: 420px;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.form-group {
  display: flex;
  flex-direction: column;
}

.form-input {
  padding: 0.75rem;
  border: 2px solid transparent;
  border-radius: 0.5rem;
  font-size: 1.1rem;
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

.error-message {
  color: #ff4444;
  font-size: 0.9rem;
  margin-top: 0.5rem;
}

.general-error {
  color: #ff4444;
  font-size: 0.9rem;
  text-align: center;
  padding: 0.75rem;
  background: rgba(255, 68, 68, 0.1);
  border-radius: 0.5rem;
}

.login-btn {
  padding: 0.75rem;
  background: #19181a;
  color: #fff;
  border: none;
  border-radius: 0.5rem;
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

@media (max-width: 300px) {
  .login-content {
    padding: 1.5rem 0.4rem 0.8rem 0.4rem;
  }
  
  .login-form {
    gap: 1rem;
  }
  
  .form-input {
    padding: 0.5rem;
    font-size: 0.9rem;
  }
  
  .login-btn {
    padding: 0.6rem;
    font-size: 0.9rem;
  }
  
  .error-message {
    font-size: 0.8rem;
    margin-top: 0.3rem;
  }
  
  .general-error {
    font-size: 0.8rem;
    padding: 0.5rem;
  }
}

@media (max-width: 200px) {
  .login-content {
    padding: 1rem 0.27rem 0.53rem 0.27rem;
  }
  
  .login-form {
    gap: 0.67rem;
  }
  
  .form-input {
    padding: 0.33rem;
    font-size: 0.6rem;
    border-radius: 0.33rem;
  }
  
  .login-btn {
    padding: 0.4rem;
    font-size: 0.6rem;
    border-radius: 0.33rem;
  }
  
  .error-message {
    font-size: 0.53rem;
    margin-top: 0.2rem;
  }
  
  .general-error {
    font-size: 0.53rem;
    padding: 0.33rem;
    border-radius: 0.33rem;
  }
}
</style>