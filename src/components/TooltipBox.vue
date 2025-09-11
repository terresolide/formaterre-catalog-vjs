<script setup>
const {description} = defineProps({
    icon: {
        type: String,
        default: 'fa-solid fa-'
    },
    description: null
})
</script>
<template v-if="description">
  <div>i</div>
  <div v-html="description" />
</template>
<style scoped>
</style>