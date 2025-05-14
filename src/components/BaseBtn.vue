<template>
  <q-btn unelevated rounded :color="btncolor" :label="btnlabel" />
</template>

<script setup>
import { ref } from 'vue'

const props = defineProps({
  btncolor: {
    type: String,
    default: 'primary',
  },
  btnlabel: {
    type: String,
    default: 'Click Me',
  },
})
</script>
