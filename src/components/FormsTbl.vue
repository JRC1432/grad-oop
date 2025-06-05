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
    @row-click="handleRowClick"
    row-class="cursor-pointer"
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
        <q-btn
          flat
          rounded
          icon="edit"
          class="q-mr-sm bi bi-pencil"
          color="blue-11"
          @click.stop="editfile(props)"
        />
        <q-btn
          flat
          rounded
          icon="delete"
          class="bi bi-trash"
          color="red-11"
          @click.stop="deletefile(props)"
        />
      </q-td>
    </template>
  </q-table>
</template>

<script setup>
import { ref } from 'vue'
import { IconFileSearch } from '@tabler/icons-vue'

const props = defineProps({
  rows: {
    type: Array,
    required: true,
  },
  columns: {
    type: Array,
    required: true,
  },
  editfile: Function,
  deletefile: Function,
})

const filter = ref('')
const pagination = ref({
  page: 1, // Current page
  rowsPerPage: 12, // Rows per page
})
</script>
