<script setup>
import {computed, reactive, watch} from 'vue'
import {useRoute, useRouter} from 'vue-router'
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
const route = useRoute()
const router = useRouter()
const catalog = useCatalog()

const data = reactive({
    dimensions: {}
})
const dimensions = computed(() => {
    aggregation.category.sort((a, b) => {
        if (a.label > b.label) {
            return 1
        }
        return -1
    })
    return aggregation
    
})
const selected = computed(() => {
    if (!route.query[name]) {
        return []
    }
    return route.query[name].split(',')
})
function select(key) {
    console.log(selected)
    var query = Object.assign({}, route.query)
    if (selected.value.indexOf(key) >= 0) {
        // remove from route
        if (selected.value.length === 1) {
            delete query[name]
        } else {
            var sel = selected.value.filter(f => f.key != key)
            query[name] = sel.join(',')
        }
    } else {
        // add to route
        if (selected.value.length > 0) {
            var sel = selected.value
            sel.push(key)
            
        } else {
            var sel = [key]
        }
        query[name] = sel.join(',')
    }
    router.push({name: route.name, params: route.params, query: query})
    
}
watch(() => aggregation,
    agg => {
        if (agg.reset) {
            data.aggregation = aggregation
            data.aggregation.category.sort((a, b) => {
                if (a.label > b.label) {
                    return 1
                }
                return -1
            })
        } else {
            // merge agg avec data.aggregation
        }
})
</script>
<template>
    <div v-for="dim in dimensions.category" @click="select(dim.key)">
        <template v-if="selected.indexOf(dim.key) >=0">
            <font-awesome-icon icon="fa-regular fa-square-check" />
        </template>
        <template v-else>
            <font-awesome-icon icon="fa-regular fa-square" />
        </template>
        <label> {{dim.label}} </label>
        <div>({{dim.count}})</div>
    </div>
</template>
<style>
</style>