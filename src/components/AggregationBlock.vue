<script setup>
import {computed, getCurrentInstance, onMounted,reactive, watch} from 'vue'
import {useRoute, useRouter} from 'vue-router'
import {useCatalog} from '@/stores/catalog'
import AggregationBlock from '@/components/AggregationBlock.vue'
const {name, aggregation, root, comparator } = defineProps({
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
    comparator: {
        type: String,
    }
})
const route = useRoute()
const router = useRouter()
// const catalog = useCatalog()
const data = reactive({
    category: null,
    reset: false,
    initCount: 0,
    isOr: true,
    oldroute: null,
    show: root
})

const selected = computed(() => {
    if (!route.query[name]) {
        return []
    }

    return route.query[name].split(/,|\+|%2B/)
})
const logicalComparator = computed(() => {
  if (root) {
    return data.isOr ? 'or' : 'and'
  } else {
    return  comparator
  }

})
const uris = computed(() => {
     if (!route.query[name]) {
        return []
    }
    return route.query[name].split(/,|\^|%2B|\+/)
})
function changeComparator() {
  var query = Object.assign({}, route.query)
  var comp = data.isOr ? ',' : '+'
  var oldComp = data.isOr ? '+' : ','
  if (query[name]) {
    query[name] = query[name].replace(oldComp, comp)
    router.push({name: route.name, params: route.params, query: query})
  }
}
function select(key) {
    var query = Object.assign({}, route.query)
    var comp = logicalComparator.value === 'or' ? ',' : '+'
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
            query[name] = sel.join(comp)
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
        query[name] = sel.join(comp)
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

    if ( !data.category ||
        (data.oldroute &&
        (data.oldroute.name !== route.name || (route.params.catalog && route.params.catalog !== data.oldroute.params.catalog))
        )) {
        // console.log('initialise aggregation')
         data.category = agg.category
    } else {
        // merge agg with data.aggregation
        resetCount(agg)

        agg.category.forEach(function(dim) {
            var index = data.category.findIndex(d => d.key === dim.key)
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
}
watch(
    () => aggregation,
    agg => {
      merge(agg)
      data.oldroute = Object.assign({},route)
    }
, {flush: 'pre', immediate: true, deep: true})
/** watch( route,
   (route) => {
    if (oldroute && (oldroute.name !== route.name || route.params.catalog !== oldroute.params.catalog)) {
        data.reset = true
    }
})*/
onMounted(() => {
  data.isOr = true
  if (root && route.query[name]) {
    data.isOr = route.query[name].indexOf(',') >= 0
  }

})
</script>
<template>
    <span v-if="!root" @click="data.show = !data.show" class="expand" >
        <template v-if="data.show">-</template>
        <template v-else>+</template>
    </span>
    <template v-if="root">
      <div class="comparator">
        <span><input type="radio" v-model="data.isOr" :value="true"  @change="changeComparator"/> {{$t('or')}} </span>
        <span><input type="radio" v-model="data.isOr" :value="false" @change="changeComparator" /> {{$t('and')}}</span>
      </div>
    </template>

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
            <aggregation-block :name="name" :root="false" :comparator="data.comparator" :aggregation="dim"></aggregation-block>
        </template>

    </div>

</template>
<style scoped>
div.comparator {
  text-align:center;
}
div.comparator span {
  display:inline-block;
  margin: 5px 10px 5px 5px;
}
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
