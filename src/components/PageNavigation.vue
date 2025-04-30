<script setup>
import {computed, reactive} from 'vue';
import { useRoute, useRouter} from 'vue-router'
import {useConfig} from '@/stores/config';
const pagination = defineProps({tot: Object})
let config = useConfig()
const route = useRoute()
const router = useRouter()

const data = reactive({
    offset: 0,
    nb: 24,
    total: null
})
const from = computed(() => {
  console.log(route)
  if (route.query.from) {
    return parseInt(route.query.from)
  } else {
    return data.offset + 1
  }
})
const to = computed(() => {
  console.log(from)
  console.log(pagination.tot.count)
  return from.value + pagination.tot.count - 1 
})

function changeRoute(query) {
  router.push({name: route.name, params: route.params, query:query})
}
function first () {
  var query = Object.assign({}, route.query)
  query.from = 1
  query.to = query.from + data.nb - 1
  changeRoute(query)
}
function previous () {
  var query = Object.assign({}, route.query)
  var index = from.value - data.nb 
  query.from = index > 0 ? index : 1
  query.to =  query.to = query.from + data.nb - 1
  
}
function next () {
  var query = Object.assign({}, route.query)

  query.from = to.value + 1
  query.to = query.from + parseInt(data.nb) - 1
  changeRoute(query)

}
function last () {
  var query = Object.assign({}, route.query)
  var nbpage = Math.floor(pagination.tot.total / data.nb) + (pagination.tot.total % data.nb === 0 ? 1 : 0)
  query.from = nbpage * data.nb + 1
  query.to = query.from + data.nb - 1

}
function pagingChange() {

}
</script>
<template>
  {{from}}
      <div class="paging">
        <span :class="{disabled: from === 1}" :style="{background: config.state.primary}" @click="first">&laquo;</span>
        <span :class="{disabled: from === 1}" :style="{background: config.state.primary}" @click="previous">&lsaquo;</span>
       Results: <b>{{ from }}</b> to <b>{{ to }}</b> among {{ pagination.tot.total }}
        &nbsp; (<select v-model="data.nb" @change="pagingChange">
          <option value="24">24 per page</option>
          <option value="30">30 per page</option>
          <option value="100">100 per page</option>
        </select>) &nbsp;
        <span  :class="{disabled: to >= pagination.tot.total}" :style="{background: config.state.primary}" @click="next">&rsaquo;</span>
        <span  :class="{disabled: to >= pagination.tot.total}" :style="{background: config.state.primary}" @click="last">&raquo;</span>
      </div>
</template>
<style scoped>
.paging span {
  font-size: 1.2em;
  cursor: pointer;
  margin: 0 1px;
  padding: 5px;
  cursor: pointer;
  border-radius: 3px;
  background: #cc852a;
  padding: 2px 5px;
  color: white;
  vertical-align: middle;
  opacity: 0.9;
}
.paging span:hover {
    opacity:1;
}
.paging span.disabled {
  opacity: 0.3;
  cursor: not-allowed;
}
</style>
