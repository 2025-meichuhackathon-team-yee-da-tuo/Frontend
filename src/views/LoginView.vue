<template>
  <div class="auth-bg">
    <GuideButton />
    
    <div class="auth-content">
      <div class="auth-box">
        <form class="auth-form" @submit.prevent="onLogin">
          <div class="auth-col">
            <span class="auth-ico">
              <img src="@/assets/Icons/mail.svg" alt="mail" />
            </span>
            <input
              v-model="login.email"
              type="email"
              placeholder="example@example.com"
              required
            />
          </div>
          <div class="auth-col">
            <span class="auth-ico">
              <img src="@/assets/Icons/single-key.svg" alt="password" />
            </span>
            <input
              v-model="login.password"
              type="password"
              placeholder="Password"
              required
            />
          </div>
          <button type="submit" class="auth-btn" aria-label="login button">
            Login
          </button>
        </form>
      </div>
    </div>
    
    <BottomBar :showMenu="true" title="Login" />
  </div>
</template>

<script setup>
import BottomBar from "@/components/BottomBar.vue"
import GuideButton from "@/components/GuideButton.vue"
import { ref } from "vue"

const login = ref({
  email: "",
  password: "",
})

function onLogin() {
  console.log("Login info", login.value)
  alert("登入資訊:\n" + JSON.stringify(login.value, null, 2))
}
</script>

<style scoped>
.auth-bg {
  min-height: 100vh;
  width: 100vw;
  display: flex;
  flex-direction: column;
  background: #2d2d2d;
  position: relative;
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
  gap: 0.5rem;
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
  border: none;
  outline: none;
  padding: 0.45rem 0.7rem;
  color: #222;
  background: #fff;
  transition: all 0.2s ease;
  
  &:focus {
    box-shadow: 0 0 0 2px rgba(255, 255, 255, 0.3);
  }
  
  &::placeholder {
    color: #999;
  }
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
  
  &:hover {
    background: #000;
  }
  
  &:active {
    transform: translateY(1px);
  }
}

@media (max-width: 300px) {
  .auth-content {
    margin-top: 0.5rem;
  }
  
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
  
  .auth-btn {
    padding: 0.5rem 1.5rem;
    font-size: 0.9rem;
  }
  
  .auth-col {
    gap: 0.3rem;
  }
}

@media (max-width: 200px) {
  .auth-content {
    margin-top: 0.4rem;
  }
  
  .auth-box {
    max-width: 90vw;
    padding: 0.5rem;
  }
  
  .auth-form {
    gap: 0.6rem;
  }
  
  .auth-col {
    gap: 0.1rem;
  }
  
  .auth-col input {
    font-size: 0.8rem;
    padding: 0.25rem 0.4rem;
  }
  
  .auth-ico img {
    width: 1rem;
    height: 1rem;
  }
  
  .auth-btn {
    padding: 0.4rem 1rem;
    font-size: 0.8rem;
    margin-left: 0.5rem;
    margin-right: 0.5rem;
  }
}
</style>
