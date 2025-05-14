// FILE: main.js

import { createApp } from 'vue'
import { Quasar, Notify, Loading, Dialog, LoadingBar } from 'quasar'
import router from './router'
import { VueReCaptcha } from 'vue-recaptcha-v3'
import Vue3Lottie from 'vue3-lottie'
import axiosMain from 'axios'
import './assets/light.scss'
import './assets/dark.scss'
import PasswordMeter from 'vue-simple-password-meter'
// Import icon libraries
import '@quasar/extras/material-icons/material-icons.css'

// Import Quasar css
import 'quasar/src/css/index.sass'

// Assumes your root component is App.vue
// and placed in same folder as main.js
import App from './App.vue'

export const baseURL = import.meta.env.DEV
  ? 'http://localhost/backdbases/uses'
  : '../backdbase/uses'

const axios = axiosMain.create({
  baseURL,
  withCredentials: true,
})

const myApp = createApp(App)
myApp.provide('$axios', axios)

router.beforeEach(async (to, from, next) => {
  try {
    const response = await axios.get('/users_function.php?authLog', {
      withCredentials: true,
    })
    const user = response.data

    myApp.provide('$user', user)

    if (!user || !user.username) {
      // Redirect to login if not logged in
      if (to.meta.requiresAuth) {
        return next('/')
      }
      return next()
    }

    if (to.path === '/') {
      return next('/dashboard')
    }

    // Check if the route has access restrictions
    if (to.meta.requiresAuth && to.meta.accountType) {
      if (!to.meta.accountType.includes(user.access_level)) {
        Notify.create({
          type: 'negative',
          message: 'Unauthorized access!',
          icon: 'cancel',
          position: 'top-right',
        })
        return next('/dashboard') // Redirect unauthorized users
      }
    }

    return next()
  } catch (error) {
    console.error('Auth Check Error:', error)
    return next('/')
  }
})

myApp.use(router)
myApp.use(Vue3Lottie)
myApp.use(PasswordMeter)
myApp.use(Quasar, {
  plugins: { Notify, Loading, Dialog, LoadingBar }, // import Quasar plugins and add here
  config: {
    loadingBar: {
      skipHijack: false,
      color: 'positive',
      size: '3px',
    },
  },
})

myApp.use(VueReCaptcha, {
  siteKey: '6LfwPJUnAAAAAIe2G4j-VmxwN27GnrB4DAJ4Kt_Z',
})

// Assumes you have a <div id="app"></div> in your index.html
myApp.mount('#app')
