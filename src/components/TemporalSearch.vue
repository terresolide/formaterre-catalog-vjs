<script setup>
  import {ref} from 'vue'
  import VueDatePicker from '@vuepic/vue-datepicker';
  import '@vuepic/vue-datepicker/dist/main.css';
  const from = ref(null)
</script>
<template>
from: <VueDatePicker v-model="from"  :enable-time-picker="false" />
</template>