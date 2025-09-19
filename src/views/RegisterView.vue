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
              required
            />
          </div>
          <div class="auth-col">
            <span class="auth-ico">
              <img src="@/assets/Icons/single-key.svg" alt="password" />
            </span>
            <input
              v-model="form.password"
              type="password"
              placeholder="Password"
              required
            />
          </div>
          <div class="auth-col">
            <span class="auth-ico">
              <img src="@/assets/Icons/double-key.svg" alt="confirm password" />
            </span>
            <input
              v-model="form.confirm"
              type="password"
              placeholder="Confirm Password"
              required
            />
          </div>
          <button type="submit" class="auth-btn" aria-label="register button">
            Next
          </button>
        </form>
      </div>
    </div>
    
    <BottomBar :showMenu="true" title="Register" />
  </div>
</template>

<script setup>
import BottomBar from "@/components/BottomBar.vue";
import GuideButton from "@/components/GuideButton.vue";
import { ref } from "vue";
import { useRouter } from "vue-router";
const router = useRouter();
const form = ref({ email: "", password: "", confirm: "" });

function onRegister() {
  if (form.value.password !== form.value.confirm) {
    alert("密碼不一致！");
    return;
  }
  alert("送出:\n" + JSON.stringify(form.value, null, 2));
}
function goBack() {
  router.back();
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

  .auth-col {
    display: flex;
    flex-direction: column;
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
    display: flex;
    flex-direction: column;
    gap: 0.1rem;
  }
}
</style>
