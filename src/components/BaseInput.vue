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
      :type="type"
      :mask="mask"
      :placeholder="placeholder"
      lazy-rules="ondemand"
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
  mask: { type: String, default: '' },
  placeholder: { type: String, default: '' },
  type: { type: String, default: 'text' },
  rules: {
    type: Array,
    default: () => [],
  },
})
const emit = defineEmits(['update:modelValue'])
</script>
