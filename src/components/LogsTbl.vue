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
})

const filter = ref('')
const pagination = ref({
  page: 1, // Current page
  rowsPerPage: 14, // Rows per page
})
</script>
