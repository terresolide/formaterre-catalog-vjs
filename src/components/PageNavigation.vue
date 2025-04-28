<script setup>
import {computed, reactive} from 'vue';
import { useRoute, useRouter} from 'vue-router'
import {useConfig} from '@/stores/config';
const props = defineProps({
    from: {
      type:Number,
      default: 0
    },
    count: {
      type:Number,
      default: 3
    },
    total: {
      type:Number,
      default: 0
    }
})
let config = useConfig()
const route = useRoute()
const router = useRouter()

const data = reactive({
    offset: 0,
    nb: 24,
    total: null
})
const from = computed(() => {return data.offset + 1})
const to = computed(() => {return data.offset + 2})

function changeRoute(query) {
  router.push({name: route.name, params: route.params, query:query})
}
function first () {
  var query = Object.assign({}, route.query)
  query.index = 1
  query.nb = data.nb
  changeRoute(query)
}
function previous () {

}
function next () {

}
function last() {

}
function pagingChange() {

}
</script>
<template>
      <div class="paging">
        <span :class="{disabled: data.offset=== 0}" :style="{background: config.state.primary}" @click="first">&laquo;</span>
        <span :class="{disabled: data.offset=== 0}" :style="{background: config.state.primary}" @click="previous">&lsaquo;</span>
       Results: <b>{{ from }}</b> to <b>{{ to }}</b> among {{ data.total }}
        &nbsp; (<select v-model="data.nb" @change="pagingChange">

          <option value="30">24 per page</option>
          <option value="100">30 per page</option>
        </select>) &nbsp;
        <span  :class="{disabled: to >= data.total}" :style="{background: config.state.primary}" @click="next">&rsaquo;</span>
        <span  :class="{disabled: to >= data.total}" :style="{background: config.state.primary}" @click="last">&raquo;</span>
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
