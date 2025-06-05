<template>
  <div class="q-pa-md">
    <q-card class="my-card rounded-borders-20 cards" flat>
      <q-card-section>
        <div class="text-h6 text-primary">Form Records</div>
        <div class="text-subtitle2 text-primary">Forms Lists Table</div>
        <div class="row justify-end">
          <BaseBtn btnlabel="Add New Forms" @click="newForms = true" />
        </div>
      </q-card-section>

      <q-card-section class="q-pt-none">
        <FormsTbl
          :rows="rows"
          :columns="columns"
          :editfile="editFiles"
          :deletefile="deleteFiles"
          @row-click="handleRowClick"
        />
      </q-card-section>
    </q-card>

    <q-dialog v-model="newForms" persistent>
      <q-card class="rounded-borders-20" style="width: 700px; max-width: 80vw">
        <form id="saveFileForm" @submit.prevent.stop="saveFile">
          <q-toolbar>
            <IconScript :size="30" stroke-width="2" />

            <q-toolbar-title
              ><span class="text-weight-bold" color="primary">{{
                isEditing ? 'Edit' : 'New'
              }}</span>
              Upload Form</q-toolbar-title
            >
            <q-btn flat round dense icon="close" @click="cancelForm" />
          </q-toolbar>

          <q-card-section>
            <div class="q-pa-md">
              <div class="row row_width q-col-gutter-xs">
                <div class="col-xs-12">
                  <BaseFile
                    title="Upload File Here"
                    ref="refuploadedFile"
                    v-model="uploadedFile"
                    name="uploadedFile"
                    accept=".pdf, .docx, .doc"
                    :rules="[isFileValid]"
                  />
                </div>
                <div class="col-xs-12">
                  <BaseInput
                    title="Form Name"
                    ref="refFormName"
                    v-model="state.form_name"
                    name="form_name"
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
  </div>
</template>

<script setup>
import BaseBtn from '../components/BaseBtn.vue'
import FormsTbl from '../components/FormsTbl.vue'
import BaseFile from '../components/BaseFile.vue'
import BaseInput from '../components/BaseInput.vue'
import { ref, onMounted, inject, reactive } from 'vue'
import { useQuasar } from 'quasar'
import { notifySuccess, notifyError } from '../utils/notify'
import { requiredField, isFileValid } from '../utils/validation'
import { IconScript } from '@tabler/icons-vue'

const rows = ref([])
const newForms = ref(false)

const user = inject('$user')
const $q = useQuasar()
const axios = inject('$axios')

const refFormName = ref(null)
const refuploadedFile = ref(null)
const uploadedFile = ref(null)
const isEditing = ref(false)

const columns = [
  {
    name: 'form_name',
    required: true,
    label: 'Form Title',
    align: 'center',
    field: 'form_name',
    sortable: true,
  },
  {
    name: 'added_by',
    required: true,
    label: 'Added By',
    align: 'center',
    field: 'added_by',
    sortable: true,
  },
  {
    name: 'created_at',
    required: true,
    label: 'Document Uploaded at',
    align: 'center',
    field: 'created_at',
    sortable: true,
  },
  {
    name: 'actions',
    label: 'Actions',
    align: 'center',
    field: 'actions',
    sortable: false,
  },
]

const state = reactive({
  form_name: '',
})

const resetForm = () => {
  state.form_name = ''
  uploadedFile.value = null
}

const cancelForm = () => {
  resetForm()
  newForms.value = false
  isEditing.value = false
}

const readForms = () => {
  axios.get('/forms_function.php?readforms').then((response) => {
    rows.value = response.data
  })
}

const saveFile = () => {
  refuploadedFile.value.validate()
  refFormName.value.validate()

  if (refuploadedFile.value.hasError || refFormName.value.hasError) {
    notifyError('Submit Failed')
  } else {
    var formData = new FormData(document.getElementById('saveFileForm'))
    formData.append('usercreator', user.username)
    formData.append('userid', user.id)
    formData.append('uploadedFile', uploadedFile.value)

    axios.post('/forms_function.php?createForms', formData).then(function (response) {
      if (response.data == true) {
        newForms.value = false
        readForms()
        uploadedFile.value = null
        state.form_name = null
        notifySuccess('Form Uploaded Successfully')
      } else {
        notifyError('Failed to upload Form')
        uploadedFile.value = null
        state.form_name = null
      }
    })
  }
}

const handleRowClick = (evt, row) => {
  const url = `http://localhost/backdbases/${row.file_path}`
  window.open(url, '_blank')
}
const editFiles = (props) => {
  console.log(props.row.id)
}
const deleteFiles = (props) => {
  var formData = new FormData()

  formData.append('creator', user.username)
  formData.append('username', props.row.username)
  formData.append('formid', props.row.id)

  $q.dialog({
    title: 'Confirm',
    message: 'Would you like to remove the form?',
    cancel: true,
    persistent: true,
  })
    .onOk(() => {
      console.log('>>>> OK')
      axios.post('/forms_function.php?deleteForms', formData).then(function (response) {
        if (response.data == true) {
          notifySuccess('Form Deleted Successfully')
          newForms.value = false
          readForms()
        } else {
          notifyError('Failed to remove the File')
        }
      })
    })
    .onCancel(() => {
      console.log('>>>> Cancel')
    })
}

onMounted(() => {
  readForms()
})
</script>
