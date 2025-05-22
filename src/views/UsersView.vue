<template>
  <div class="q-pa-md">
    <q-card class="my-card rounded-borders-20 cards" flat>
      <q-card-section>
        <div class="text-h6 text-primary">Users Control Panel</div>
        <div class="text-subtitle2 text-primary">Users Table</div>
        <div class="row justify-end">
          <BaseBtn btnlabel="Add New User" @click="newUser = true" />
        </div>
      </q-card-section>

      <q-card-section class="q-pt-none">
        <BaseTable :rows="rows" :columns="columns" :showedit="handleEdit" :showdel="handleDelete" />
      </q-card-section>
    </q-card>
  </div>

  <q-dialog v-model="newUser" persistent>
    <q-card class="rounded-borders-20" style="width: 700px; max-width: 80vw">
      <form id="saveUserForm" @submit.prevent.stop="saveUser">
        <q-toolbar>
          <IconUser :size="30" stroke-width="2" />

          <q-toolbar-title
            ><span class="text-weight-bold" color="primary">{{ isEditing ? 'Edit' : 'New' }}</span>
            User Profile</q-toolbar-title
          >
          <q-btn flat round dense icon="close" @click="cancelUser" />
        </q-toolbar>

        <q-card-section>
          <div class="text-h6">{{ isEditing ? 'Edit' : 'New' }} User Personal Information</div>

          <div class="q-pa-md">
            <div class="row row_width q-col-gutter-xs">
              <div class="col-xs-12 col-sm-6 col-md-6">
                <BaseInput
                  title="First Name"
                  ref="reffirstname"
                  name="firstname"
                  v-model="state.firstname"
                  :rules="[requiredField]"
                />
              </div>
              <div class="col-xs-12 col-sm-6 col-md-6">
                <BaseInput
                  title="Last Name"
                  ref="reflastname"
                  name="lastname"
                  v-model="state.lastname"
                  :rules="[requiredField]"
                />
              </div>
              <div class="col-xs-12">
                <BaseInput
                  title="Username"
                  ref="refusername"
                  name="username"
                  v-model="state.username"
                  :rules="[requiredField]"
                />
              </div>

              <div class="col-xs-12">
                <div class="q-px-sm">
                  <span class="text-bold">Password</span>
                  <q-input
                    ref="refpassword"
                    name="password"
                    outlined
                    dense
                    hide-bottom-space
                    :type="isPwd ? 'password' : 'text'"
                    v-model="state.password"
                    :rules="passwordRules"
                  >
                    <template v-slot:append>
                      <q-icon
                        :name="isPwd ? 'visibility_off' : 'visibility'"
                        class="cursor-pointer"
                        @click="isPwd = !isPwd"
                      /> </template
                  ></q-input>

                  <PasswordMeter @score="onScore" :password="state.password" />
                </div>
              </div>
              <div class="col-xs-12">
                <div class="q-px-sm">
                  <span class="text-bold">Confirm Password</span>
                  <q-input
                    ref="refconfirmpassword"
                    name="confirmpassword"
                    outlined
                    dense
                    hide-bottom-space
                    :type="isPwds ? 'password' : 'text'"
                    v-model="state.confirmpassword"
                    :rules="confirmPasswordRules"
                  >
                    <template v-slot:append>
                      <q-icon
                        :name="isPwds ? 'visibility_off' : 'visibility'"
                        class="cursor-pointer"
                        @click="isPwds = !isPwds"
                      /> </template
                  ></q-input>
                </div>
              </div>
              <div class="col-xs-12">
                <BaseBasicSelect
                  ref="refuserlevel"
                  name="userlevel"
                  title="User Access Level"
                  :options="userlvl"
                  v-model="userlevel"
                  :rules="[isSelected]"
                />
              </div>
            </div>
          </div>
        </q-card-section>
        <q-card-actions class="justify-end q-mr-lg q-mb-md">
          <BaseBtn btnlabel="Submit" @click="saveUser" />
          <BaseBtn btnlabel="Cancel" btncolor="warning" @click="cancelUser" />
        </q-card-actions>
      </form>
    </q-card>
  </q-dialog>
</template>

<script setup>
import BaseBtn from '../components/BaseBtn.vue'
import BaseTable from '../components/BaseTable.vue'
import BaseInput from '../components/BaseInput.vue'

import BaseBasicSelect from '../components/BaseBasicSelect.vue'
import { notifySuccess, notifyError } from '../utils/notify'
import {
  requiredField,
  isSelected,
  passwordStrength,
  confirmPasswordMatch,
} from '../utils/validation'

import { ref, onMounted, reactive, inject, computed } from 'vue'
import { IconUser } from '@tabler/icons-vue'
import { useQuasar, QSpinnerGears, Notify } from 'quasar'
import PasswordMeter from 'vue-simple-password-meter'

