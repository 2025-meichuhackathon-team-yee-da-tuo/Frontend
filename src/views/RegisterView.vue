<template>
  <div class="auth-bg">
    <div class="auth-box">
      <form class="auth-form" @submit.prevent="onRegister">
        <div class="auth-col">
          <span class="auth-ico fixed-lightbulb">
            <img src="@/assets/Icons/lightbulb.svg" alt="guide" />
          </span>
        </div>
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
    <BottomBar :showMenu="true" title="Register" @goBack="goBack" />
  </div>
</template>

<script setup>
import BottomBar from "@/components/BottomBar.vue";
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
}
.auth-bg {
  min-height: 100vh;
  width: 100vw;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #2d2d2d;
}
.auth-box {
  width: 100%;
  max-width: 340px;
  background: #2d2d2d;
  color: #fff;
  padding: 1rem 1.2rem 1rem 1.2rem;
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
  padding-left: 0rem;
  padding-right: 0rem;
}
.auth-ico {
  min-width: 1.5rem;
  text-align: left;
}
.auth-col input {
  flex: 1;
  font-size: 1.4rem;
  border-radius: 0.7rem;
  border: none;
  outline: none;
  padding: 0.45rem 0.7rem;
  margin-left: 0;
  margin-right: 0;
  color: #222;
  background: #fff;
}
.auth-btn {
  padding: 0.5rem 0rem;
  margin-top: 0.5rem;
  margin-left: 3rem;
  margin-right: 3rem;
  background: #19181a;
  color: #fff;
  border: none;
  border-radius: 0.7rem;
  cursor: pointer;
  font-size: 0.7rem;
}
.btm-bar {
  position: fixed;
  left: 0;
  right: 0;
  bottom: -0.2rem;
  width: 100vw;
  background: #19181a;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 -2px 16px #0004;
}
.btm-bar-btn {
  cursor: pointer;
  padding: 0.2rem 0.5rem 0rem 0.5rem;
}
@media (max-width: 480px) {
  .auth-box {
    max-width: 96vw;
  }
  .btm-bar-header {
    font-size: 1rem;
    font-weight: bold;
    text-align: center;
    color: #fff;
  }
  .auth-col input {
    font-size: 1rem;
    padding: 0.35rem 0.5rem;
  }
}
</style>
