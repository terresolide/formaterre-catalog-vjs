<script setup>
import {computed, reactive} from 'vue'
import {useCatalog} from '@/stores/catalog'
const {name, aggregation} = defineProps({
    name: {
        type: String,
        default: null
    },
    aggregation: {
        type: Object,
        default: null
    }
})
const catalog = useCatalog()
const dimensions = computed(() => {
    if (name === 'groupOwner') {
        return catalog.list.sort((a, b) => {
            if (a.name > b.name) {
                return 1
            }
            return -1
        })
    } else {
        return aggregation
    }
})
</script>
<template>
 {{dimensions}}
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