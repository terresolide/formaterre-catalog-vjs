<script setup>
import {computed, onMounted,reactive, watch} from 'vue'
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
    aggregation: null,
    reset: false
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
            var sel = selected.value.filter(f => f != key)
            query[name] = sel.join(',')
        }
    } else {
        // add to route
        if (selected.value.length > 0) {
            var sel = selected.value
            sel.push(key + '')
            
        } else {
            var sel = [key]
        }
        query[name] = sel.join(',')
    }
    router.push({name: route.name, params: route.params, query: query})
    
}
function merge (agg) {
    if (agg.reset || !data.aggregation) {
         data.aggregation = agg
         data.reset = false
    } else {
        // merge agg with data.aggregation
        data.aggregation.reset = agg.reset
        data.aggregation.category.forEach(function (dim, index) {
            data.aggregation.category[index].count = 0
        })
        agg.category.forEach(function(dim) {
            var index = data.aggregation.category.findIndex(d => d.key === dim.key)
            if (index >= 0) {
                data.aggregation.category[index].count = dim.count
            } else {
                data.aggregation.category.push(dim)
            }
        })
    }

    data.aggregation.category.sort((a, b) => {
        if (a.label > b.label) {
            return 1
        }
        return -1
    })
}
watch(
    () => aggregation,
    agg => {merge(agg)}
)
watch( route,
   (route, oldroute) => {
    if (oldroute.name !== route.name) {
        data.reset = true
    }
})
onMounted(() => {merge(aggregation)})
</script>
<template>
    <div v-if="data.aggregation" v-for="dim in data.aggregation.category" @click="select(dim.key)">
        <span>
            <template v-if="selected.indexOf(dim.key) >=0">
                <font-awesome-icon icon="fa-regular fa-square-check" />
            </template>
            <template v-else>
                <font-awesome-icon icon="fa-regular fa-square" />
            </template>
        </span>
        <label> {{dim.label}} </label>
        <span>({{dim.count}})</span>
    </div>
</template>
<style scoped>
div {
    margin-left:10px;
}
span {
    display:inline-block;
}
div span:first-child {
    width:25px;
}
label {
    margin-right:10px;
}
div span:last-child {
    color:#555;
}
</style>