<script setup>
const {aggregation} = defineProps({
    aggregation: {
        type: Object,
        default: null
    }
})
</script>
<template>
  {{aggregation}}
</template>
<style>
</style>