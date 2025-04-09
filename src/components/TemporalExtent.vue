<script setup>
import { computed, inject } from 'vue';
import {useConfig} from '@/stores/config'
const moment = inject('moment')
const props = defineProps({
   extent: Object
})
let config = useConfig()
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

{{start}} <span :style="{color: config.state.primary}">&rarr;</span> {{end}} 
  
</template>
<style scoped>

</style>