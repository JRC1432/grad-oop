<template>
  <div class="q-pa-md">
    <q-card class="my-card rounded-borders-20 cards" flat>
      <q-card-section>
        <div class="text-h6 text-primary">School Records</div>
        <div class="text-subtitle2 text-primary">School Lists Table</div>
        <div class="row justify-end">
          <BaseBtn btnlabel="Add New Schools" @click="newSchools = true" />
        </div>
      </q-card-section>

      <q-card-section class="q-pt-none">
        <BaseTable :rows="rows" :columns="columns" :showedit="handleEdit" :showdel="handleDelete" />
      </q-card-section>
    </q-card>
  </div>

  <q-dialog v-model="newSchools" persistent>
    <q-card class="rounded-borders-20" style="width: 700px; max-width: 80vw">
      <form id="saveSchoolForm" @submit.prevent.stop="saveSchool">
        <q-toolbar>
          <IconBuildingCommunity :size="30" stroke-width="2" />

          <q-toolbar-title
            ><span class="text-weight-bold" color="primary">New</span> School</q-toolbar-title
          >
          <q-btn flat round dense icon="close" @click="cancelSchool" />
        </q-toolbar>

        <q-card-section>
          <div class="q-pa-md">
            <div class="row row_width q-col-gutter-xs">
              <div class="col-xs-12">
                <BaseInput
                  title="School Name"
                  ref="refSchoolName"
                  v-model="state.school_name"
                  name="school_name"
                  :rules="[requiredField]"
                />
              </div>
              <div class="col-xs-12">
                <BaseSelect
                  ref="refSchoolRegion"
                  title="School Region"
                  name="school_region"
                  v-model="school_region"
                  :options="schoolRegionOptions"
                  :filter-fn="filterSchoolRegion"
                  :rules="[isSelected]"
                />
              </div>
              <div class="">
                <BaseMultipleInputs
                  ref="refcourses"
                  v-model="state.addcourse"
                  title="Add Multiple Courses"
                  :name="'addcourse[]'"
                  :rules="[isMultiSelected]"
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

  <q-dialog v-model="editSchool" persistent>
    <q-card style="width: 700px; max-width: 80vw" class="rounded-borders-20">
      <q-toolbar>
        <IconBuildingCommunity :size="30" stroke-width="2" />

        <q-toolbar-title
          ><span class="text-weight-bold" color="primary">Edit</span> School
          Information</q-toolbar-title
        >
        <q-btn flat round dense icon="close" @click="onReset" />
      </q-toolbar>

      <form id="editSchoolCoursesForm" @submit.prevent.stop="editSchoolCourses">
        <div class="q-pa-sm">
          <BaseMultipleInputs
            ref="refEditcourses"
            v-model="state.editcourse"
            title="Add Multiple Courses"
            :name="'editcourse[]'"
            :rules="[isMultiSelected]"
          />
        </div>
        <div class="q-pa-md row justify-start">
          <BaseBtn btnlabel="Add Courses" type="submit" />
        </div>
      </form>

      <form id="editSchoolinfoForm" @submit.prevent.stop="editSchoolinfo">
        <q-card-section class="q-pt-none">
          <div class="col-xs-12 col-sm-6">
            <div class="q-col-gutter-md row items-start">
              <div class="col-xs-12 col-sm-12">
                <SchoolTbl
                  :rows="SCrows"
                  :columns="SCcolumns"
                  :loading="false"
                  :showDel="handleCourseDelete"
                />
              </div>

              <div class="col-xs-12 col-sm-6 col-md-6">
                <BaseInput
                  title="School Name"
                  ref="refEditSchoolName"
                  v-model="state.editSchool_name"
                  name="editSchool_name"
                  :rules="[requiredField]"
                />
              </div>
              <div class="col-xs-12 col-sm-6">
                <BaseSelect
                  ref="refEditSchoolRegion"
                  title="School Region"
                  name="editSchool_region"
                  v-model="editSchool_region"
                  :options="schoolRegionOptions"
                  :filter-fn="filterSchoolRegion"
                  :rules="[isSelected]"
                />
              </div>
            </div>
          </div>
        </q-card-section>

        <q-card-actions align="right">
          <BaseBtn btnlabel="Update" type="submit" />
        </q-card-actions>
      </form>
    </q-card>
  </q-dialog>
</template>

<script setup>
import BaseBtn from '../components/BaseBtn.vue'
import BaseTable from '../components/BaseTable.vue'
import BaseMultipleInputs from '../components/BaseMultipleInputs.vue'
import BaseInput from '../components/BaseInput.vue'
import BaseSelect from '../components/BaseSelect.vue'
import SchoolTbl from '../components/SchoolTbl.vue'
import { notifySuccess, notifyError } from '../utils/notify'
import { requiredField, isSelected, isMultiSelected } from '../utils/validation'

import { ref, onMounted, reactive, inject, computed } from 'vue'
import { IconBuildingCommunity } from '@tabler/icons-vue'
import { useQuasar, QSpinnerGears, Notify } from 'quasar'

const user = inject('$user')
const q$ = useQuasar()
const $q = useQuasar()
const axios = inject('$axios')

const refcourses = ref(null)
const refSchoolName = ref(null)
const refSchoolRegion = ref(null)
const refEditSchoolName = ref(null)
const refEditSchoolRegion = ref(null)
const school_region = ref()

const rows = ref([])
const SCrows = ref([])
const newSchools = ref(false)
const editSchool = ref(false)
const editSchool_region = ref()

