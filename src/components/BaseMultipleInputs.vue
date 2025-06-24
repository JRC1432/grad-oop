<template>
  <div class="q-px-sm">
    <span class="text-bold">{{ title }}</span>
    <q-select
      ref="selectRef"
      :label="label"
      filled
      hide-bottom-space
      :model-value="modelValue"
      @update:model-value="updateValue"
      use-input
      use-chips
      multiple
      outlined
      dense
      hide-dropdown-icon
      input-debounce="0"
      new-value-mode="add-unique"
      :name="name"
      :rules="rules"
      lazy-rules="ondemand"
    />
  </div>
</template>

<script setup>
import { ref, defineProps, defineEmits, defineExpose, computed } from 'vue'

const props = defineProps({
  title: { type: String, default: 'label' },
  modelValue: {
    type: Array,
    required: true,
  },
  label: {
    type: String,
    default: '',
  },
  name: {
    type: String,
    default: 'addcourse[]',
  },
  rules: {
    type: Array,
    default: () => [],
  },
})

const emit = defineEmits(['update:modelValue'])

const updateValue = (val) => {
  emit('update:modelValue', val)
}

const selectRef = ref(null)

function validate() {
  return selectRef.value?.validate()
}

function resetValidation() {
  return selectRef.value?.resetValidation()
}

function hasError() {
  return selectRef.value?.hasError ?? false
}

defineExpose({
  validate: () => selectRef.value.validate(),
  hasError: computed(() => selectRef.value.hasError),
})
</script>
