<template>
  <div class="auth-bg">
    <GuideButton/>
    <div class="auth-content">
      <div class="auth-box">
        <form class="auth-form" @submit.prevent="onRegister">
          <div class="auth-col">
            <span class="auth-ico">
              <img src="@/assets/Icons/mail.svg" alt="mail" />
            </span>
            <input
              v-model="form.email"
              type="email"
              placeholder="example@example.com"
              :class="{ 'error': errors.email }"
              required
            />
            <div v-if="errors.email" class="error-message">{{ errors.email }}</div>
          </div>
          <div class="auth-col">
            <span class="auth-ico">
              <img src="@/assets/Icons/single-key.svg" alt="password" />
            </span>
            <input
              v-model="form.password"
              type="password"
              placeholder="Password"
              :class="{ 'error': errors.password }"
              required
            />
            <div v-if="errors.password" class="error-message">{{ errors.password }}</div>
          </div>
          <div class="auth-col">
            <span class="auth-ico">
              <img src="@/assets/Icons/double-key.svg" alt="confirm password" />
            </span>
            <input
              v-model="form.confirm"
              type="password"
              placeholder="Confirm Password"
              :class="{ 'error': errors.confirm }"
              required
            />
            <div v-if="errors.confirm" class="error-message">{{ errors.confirm }}</div>
          </div>
          <button 
            type="submit" 
            class="auth-btn" 
            :disabled="isLoading"
            aria-label="register button"
          >
            {{ isLoading ? 'Loading...' : 'Next' }}
          </button>
        </form>
      </div>
    </div>
    
    <BottomBar :showMenu="true" title="Register" currentView="register"/>
  </div>
</template>

<script setup>
import BottomBar from "@/components/BottomBar.vue";
import GuideButton from "@/components/GuideButton.vue";
import { ref, watch } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();
const form = ref({ email: "", password: "", confirm: "" });
const isLoading = ref(false);
const errors = ref({ email: '', password: '', confirm: '' });

// 清除錯誤訊息當使用者開始輸入
watch(() => form.value.email, () => { errors.value.email = '' });
watch(() => form.value.password, () => { errors.value.password = '' });
watch(() => form.value.confirm, () => { errors.value.confirm = '' });

function clearErrors() {
  errors.value = { email: '', password: '', confirm: '' };
}

async function onRegister() {
  clearErrors();
  isLoading.value = true;

  try {
    const response = await fetch('/api/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: form.value.email,
        password: form.value.password,
        confirmPassword: form.value.confirm
      })
    });

    const data = await response.json();

    if (response.ok) {
      switch (data.status || data.code || 0) {
        case 0:
          router.push({ name: 'login' });
          break;
        case 1:
          errors.value.email = 'The email is already registered!';
          break;
        case 2:
          errors.value.password = 'The password must be at least 8 characters long!';
          break;
        case 3:
          errors.value.confirm = 'The password and confirmation password do not match!';
          break;
        default:
          router.push({ name: 'login' });
      }
    } else {
      if (data.status !== undefined || data.code !== undefined) {
        const statusCode = data.status || data.code;
        switch (statusCode) {
          case 1:
            errors.value.email = 'The email is already registered!';
            break;
          case 2:
            errors.value.password = 'The password must be at least 8 characters long!';
            break;
          case 3:
            errors.value.confirm = 'The password and confirmation password do not match!';
            break;
          default:
            errors.value.email = data.message || 'Registration failed, please try again later';
        }
      } else {
        errors.value.email = data.message || 'Registration failed, please try again later';
      }
    }
  } catch (error) {
    errors.value.email = 'Network error, please try again later';
    console.error('API request error:', error);
  } finally {
    isLoading.value = false;
  }
}
</script>

<style scoped>
.fixed-lightbulb {
  position: fixed;
  top: 5vw;
  left: 5vw;
  font-size: 6vw;
  pointer-events: none;
  z-index: 10;
}

.auth-bg {
  min-height: 100vh;
  width: 100vw;
  display: flex;
  flex-direction: column;
  background: #2d2d2d;
}

.auth-content {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 1rem;
  margin-top: 1rem;
}

.auth-box {
  width: 100%;
  max-width: 340px;
  background: #2d2d2d;
  color: #fff;
  padding: 1rem 1.2rem;
  display: flex;
  flex-direction: column;
  align-items: stretch;
}

.auth-form {
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
}

.auth-col {
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
}

.auth-ico {
  min-width: 1.5rem;
  text-align: left;
  
  img {
    width: 1.5rem;
    height: 1.5rem;
    filter: brightness(0) invert(1);
  }
}

.auth-col input {
  flex: 1;
  font-size: 1.4rem;
  border-radius: 0.7rem;
  border: 2px solid transparent;
  outline: none;
  padding: 0.45rem 0.7rem;
  color: #222;
  background: #fff;
  transition: all 0.2s ease;
  
  &:focus {
    box-shadow: 0 0 0 2px rgba(255, 255, 255, 0.3);
  }
  
  &.error {
    border-color: #ff4444;
    box-shadow: 0 0 0 2px rgba(255, 68, 68, 0.3);
  }
}

.error-message {
  color: #ff4444;
  font-size: 0.9rem;
  margin-top: 0.2rem;
  margin-left: 0.2rem;
  min-height: 1.2rem;
}

.auth-btn {
  padding: 0.75rem 2rem;
  margin-top: 1rem;
  margin-left: 2rem;
  margin-right: 2rem;
  background: #19181a;
  color: #fff;
  border: none;
  border-radius: 0.7rem;
  cursor: pointer;
  font-size: 1rem;
  font-weight: 600;
  transition: background-color 0.2s ease;
  
  &:hover:not(:disabled) {
    background: #000;
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
}

@media (max-width: 300px) {
  .auth-box {
    max-width: 96vw;
    padding: 0.75rem;
  }
  
  .auth-col input {
    font-size: 1rem;
    padding: 0.35rem 0.5rem;
  }
  
  .auth-ico img {
    width: 1.2rem;
    height: 1.2rem;
  }
  
  .fixed-lightbulb img {
    width: 1.5rem;
    height: 1.5rem;
  }
  
  .auth-btn {
    padding: 0.5rem 1.5rem;
    font-size: 0.9rem;
  }
  
  .error-message {
    font-size: 0.8rem;
  }
}

@media (max-width: 200px) {
  .auth-box {
    max-width: 90vw;
    padding: 0.5rem;
  }
  
  .auth-form {
    gap: 0.6rem;
  }
  
  .auth-col input {
    font-size: 0.8rem;
    padding: 0.25rem 0.4rem;
  }
  
  .auth-ico img {
    width: 1rem;
    height: 1rem;
  }
  
  .fixed-lightbulb img {
    width: 1.2rem;
    height: 1.2rem;
  }
  
  .auth-btn {
    padding: 0.4rem 1rem;
    font-size: 0.8rem;
    margin-left: 0.5rem;
    margin-right: 0.5rem;
  }
  
  .auth-col {
    gap: 0.1rem;
  }
  
  .error-message {
    font-size: 0.7rem;
  }
}
</style>