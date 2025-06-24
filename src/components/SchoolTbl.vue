<template>
  <q-table
    flat
    bordered
    title="Lists of Courses"
    :rows="rows"
    :columns="columns"
    row-key="id"
    :loading="loading"
    separator="cell"
    :filter="filter"
    v-model:selected="selectedRows"
  >
    <template v-slot:top-right>
      <q-input borderless dense debounce="300" v-model="filter" placeholder="Search">
        <template v-slot:append>
          <q-icon name="search" />
        </template>
      </q-input>
    </template>

    <template v-slot:body-cell-actions="props">
      <q-td :props="props">
        <q-btn dense round flat color="red" icon="delete" @click="showDel(props)" />
      </q-td>
    </template>
  </q-table>
</template>

<script setup>
import { ref, watch, defineEmits, defineProps } from 'vue'

const props = defineProps({
  rows: Array,
  columns: Array,
  loading: Boolean,
  showDel: Function,
})

const emit = defineEmits(['delete-row', 'update:selected'])

const filter = ref('')
const selectedRows = ref([])

watch(selectedRows, (val) => {
  emit('update:selected', val)
})
</script>
