<template>
  <div class="q-px-sm">
    <span class="text-bold">{{ title }}</span>
    <q-select
      ref="qSelectRef"
      outlined
      dense
      hide-bottom-space
      v-model="proxyValue"
      name="name"
      emit-value
      map-options
      use-input
      input-debounce="0"
      :options="options"
      @filter="filterFn"
      behavior="menu"
      :rules="rules"
      clearable
      lazy-rules="ondemand"
    >
      <template v-slot:no-option>
        <q-item>
          <q-item-section class="text-grey"> No results </q-item-section>
        </q-item>
      </template>
    </q-select>
  </div>
</template>

<script setup>
import { ref, watch, defineProps, defineEmits, defineExpose } from 'vue'

const props = defineProps({
  modelValue: [String, Number, Object],
  name: { type: String, default: '' },
  options: {
    type: Array,
    default: () => [],
  },
  filterFn: {
    type: Function,
    default: () => {},
  },
  rules: {
    type: Array,
    default: () => [],
  },
  title: {
    type: String,
    default: 'Label',
  },
})

const emit = defineEmits(['update:modelValue'])

const qSelectRef = ref(null)

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
  validate: () => qSelectRef.value?.validate?.(),
  resetValidation: () => qSelectRef.value?.resetValidation?.(),
})
</script>
