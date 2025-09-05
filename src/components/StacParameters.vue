<script setup>
import {useConfig} from '@/stores/config.js'
const {metadata} = defineProps({
    metadata: {
        type: Object,
        default: null
    }
})
const config = useConfig()
const stacProperties = ['grid:code', 'product:type', 'platform', 'instrument',  'relative_orbit', 'orbit_state', 'instrument_mode','polarizations']
</script>
<template>
    <template v-for="key in stacProperties"> 
        <div  v-if="metadata[key]">
            <label :style="{color: config.state.primary}">{{ key.replace('_', ' ').replace(':', ' ') }}: </label> 
            <span >&nbsp;{{ metadata[key] }} </span>
        </div>
    </template>  
</template> 
<style scoped>
label {
    display:inline-block;
}
label:first-letter {
    text-transform: uppercase;
}
</style>