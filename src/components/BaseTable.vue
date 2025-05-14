<template>
  <q-table
    :rows="rows"
    :columns="columns"
    row-key="id"
    :filter="filter"
    separator="cell"
    v-model:pagination="pagination"
    flat
    bordered
  >
    <template v-slot:top>
      <q-input v-model="filter" debounce="300" placeholder="Search..." outlined dense>
        <template v-slot:append>
          <q-icon name="search" />
        </template>
      </q-input>
    </template>
    <template v-slot:body-cell-actions="props">
      <q-td :props="props">
        <q-btn flat rounded class="bi bi-info-circle" color="blue-11" @click="showedit(props)">
          <IconUserEdit :size="30" stroke-width="2" />
        </q-btn>
        <q-btn flat rounded class="bi bi-info-circle" color="red-5" @click="showdel(props)">
          <IconUserMinus :size="30" stroke-width="2" />
        </q-btn>
      </q-td>
    </template>
  </q-table>
</template>

<script setup>
import { ref } from 'vue'
import { IconUserEdit, IconUserMinus } from '@tabler/icons-vue'

const props = defineProps({
  rows: {
    type: Array,
    required: true,
  },
  columns: {
    type: Array,
    required: true,
  },
  showedit: Function,
  showdel: Function,
})

const filter = ref('')
const pagination = ref({
  page: 1, // Current page
  rowsPerPage: 14, // Rows per page
})
</script>
