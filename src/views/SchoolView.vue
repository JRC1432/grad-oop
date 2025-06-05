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
</template>

<script setup>
import BaseBtn from '../components/BaseBtn.vue'
import BaseTable from '../components/BaseTable.vue'
import BaseFile from '../components/BaseFile.vue'
import BaseInput from '../components/BaseInput.vue'
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

const user = inject('$user')
const q$ = useQuasar()
const $q = useQuasar()
const axios = inject('$axios')

const rows = ref([])

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
    name: '_region',
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
</script>
