<template>
  <div class="q-pa-md">
    <q-card class="my-card rounded-borders-20" flat>
      <q-card-section>
        <div class="text-h6 text-primary">Activity Log</div>
        <div class="text-subtitle2 text-primary">Activity Log Table</div>
      </q-card-section>

      <q-card-section class="q-pt-none">
        <LogsTbl :rows="rows" :columns="columns" />
      </q-card-section>
    </q-card>
  </div>
</template>
<script setup>
import LogsTbl from '../components/LogsTbl.vue'
import { ref, onMounted, inject } from 'vue'
import { useQuasar } from 'quasar'
import Swal from 'sweetalert2'

const user = inject('$user')
const $q = useQuasar()
const axios = inject('$axios')

const rows = ref([])

const columns = [
  {
    name: 'spas_id',
    required: true,
    label: 'SPAS ID',
    align: 'center',
    field: 'spas_id',
    sortable: true,
  },
  {
    name: 'action_title',
    required: true,
    label: 'Action Details',
    align: 'left',
    field: 'action_title',
    sortable: true,
  },
  {
    name: 'action_type',
    required: true,
    label: 'Type of Action',
    align: 'center',
    field: 'action_type',
    sortable: true,
  },
  {
    name: 'added_by',
    required: true,
    label: 'Action By',
    align: 'center',
    field: 'added_by',
    sortable: true,
  },
  {
    name: 'added_on',
    align: 'center',
    label: 'Date and Time Logs',
    field: 'added_on',
    sortable: true,
  },
]

onMounted(() => {
  readLog()
})

const readLog = () => {
  axios.get('/logs_function.php?readLogs').then(function (response) {
    rows.value = response.data
  })
}
</script>
