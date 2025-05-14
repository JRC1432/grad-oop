<script setup>
import { ref, inject, reactive, onMounted } from 'vue'
import Swal from 'sweetalert2'

const axios = inject('$axios')
const user = inject('$user')

const regpic = ref(user.pic)
const showPic = ref(false)
import router from '../router'

const url = ref('http://localhost/backdbase/' + user.pic)

const state = reactive({
  pic: '',
})

const onFileChange = () => {
  const file = state.pic
  url.value = URL.createObjectURL(file)
}

const logOut = () => {
  axios.post('/users_function.php?authlogout').then(function (response) {
    router.push('/')
  })
}

// Sweet Alert (PhotoUpdate) Code Here

const showPicalert = () => {
  let timerInterval
  Swal.fire({
    title: 'Updating Your Profile Photo!',
    html: 'In Progress.',
    timer: 2000,
    timerProgressBar: true,
    didOpen: () => {
      Swal.showLoading()
      const b = Swal.getHtmlContainer().querySelector('b')
      timerInterval = setInterval(() => {
        b.textContent = Swal.getTimerLeft()
      }, 100)
    },
    willClose: () => {
      clearInterval(timerInterval)
      Swal.fire({
        icon: 'success',
        title: 'Updated successfully',
        showConfirmButton: false,
        timer: 1500,
      })
    },
  }).then((result) => {
    /* Read more about handling dismissals below */
    if (result.dismiss === Swal.DismissReason.timer) {
      console.log('I was closed by the timer')
    }
  })
}

const onRejected = (rejectedFiles) => {
  rejectedFiles.forEach((rejectedFile) => {
    if (rejectedFile.failedPropValidation) {
      Notify.create({
        message: 'Only Image are Allowed',
        type: 'negative',
      })
    }
  })
}

const upload = () => {
  var formData = new FormData(document.getElementById('picForm'))
  formData.append('authid', user.id)
  formData.append('username', user.username)
  axios.post('/update.php?updatePic', formData).then(function (response) {
    if (response.data == true) {
      url.value = 'http://localhost/backdbase/' + user.pic
      showPic.value = false
      showPicalert()
    } else {
      alert('Error')
    }
  })
}
</script>
<template>
  <label>{{ user.username }}</label>
  <q-btn round flat>
    <q-avatar size="35px">
      <img :src="'http://localhost/backdbase/' + regpic" />
    </q-avatar>
    <q-menu>
      <q-item clickable v-close-popup>
        <q-item-section @click="showPic = true" class="on-surface-text"
          >Upload Photo</q-item-section
        >
      </q-item>
      <q-item clickable v-close-popup @click="logOut">
        <q-item-section class="on-surface-text">Log out</q-item-section>
      </q-item>
    </q-menu>
    <q-tooltip>Account</q-tooltip>
  </q-btn>

  <q-dialog v-model="showPic" persistent>
    <q-card class="my-card" flat bordered>
      <form id="picForm" @submit.prevent="upload">
        <q-card-section horizontal>
          <q-card-section class="q-pt-xs">
            <div class="text-overline on-surface-text">Upload Your Profile Photo Here...</div>
            <div class="text-h5 q-mt-sm q-mb-xs">
              <div class="text-caption text-grey">
                <q-file
                  style="max-width: 400px"
                  v-model="state.pic"
                  name="pic"
                  rounded
                  outlined
                  label="Image Attach Here"
                  accept=".jpg, image/*"
                  @rejected="onRejected"
                  counter
                  @change="changePic"
                  @update:model-value="onFileChange"
                >
                  <template v-slot:prepend>
                    <q-icon name="attach_file" />
                  </template>
                </q-file>
              </div>
            </div>
          </q-card-section>

          <q-card-section class="col-5 flex flex-center">
            <q-avatar size="100px" class="row justify-center">
              <img :src="url" spinner-color="white" v-if="url" />
            </q-avatar>
          </q-card-section>
        </q-card-section>

        <q-separator />

        <q-card-actions>
          <q-btn flat v-close-popup class="on-surface-text"> Cancel </q-btn>
          <q-btn push flat color="primary" @click="upload"> Save Changes </q-btn>
        </q-card-actions>
      </form>
    </q-card>
  </q-dialog>
</template>
