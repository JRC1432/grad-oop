<template>
  <div class="q-px-sm">
    <span class="text-bold">{{ title }}</span>
    <q-file
      ref="qInputRef"
      outlined
      dense
      filled
      clearable
      counter
      color="primary"
      v-model="modelProxy"
      :name="name"
      :label="label"
      :accept="accept"
      :rules="rules"
      :multiple="false"
      lazy-rules="ondemand"
    >
      <template v-slot:prepend>
        <q-icon name="attach_file" />
      </template>
    </q-file>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'

const props = defineProps({
  modelValue: File,
  title: { type: String, default: 'label' },
  rules: {
    type: Array,
    default: () => [],
  },
  name: {
    type: String,
    default: 'file',
  },
  accept: {
    type: String,
    default: '.csv',
  },
  label: {
    type: String,
    default: 'Upload File',
  },
})

const emit = defineEmits(['update:modelValue'])

const modelProxy = computed({
  get: () => props.modelValue,
  set: (val) => {
    if (Array.isArray(val)) {
      emit('update:modelValue', val[0] || null)
    } else {
      emit('update:modelValue', val)
    }
  },
})

const qInputRef = ref(null)

defineExpose({
  validate: () => qInputRef.value?.validate?.(),
  resetValidation: () => qInputRef.value?.resetValidation?.(),
})
</script>