const columns = [
  {
    name: 'school',
    required: true,
    label: 'School Name',
    align: 'left',
    field: 'school_name',
    sortable: true,
  },
  {
    name: 'school_region',
    required: true,
    label: 'School Region',
    align: 'left',
    field: 'school_region',
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

const SCcolumns = [
  {
    name: 'courses',
    required: true,
    label: 'Courses',
    align: 'left',
    field: 'courses',
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

const state = reactive({
  school_name: '',
  addcourse: [],
  editcourse: [],
  editSchool_name: '',
})

const cancelSchool = () => {
  newSchools.value = false
}

const readSchools = () => {
  axios.get('/school_function.php?readschools').then(function (response) {
    rows.value = response.data
  })

  axios.get('/school_function.php?readSchoolRegion').then(function (response) {
    schoolRegions2 = response.data
  })
}

var schoolRegions2 = []
const schoolRegionOptions = ref(schoolRegions2)

const filterSchoolRegion = (val, update) => {
  if (val === '') {
    update(() => {
      schoolRegionOptions.value = schoolRegions2
    })
    return
  }

  update(() => {
    const needle = val.toLowerCase()
    schoolRegionOptions.value = schoolRegions2.filter((option) => {
      return option.label.toLowerCase().includes(needle)
    })
  })
}

const saveSchool = async () => {
  await refSchoolName.value.validate()
  await refSchoolRegion.value.validate()
  await refcourses.value.validate()

  if (refSchoolName.value.hasError || refSchoolRegion.value.hasError || refcourses.value.hasError) {
    notifyError('Submit Failed')
    return
  }

  try {
    var formData = new FormData(document.getElementById('saveSchoolForm'))
    formData.append('usercreator', user.username)
    formData.append('userid', user.id)
    formData.append('school_region', school_region.value)

    const res = await axios.post('/school_function.php?createSchools', formData)

    if (res.data == true) {
      notifySuccess('Submit Successful')
      newSchools.value = false
      state.addcourse = []
      state.school_name = null
      school_region.value = null
      readSchools()
    } else {
      notifyError('Failed to Create School')
      state.addcourse = []
      state.school_name = null
      school_region.value = null
    }
  } catch (err) {
    notifyError('An error occurred while submitting')
    console.error(err)
  }
}

const handleDelete = (props) => {
  var formData = new FormData()

  formData.append('creator', user.username)
  formData.append('username', props.row.username)
  formData.append('schoolid', props.row.id)

  $q.dialog({
    title: 'Confirm',
    message: 'Would you like to remove the School?',
    cancel: true,
    persistent: true,
  })
    .onOk(() => {
      console.log('>>>> OK')
      axios.post('/school_function.php?deleteSchool', formData).then(function (response) {
        if (response.data == true) {
          notifySuccess('School Deleted Successfully')
          newSchools.value = false
          readSchools()
        } else {
          notifyError('Failed to remove the School')
        }
      })
    })
    .onCancel(() => {
      console.log('>>>> Cancel')
    })
}

const course_id = ref(null)

const handleEdit = (props) => {
  course_id.value = props.row.id
  state.editSchool_name = props.row.school_name
  editSchool_region.value = props.row.school_region

  var formData = new FormData()

  formData.append('courseid', course_id.value)

  editSchool.value = true
  axios.post('/school_function.php?readCourses', formData).then(function (response) {
    SCrows.value = Array.isArray(response.data) ? response.data : []
  })
}

const handleCourseDelete = (props) => {
  var formData = new FormData()

  formData.append('courseprimaryid', props.row.id)
  formData.append('courseid', course_id.value)

  $q.dialog({
    title: 'Confirm',
    message: 'Would you like to remove the Course?',
    cancel: true,
    persistent: true,
  })
    .onOk(() => {
      console.log('>>>> OK')
      axios.post('/school_function.php?deleteCourse', formData).then(function (response) {
        if (response.data == true) {
          notifySuccess('Course Deleted Successfully')
          axios.post('/school_function.php?readCourses', formData).then(function (response) {
            SCrows.value = Array.isArray(response.data) ? response.data : []
          })
        } else {
          notifyError('Failed to remove the Course')
        }
      })
    })
    .onCancel(() => {
      console.log('>>>> Cancel')
    })
}

const editSchoolCourses = () => {
  console.log(course_id.value)

  var formData = new FormData(document.getElementById('editSchoolCoursesForm'))
  formData.append('schoolid', course_id.value)
  formData.append('courseid', course_id.value)

  axios.post('/school_function.php?createNewCourses', formData).then(function (response) {
    if (response.data == true) {
      notifySuccess('Course Created Successfully')
      axios.post('/school_function.php?readCourses', formData).then(function (response) {
        SCrows.value = Array.isArray(response.data) ? response.data : []
      })
    } else {
      notifyError('Failed to create the Course')
    }
  })
}

const editSchoolinfo = async () => {
  await refEditSchoolName.value.validate()
  await refEditSchoolRegion.value.validate()

  if (refEditSchoolName.value.hasError || refEditSchoolRegion.value.hasError) {
    notifyError('Submit Failed')
    return
  }

  var formData = new FormData(document.getElementById('editSchoolinfoForm'))
  formData.append('schoolid', course_id.value)
  formData.append('school_region', editSchool_region.value)

  axios.post('/school_function.php?editSchoolInfo', formData).then(function (response) {
    if (response.data == true) {
      notifySuccess('School Information Updated Successfully')
      editSchool.value = false
      readSchools()
    } else {
      notifyError('Failed to update the School Information')
    }
  })
}

const onReset = () => {
  state.editcourse = null
  editSchool.value = false
}

onMounted(() => {
  readSchools()
})
</script>
