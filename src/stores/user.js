import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', {
  state: () => ({
    email: null,
    isLoggedIn: false
  }),
  
  actions: {
    login(email) {
      this.email = email
      this.isLoggedIn = true
      localStorage.setItem('userEmail', email)
      localStorage.setItem('isLoggedIn', 'true')
    },
    
    logout() {
      this.email = null
      this.isLoggedIn = false
      localStorage.removeItem('userEmail')
      localStorage.removeItem('isLoggedIn')
    },
    
    restoreUser() {
      const email = localStorage.getItem('userEmail')
      const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true'
      
      if (email && isLoggedIn) {
        this.email = email
        this.isLoggedIn = true
      }
    }
  }
})