const user = inject('$user')
const q$ = useQuasar()
const $q = useQuasar()
const axios = inject('$axios')

const passwordRules = [passwordStrength]
const confirmPasswordRules = computed(() => [confirmPasswordMatch(state.password)])
const newUser = ref(false)
const isPwd = ref(true)
const isPwds = ref(true)

const rows = ref([])
const userlvl = [
  { label: 'Administrator Account', value: '1' },
  { label: 'User Account', value: '0' },
  { label: 'Coordinator', value: '2' },
  { label: 'Project Leaders', value: '3' },
]
const reffirstname = ref(null)
const reflastname = ref(null)
const refusername = ref(null)
const refpassword = ref(null)
const refconfirmpassword = ref(null)
const refuserlevel = ref(null)
const isEditing = ref(false)
const editingUserId = ref(null)
const userlevel = ref(null)

const state = reactive({
  firstname: '',
  lastname: '',
  username: '',
  password: '',
  confirmpassword: '',
})

const columns = [
  {
    name: 'fname',
    required: true,
    label: 'First Name',
    align: 'center',
    field: 'fname',
    sortable: true,
  },
  {
    name: 'lname',
    required: true,
    label: 'Last Name',
    align: 'center',
    field: 'lname',
    sortable: true,
  },
  {
    name: 'username',
    required: true,
    label: 'UserName',
    align: 'center',
    field: 'username',
    sortable: true,
  },
  {
    name: 'Added By',
    align: 'center',
    label: 'Added By',
    field: 'addedby',
    sortable: true,
  },
  {
    name: 'Access Level',
    align: 'center',
    label: 'Access Level',
    field: 'access_level',
    sortable: true,
  },
  {
    name: 'addedon',
    align: 'center',
    label: 'Date and Time Created',
    field: 'addedon',
    sortable: true,
  },
  {
    name: 'actions',
    align: 'center',
    label: 'Action Buttons',
    field: '',
    sortable: true,
  },
]

const readusers = () => {
  axios.get('/users_function.php?readusers').then(function (response) {
    rows.value = response.data
  })
}

const resetForm = () => {
  state.firstname = ''
  state.lastname = ''
  state.username = ''
  state.password = ''
  state.confirmpassword = ''
  userlevel.value = null
  newUser.value = false
}

const cancelUser = () => {
  resetForm()
  newUser.value = false
  isEditing.value = false
}

const handleEdit = (props) => {
  state.firstname = props.row.fname
  state.lastname = props.row.lname
  state.username = props.row.username

  editingUserId.value = props.row.id
  isEditing.value = true
  newUser.value = true
}

const saveUser = async () => {
  const isFirstNameValid = await reffirstname.value.validate()
  const isLastNameValid = await reflastname.value.validate()
  const isUsernameValid = await refusername.value.validate()
  const isPasswordValid = await refpassword.value.validate()
  const isConfirmPasswordValid = await refconfirmpassword.value.validate()
  const isUserLevelValid = await refuserlevel.value.validate()

  if (
    !isUsernameValid ||
    !isPasswordValid ||
    !isConfirmPasswordValid ||
    !isUserLevelValid ||
    !isFirstNameValid ||
    !isLastNameValid
  ) {
    notifyError('Please fill all required fields')
  } else {
    if (state.password !== state.confirmpassword) {
      notifyError('Password and Confirm Password do not match')
      return
    }

    var formData = new FormData(document.getElementById('saveUserForm'))

    formData.append('creator', user.username)
    formData.append('authid', user.id)
    formData.append('access_level', userlevel.value)

    if (isEditing.value) {
      formData.append('userid', editingUserId.value)
      axios.post('/users_function.php?updateuser', formData).then((response) => {
        if (response.data == true) {
          notifySuccess('User Updated Successfully')
          readusers()
          newUser.value = false
          resetForm()
        } else {
          notifyError('User Update Failed')
        }
      })
    } else {
      axios.post('/users_function.php?createuser', formData).then(function (response) {
        if (response.data == true) {
          state.username = ''
          state.password = ''
          state.confirmpassword = ''
          userlevel.value = null
          newUser.value = false
          notifySuccess('New User Created Successfully')
        } else {
          notifyError('New User Creation Failed')
        }
      })
    }
  }
}

const handleDelete = (props) => {
  $q.dialog({
    title: 'Confirm',
    message: 'Would you like to remove the user?',
    cancel: true,
    persistent: true,
  }).onOk(() => {
    var formData = new FormData()
    formData.append('userid', props.row.id)
    // notifySuccess('User Deleted Successfully')

    axios.post('/users_function.php?deleteuser', formData).then(function (response) {
      if (response.data == true) {
        readusers()
        notifySuccess('User Deleted Successfully')
      } else {
        notifyError('User Deletion Failed')
      }
    })
  })
}

onMounted(() => {
  readusers()
})
</script>
