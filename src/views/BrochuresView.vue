<template>
  <div>
    <div class="row items-center q-pb-xl q-pa-md">
      <q-icon name="history_edu" size="md" class="q-mr-sm" color="primary" />
      <div class="text-h6 text-bold on-surface-text">Brochures</div>
    </div>

    <div class="q-pa-md">
      <BaseBtn btnlabel="Add New Brochures" @click="newBrochures = true" />
    </div>

    <!-- Search Bar -->
    <div class="q-pa-md">
      <q-input
        v-model="searchQuery"
        outlined
        debounce="300"
        placeholder="SEARCH TEMPLATES..."
        clearable
      />
    </div>
    <div class="q-pa-md row items-start q-gutter-md justify-center">
      <q-card
        v-for="data in filteredDatas"
        :key="data.id"
        class="my-card rounded-borders-20 hover-card on-surface-text"
        bordered
        hoverable
      >
        <q-img style="max-height: 180px" src="https://picsum.photos/600/400" alt="Random Image" />

        <q-card-section>
          <q-btn
            fab
            color="amber-4"
            icon="open_in_new"
            class="absolute"
            @click="viewBrochure(data)"
            style="top: 0; right: 12px; transform: translateY(-50%)"
          >
            <q-popup-proxy>
              <q-card>
                <img :src="data.preview" />
              </q-card>
            </q-popup-proxy>
            <q-tooltip transition-show="rotate" transition-hide="rotate" class="bg-primary">
              View Brochure
            </q-tooltip>
          </q-btn>
          <div class="row no-wrap items-center">
            <div class="col text-h6 ellipsis">{{ data.form_name }}</div>
          </div>
        </q-card-section>

        <q-card-section class="q-pt-none q-card-sec">
          <!-- <div class="text-subtitle1">{{ data.description }}</div> -->

          <div class="text-caption text-grey">
            {{ data.description }}
          </div>
        </q-card-section>

        <q-separator />

        <q-card-actions align="center">
          <q-btn rounded color="red" flat @click="removeBrochure(data)">Remove</q-btn>
        </q-card-actions>
      </q-card>
    </div>
  </div>

  <q-dialog v-model="newBrochures" persistent>
    <q-card class="rounded-borders-20" style="width: 700px; max-width: 80vw">
      <form id="saveBrochureForm" @submit.prevent.stop="saveBrochure">
        <q-toolbar>
          <IconBook :size="30" stroke-width="2" />

          <q-toolbar-title
            ><span class="text-weight-bold" color="primary">New</span> Upload
            Brochure</q-toolbar-title
          >
          <q-btn flat round dense icon="close" @click="cancelBrochure" />
        </q-toolbar>

        <q-card-section>
          <div class="q-pa-md">
            <div class="row row_width q-col-gutter-xs">
              <div class="col-xs-12">
                <BaseFile
                  title="Upload File Here"
                  ref="refuploadedBrochure"
                  v-model="uploadedBrochure"
                  name="uploadedBrochure"
                  accept=".pdf, .docx, .doc"
                  :rules="[isFileValid]"
                />
              </div>
              <div class="col-xs-12">
                <BaseInput
                  title="Brochure Name"
                  ref="refBrochureName"
                  v-model="state.brochure_name"
                  name="brochure_name"
                  :rules="[requiredField]"
                />
              </div>
              <div class="col-xs-12">
                <BaseInput
                  title="Brochure Description"
                  v-model="state.brochure_description"
                  name="brochure_description"
                  :rules="[requiredField]"
                />
              </div>
            </div>
          </div>
        </q-card-section>
        <q-card-actions class="justify-end q-mr-lg q-mb-md">
          <BaseBtn btnlabel="Submit" type="submit" />
        </q-card-actions>
      </form>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { ref, reactive, onMounted, inject, computed } from 'vue'
import { useQuasar, QSpinnerGears } from 'quasar'
import Swal from 'sweetalert2'

import { notifySuccess, notifyError } from '../utils/notify'
import BaseFile from '../components/BaseFile.vue'
import BaseInput from '../components/BaseInput.vue'
import BaseBtn from '../components/BaseBtn.vue'
import { IconBook } from '@tabler/icons-vue'

const $q = useQuasar()

const axios = inject('$axios')
const user = inject('$user')

const refuploadedBrochure = ref(null)
const refBrochureName = ref(null)

const uploadedBrochure = ref(null)

const searchQuery = ref('')
const datas = ref([])
const newBrochures = ref(false)

const state = reactive({
  brochure_name: '',
  brochure_description: '',
})

const filteredDatas = computed(() => {
  return datas.value.filter((item) =>
    item.form_name?.toLowerCase().includes(searchQuery.value.toLowerCase()),
  )
})

const readBrochures = () => {
  axios.get('/forms_function.php?readbrochures').then(function (response) {
    datas.value = response.data
  })
}

const viewBrochure = (data) => {
  const url = `http://localhost/backdbases/${data.file_path}`
  window.open(url, '_blank')
}

const saveBrochure = () => {
  refBrochureName.value.validate()
  refuploadedBrochure.value.validate()

  if (refBrochureName.value.hasError || refuploadedBrochure.value.hasError) {
    notifyError('Submit Failed')
  } else {
    var formData = new FormData(document.getElementById('saveBrochureForm'))
    formData.append('usercreator', user.username)
    formData.append('userid', user.id)
    formData.append('uploadedFile', uploadedBrochure.value)

    axios.post('/forms_function.php?createBrochures', formData).then(function (response) {
      if (response.data == true) {
        newBrochures.value = false
        readBrochures()
        uploadedBrochure.value = null
        state.brochure_name = null
        notifySuccess('Form Uploaded Successfully')
      } else {
        notifyError('Failed to upload brochure')
        uploadedBrochure.value = null
        state.brochure_name = null
      }
    })
  }
}

const removeBrochure = (data) => {
  var formData = new FormData()
  formData.append('brochureid', data.id)

  $q.dialog({
    title: 'Confirm',
    message: 'Would you like to remove the form?',
    cancel: true,
    persistent: true,
  })
    .onOk(() => {
      console.log('>>>> OK')
      axios.post('/forms_function.php?deleteBrochures', formData).then(function (response) {
        if (response.data == true) {
          notifySuccess('Brochures Deleted Successfully')
          readBrochures()
        } else {
          notifyError('Failed to remove the brochure')
        }
      })
    })
    .onCancel(() => {
      console.log('>>>> Cancel')
    })
}

const resetBrochure = () => {
  state.brochure_name = ''
  uploadedBrochure.value = null
  state.brochure_description = ''
}

const cancelBrochure = () => {
  resetBrochure()
  newBrochures.value = false
}

onMounted(() => {
  readBrochures()
})
</script>

<style scoped>
.my-card {
  max-width: 300px;
  width: 100%;
  min-height: 400px;
  height: 400px;
}

.q-card-sec {
  min-height: 100px !important;
}

.hover-card {
  transition:
    transform 0.2s ease,
    box-shadow 0.3s ease;
}

.hover-card:hover {
  transform: translateY(-6px); /* Lift effect */
  box-shadow: 0 12px 25px rgba(0, 0, 0, 0.3); /* Stronger shadow effect */
}

/* Add spacing between images */
.marquee-container {
  display: flex; /* Ensure images align properly */
  gap: 16px; /* Space between images */
}

.marquee-image {
  margin: 0 100px; /* Optional: Add spacing around each image */
}

.container {
  max-width: 600px;
  margin: 0 auto;
  text-align: center;
}
</style>
