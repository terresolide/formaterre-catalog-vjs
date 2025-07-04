<script setup>
import {computed, onMounted,reactive, watch} from 'vue'
import {useRoute, useRouter} from 'vue-router'
import {useCatalog} from '@/stores/catalog'
import AggregationBlock from '@/components/AggregationBlock.vue'
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

const selected = computed(() => {
    if (!route.query[name]) {
        return []
    }
    return route.query[name].split(',')
})
const uris = computed(() => {
     if (!route.query[name]) {
        return []
    }
    return route.query[name].split(/,|\^/)
})
function select(key) {
    console.log(selected)
    var query = Object.assign({}, route.query)
   
    var find = selected.value.findIndex(v => v.indexOf(key) >= 0)
    console.log('index est ' + find)
    if (find >= 0) {
        var tab = key.split('^')
        var sel = selected.value.filter(v => v.indexOf(key)< 0)
        console.log(sel)
        if (tab.length === 1 && sel.length === 0) {
            delete query[name]
            
        } else {
            tab.pop()
            sel.push(tab.join('^'))
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
    <div v-if="data.aggregation" v-for="dim in data.aggregation.category" :key="dim.key" >
        <span @click="select(dim.key)">
            <span class="icon">
                <template v-if="uris.includes(dim.uri)">
                    <font-awesome-icon icon="fa-regular fa-square-check" />
                </template>
                <template v-else>
                    <font-awesome-icon icon="fa-regular fa-square" />
                </template>
            </span>
            <label>{{dim.label}}</label>
            <span v-if="dim.count">({{dim.count}})</span>
        </span>
        <template v-if="dim.category">
            <aggregation-block :name="name" :aggregation="dim"></aggregation-block>
        </template>
        
    </div>
 
</template>
<style scoped>
div {
    margin-left:10px;
}
span {
    display:inline-block;
}
div span.icon {
    width:25px;
}
label {
    margin-right:10px;
}
div span:last-child {
    color:#555;
}
</style>