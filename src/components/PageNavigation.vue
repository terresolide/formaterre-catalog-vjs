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
    nb: 30
})
const from = computed(() => {
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

// const config.state.size.value = computed(() => {
//   return parseInt(config.state.size)
// })

function changeRoute(query) {
  router.push({name: route.name, params: route.params, query:query})
}
function first () {
  var query = Object.assign({}, route.query)
  query.from = 1
  query.to = query.from + parseInt(config.state.size) - 1
  changeRoute(query)
}
function previous () {
  console.log('previous')
  var query = Object.assign({}, route.query)
  var index = from.value - parseInt(config.state.size)
  query.from = index > 0 ? index : 1
  query.to =  query.from + parseInt(config.state.size) - 1
  changeRoute(query)
}
function next () {
  var query = Object.assign({}, route.query)
  console.log(config.state.size)
  query.from = to.value + 1
  query.to = query.from + parseInt(config.state.size) - 1
  changeRoute(query)

}
function last () {
  var query = Object.assign({}, route.query)
  var nbpage = Math.floor(pagination.tot.total / parseInt(config.state.size)) + (pagination.tot.total % parseInt(config.state.size) === 0 ? 1 : 0)
  query.from = nbpage * parseInt(config.state.size) + 1
  query.to = query.from + parseInt(config.state.size) - 1
  changeRoute(query)
}
function pagingChange() {
  var query = Object.assign({}, route.query)
  if (!query.from) {
    query.from = 1
  }
  query.to = parseInt(query.from) + parseInt(config.state.size) - 1
  changeRoute(query)
}
function sortChange() {
  var query = Object.assign({}, route.query)
  query.sortBy = config.state.sortBy
  changeRoute(query)
}
</script>
<template>
  <div style="max-width:1900px;text-align:center;">
      <div class="paging">
        <span class="mini-button" :class="{disabled: from === 1}" :style="{background: config.state.primary}" @click="first">&laquo;</span>
        <span class="mini-button" :class="{disabled: from === 1}" :style="{background: config.state.primary}" @click="previous">&lsaquo;</span>
       {{$t('results')}}: <b>{{ from }}</b> {{$t('to')}} <b>{{ to }}</b> {{$t('among')}} {{ pagination.tot.total }}
        &nbsp; (<select v-model="config.state.size" @change="pagingChange">
          <option value="24">24 {{$t('per')}} page</option>
          <option value="30">30 {{$t('per')}} page</option>
          <option value="100">100 {{$t('per')}} page</option>
        </select>) &nbsp;
        <span class="mini-button" :class="{disabled: to >= pagination.tot.total}" :style="{background: config.state.primary}" @click="next">&rsaquo;</span>
        <span class="mini-button" :class="{disabled: to >= pagination.tot.total}" :style="{background: config.state.primary}" @click="last">&raquo;</span>
      </div>
      <div class="order-by">
        {{$t('sort_by')}} <select v-model="config.state.sortBy" @change="sortChange">
            <option value="popularity">{{$t('popularity')}}</option>
            <option value="changeDate">{{$t('update')}}</option>
          </select>
      </div>
  </div>
</template>
<style scoped>
div.paging {
  display:inline-block;
  width: calc(100% - 200px);
}
div.order-by {
  display:inline-block;
  width:180px;
}
.paging span.mini-button {
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
