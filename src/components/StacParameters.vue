<script setup>
import {useConfig} from '@/stores/config.js'
const {metadata} = defineProps({
    metadata: {
        type: Object,
        default: null
    }
})
const config = useConfig()
const stacProperties = ['platform', 'instrument',  'relative_orbit', 'orbit_state', 'instrument_mode','polarizations']
</script>
<template>
    <template v-for="key in stacProperties"> 
     <div  v-if="metadata[key]">
     <label :style="{color: config.state.primary}">{{ key }}: </label> 
        <span >{{ metadata[key] }} </span>
    </div>
    </template>  
</template> 