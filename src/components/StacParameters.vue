<script setup>

const {metadata} = defineProps({
    metadata: {
        type: Object,
        default: null
    }
})

const stacProperties = ['grid:code', 'product:type', 'platform', 'instrument',  'relative_orbit', 'orbit_state', 'instrument_mode','polarizations']
</script>
<template>
    <template v-for="key in stacProperties"> 
        <div  v-if="metadata[key]">
            <label>{{ key.replace('_', ' ').replace(':', ' ') }}: </label> 
            <span >&nbsp;{{ metadata[key] }} </span>
        </div>
    </template>  
</template> 
<style scoped>
label {
    display:inline-block;
    color:var(--color-text-primary);
}
label:first-letter {
    text-transform: uppercase;
}
</style>