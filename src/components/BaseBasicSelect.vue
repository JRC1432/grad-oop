<template>
  <div class="q-px-sm">
    <span class="text-bold">{{ title }}</span>
    <q-select
      ref="qInputRef"
      v-model="proxyValue"
      outlined
      dense
      hide-bottom-space
      :options="options"
      :label="title"
      emit-value
      map-options
      :rules="rules"
      clearable
    />
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'

// refs
const qInputRef = ref(null)

// props and emit
const props = defineProps({
  options: {
    type: Array,
    required: true,
  },
  title: {
    type: String,
    default: 'Label',
  },
  modelValue: {
    type: [String, Number, Object],
    default: null,
  },
  rules: {
    type: Array,
    default: () => [],
  },
})

const emit = defineEmits(['update:modelValue'])

// local proxy to sync v-model
const proxyValue = ref(props.modelValue)

watch(
  () => props.modelValue,
  (val) => {
    proxyValue.value = val
  },
)

watch(proxyValue, (val) => {
  emit('update:modelValue', val)
})

// expose methods
defineExpose({
  validate: () => qInputRef.value?.validate?.(),
  resetValidation: () => qInputRef.value?.resetValidation?.(),
})
</script>
