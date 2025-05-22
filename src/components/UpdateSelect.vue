<template>
  <div class="q-px-sm">
    <span class="text-bold">{{ title }}</span>
    <q-select
      ref="qSelectRef"
      outlined
      dense
      behavior="menu"
      hide-bottom-space
      emit-value
      map-options
      use-input
      input-debounce="0"
      :model-value="modelValue"
      :name="name"
      :options="options"
      @filter="onFilter"
      @update:model-value="onUpdate"
      :rules="rules"
      clearable
    >
      <template v-slot:no-option>
        <q-item>
          <q-item-section class="text-grey">No results</q-item-section>
        </q-item>
      </template>
    </q-select>
  </div>
</template>

<script setup>
import { ref, watch, defineProps, defineEmits, defineExpose } from 'vue'
defineProps({
  modelValue: [String, Number],

  name: {
    type: String,
    default: 'yearselect',
  },
  rules: {
    type: Array,
    default: () => [],
  },

  options: {
    type: Array,
    required: true,
  },
  onFilter: {
    type: Function,
    required: true,
  },
  title: {
    type: String,
    default: 'Label',
  },
})

const emit = defineEmits(['update:modelValue'])

function onUpdate(val) {
  emit('update:modelValue', val)
}
const qSelectRef = ref(null)

defineExpose({
  validate: () => qSelectRef.value?.validate?.(),
  resetValidation: () => qSelectRef.value?.resetValidation?.(),
})
</script>
