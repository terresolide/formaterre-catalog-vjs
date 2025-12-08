<script setup>
import { computed, inject } from 'vue';
const moment = inject('moment')
const props = defineProps({
   extent: Object
})
let start = computed(() => {
    if (props.extent.start && props.extent.start.date) {
        return moment(props.extent.start.date).format('ll')
    }
    return null  
})
let end = computed(() => {
    if (props.extent.end && props.extent.end.date) {
        return moment(props.extent.end.date).format('ll')
    }
    if (start) {
        return moment().format('ll')
    }
    
    return null  
})
</script>
<template v-if="start && end">

{{start}} <span>&rarr;</span> {{end}} 
  
</template>
<style scoped>
span {
    color: var(--color-text-primary);
}
</style>