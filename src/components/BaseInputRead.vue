<template>
  <div class="q-px-sm">
    <span class="text-bold">{{ title }}</span>
    <q-input
      ref="qInputRef"
      :name="name"
      :model-value="modelValue"
      :rules="rules"
      @update:model-value="(val) => emit('update:modelValue', val)"
      outlined
      dense
      hide-bottom-space
      readonly
    />
  </div>
</template>

<script setup>
import { ref, defineExpose } from 'vue'

const qInputRef = ref(null)

defineExpose({
  validate: () => qInputRef.value?.validate?.(),
  resetValidation: () => qInputRef.value?.resetValidation?.(),
})

const props = defineProps({
  title: { type: String, default: 'label' },
  modelValue: { type: [String, Number], default: '' },
  name: { type: String, default: '' },
  rules: {
    type: Array,
    default: () => [],
  },
})
const emit = defineEmits(['update:modelValue'])
</script>
