<script setup>
import {computed, getCurrentInstance, onMounted,reactive, watch} from 'vue'
import {useRoute, useRouter} from 'vue-router'
import {useCatalog} from '@/stores/catalog'
import AggregationBlock from '@/components/AggregationBlock.vue'
const {name, aggregation, root, count} = defineProps({
    name: {
        type: String,
        default: null
    },
    aggregation: {
        type: Object,
        default: null
    },
    root: {
        type: Boolean,
        default: true
    },
    count: {
        type: Number,
        default: 0
    }
})
const route = useRoute()
const router = useRouter()
// const catalog = useCatalog()
const data = reactive({
    category: null,
    reset: false,
    initCount: 0,
    show: root
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
    var query = Object.assign({}, route.query)

    var find = selected.value.findIndex(v => v.indexOf(key) >= 0)
    if (find >= 0) {
        var tab = key.split('^')
        var sel = selected.value.filter(v => v.indexOf(key)< 0)
        if (tab.length === 1 && sel.length === 0) {
            delete query[name]

        } else {
            tab.pop()
            if (tab.length > 0) {
              sel.push(tab.join('^'))
            }
            query[name] = sel.join(',')
        }
    } else {
        // add to route
        if (selected.value.length > 0) {
            var tab = key.split('^')
            tab.pop()
            var sel = selected.value
            if (tab.length > 0) {
                // remove all key in selected which are contains in key
                var keyin = tab[0]
                for(var i=1; i < tab.length; i++) {
                    sel = sel.filter(v => keyin.indexOf(v) < 0)
                    keyin += '^' + tab[i]
                }
                sel = sel.filter(v => keyin.indexOf(v) < 0)

            }
            sel.push(key + '')

        } else {
            var sel = [key]
        }
        query[name] = sel.join(',')
    }
    router.push({name: route.name, params: route.params, query: query})

}

function resetCount (agg) {
    data.category.forEach(function (dim, index) {
        var find = agg.category.findIndex(v => v.key === dim.key)
        if (find < 0) {
          data.category[index].count = 0
          if (dim.category) {
            data.category[index].category = resetCategory(dim.category)
          }
        }
    })
}

function resetCategory(category) {
  category.forEach(function (dim, index) {
    category[index].count = 0
    if (dim.category) {
      category[index].category = resetCategory(dim.category)
    }

  })
  return category
}
function merge (agg) {
    if (root) {
      console.log(agg)
    }
    if (agg.reset || !data.category) {
         console.log('initialise aggregation')
         data.category = agg.category
         data.reset = false
    } else {
        // merge agg with data.aggregation
        data.reset = agg.reset
        resetCount(agg)
        if (root) {
          data.initCount = data.initCount + 1
        }
        /*    // init count
             data.aggregation.category.forEach(function (dim, index) {
               data.aggregation.category[index].count = 0
             })
            console.log('root = ' + root)
            var category = resetCategory(data.aggregation.category)
            category = mergeCategory(category, agg.category)
            console.log(category)
            data.aggregation.category = category
            data.initCount = data.initCount + 1
        */
        if (name === 'discipline') {
          console.log(agg)
        }
        agg.category.forEach(function(dim) {
            var index = data.category.findIndex(d => d.key === dim.key)
            if (name === 'discipline') {
              console.log(dim.label)
              console.log(dim.count)
            }
            if (index >= 0) {
                data.category[index] = dim
            } else {
                data.category.push(dim)
            }
        })
    }

    data.category.sort((a, b) => {
        if (a.label > b.label) {
            return 1
        }
        return -1
    })
    if (name === 'discipline') {
      console.log(data.category)
    }
}
watch(
    () => aggregation,
    agg => {
      merge(agg)
     // const instance = getCurrentInstance()
     // instance.proxy.forceUpdate()
    }
, {flush: 'pre', immediate: true, deep: true})
watch( route,
   (route, oldroute) => {
    if (oldroute.name !== route.name) {
        data.reset = true
    }
})
onMounted(() => {merge(aggregation)})
</script>
<template>
    <span v-if="!root" @click="data.show = !data.show" class="expand" >
        <template v-if="data.show">-</template>
        <template v-else>+</template>
    </span>
    <div v-if="data.category" v-for="dim in data.category" v-show="data.show" :key="dim.key" >
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
            <span v-if="dim.count" class="count">({{dim.count}})</span>
        </span>

        <template v-if="dim.category">
            <aggregation-block :name="name" :root="false" :count="data.initCount" :aggregation="dim"></aggregation-block>
        </template>

    </div>

</template>
<style scoped>
div {
    margin-left:10px;
    line-height:1.2;
}
span.expand {
    float: right;
    display:inline-block;
    width:14px;
    text-align:center;
    margin-right:9px;
    padding:0px;
    line-height:1;
    border-radius:2px;
    border:1px solid grey;
    cursor:pointer;
}
span.expand:hover {
    border-color:black;
}
span {
    display:inline-block;
}
div span.icon {
    width:20px;
}
label {
    margin-right:10px;
}
div span.count{
    color:#555;
}
</style>
