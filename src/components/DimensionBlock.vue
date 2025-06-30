<script setup>
import {computed} from 'vue'
import {useCatalog} from '@/stores/catalog'
const {aggregation} = defineProps({
    aggregation: {
        type: Object,
        default: null
    }
})
const catalog = useCatalog()
const dimensions = computed(() => {
    if (aggregation.key === 'groupOwner') {
        
    }
})
</script>
<template>
  <template v-for="dim in aggregation.buckets">
  {{dim}}
     <label><font-awesome-icon icon="fa-regular fa-square-check" />
     <font-awesome-icon icon="fa-regular fa-square" />
     </label>
     <div> {{dim.key}} </div>
     <div>({{dim.doc_count}})</div>
  </template>
</template>
<style>
</style>