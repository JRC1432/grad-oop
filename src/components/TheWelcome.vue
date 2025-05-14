<template>
  <div class="row">
    <div
      class="col-lg-8 col-md-8 col-sm-8"
      v-if="q$.screen.gt.sm"
      style="background: radial-gradient(circle, #b8e986 0%, #71cf3a 100%)"
    >
      <Vue3Lottie
        animationLink="https://assets7.lottiefiles.com/packages/lf20_xY418y0j6x.json"
        style="height: calc(100vh)"
        :height="800"
        :width="800"
      />
    </div>
    <div class="col-12 col-lg-4 col-md-4 q-px-xl cards">
      <div class="justify-center">
        <div class="text-h5 text-center text-bold q-pt-xl q-mt-xl">
          <q-avatar rounded size="70px" class="q-mb-sm">
            <img src="../assets/seilogopng.png" />
          </q-avatar>
          <q-space />

          Graduate Scholarship Monitoring System
        </div>

        <q-space />

        <div class="q-pa-xl">
          <q-banner class="secondarymodes rounded-borders text-center">
            Please sign-in to your account
          </q-banner>
          <form id="login" @submit.prevent.stop="LogSubmit">
            <q-input
              ref="nameRef"
              v-model="state.usernames"
              :dense="dense"
              label="Username"
              name="usernames"
              :rules="inputRules"
            >
              <template v-slot:prepend>
                <q-icon name="person" />
              </template>
            </q-input>
            <q-input
              ref="passRef"
              :type="isPwd ? 'password' : 'text'"
              v-model="state.password"
              label="Password"
              :rules="inputpassRules"
              name="password"
            >
              <template v-slot:prepend>
                <q-icon name="password" />
              </template>
              <template v-slot:append>
                <q-icon
                  :name="isPwd ? 'visibility_off' : 'visibility'"
                  class="cursor-pointer"
                  @click="isPwd = !isPwd"
                />
              </template>
            </q-input>
            <div class="q-pa-sm">
              <q-btn rounded color="primary" label="Log In" type="submit" style="width: 100%" />
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { notifySuccess, notifyError } from '../utils/notify'
import { useQuasar } from 'quasar'
import { ref, reactive, inject, onBeforeUnmount } from 'vue'
import { RouterLink, RouterView } from 'vue-router'
import { useReCaptcha } from 'vue-recaptcha-v3'

import { isTemplateNode } from '@vue/compiler-core'
import router from '../router'

const axios = inject('$axios')
const user = inject('$user')

const isPwd = ref(true)

const q$ = useQuasar()
const $q = useQuasar()
const nameRef = ref(null)
const passRef = ref(null)

const { executeRecaptcha, recaptchaLoaded } = useReCaptcha()

let timer

const state = reactive({
  password: '',
  usernames: '',
})

const inputRules = [(val) => (val && val.length > 0) || 'Please enter your username']
const inputpassRules = [
  (val) => !!val || 'Field is required',
  (val) => val.length >= 6 || 'Please use minimum of 6 characters',
]

onBeforeUnmount(() => {
  if (timer !== void 0) {
    clearTimeout(timer)
    $q.loading.hide()
  }
})

const LogSubmit = async () => {
  // (optional) Wait until recaptcha has been loaded.
  await recaptchaLoaded()

  // Execute reCAPTCHA with action "login".
  const token = await executeRecaptcha('login')

  // Do stuff with the received token.
  console.log({ token })
  nameRef.value.validate()
  passRef.value.validate()

  if (nameRef.value.hasError || passRef.value.hasError) {
    // form has error
  } else {
    var formData = new FormData(document.getElementById('login'))

    axios.post('/users_function.php?usnames', formData).then(function (response) {
      console.log(response.data)
      if (response.data.error) {
        notifyError('Login Failed')
      } else {
        router.push('/dashboard')
      }
    })
  }
}
</script>
<style scoped>
.spacer {
  padding-right: 8px; /* Adds space to the right */
}
</style>
