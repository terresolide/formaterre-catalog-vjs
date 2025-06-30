<script setup>
  import { ref, reactive, watch, onMounted } from 'vue'; 
  import { useRoute, useRouter } from "vue-router"
  import { useConfig } from "@/stores/config.js"
  import MapBox from '@/components/MapBox.vue'
  import SearchBox from '@/components/SearchBox.vue'
  import SpatialSearch from '@/components/SpatialSearch.vue'
  import TemporalSearch from '@/components/TemporalSearch.vue'
  import AggregationBlock from '@/components/AggregationBlock.vue'
  import DimensionBlock from '@/components/DimensionBlock.vue'
  const config = useConfig()
  const route = useRoute()
  const router = useRouter()
  const props = defineProps({
    aggregations: Object,
    list: Array
  })

  // daymin et daymax à récupérer (depend du catalogue ou bien de la série parent....)
 const daymin = '2020-05-10'
 const daymax = null
 const data = reactive({
     any: null
 })
 function initFromQuery (query) {
    if (query.any) {
        data.any = query.any
    } else {
        data.any = null
    }
 }
 function reset () {
    if (route.query && Object.keys(route.query).length > 0) { 
        router.push({name: route.name, params: route.params})
    }
 }
 function textChange(e) {
    console.log(e)
    console.log(data.any)
    var query = Object.assign({}, route.query)
    if (data.any) {
        query.any = data.any
    } else {
        delete query.any
    }
    router.push({name: route.name, params: route.params, query:query})
 }
 watch(() => route.query,
       (query) => {initFromQuery(query)}
 )
 onMounted(() => {initFromQuery(route.query) })
</script>

<template>
  <aside>
  <div class="center"><button @click="reset" :style="{background: config.state.primary}">{{$t('reset')}}</button></div>
   <div class="formater-input-group" style="margin: 10px; width: calc(100% - 20px); " :style="{backgroundColor: config.state.lightcolor}">
    <input name="any" v-model="data.any" :placeholder="$t('search')  + '...'" @change="textChange">
    <font-awesome-icon icon="fa-solid fa-search"/></div>
   <map-box :list="props.list"></map-box>
   <div style="height:calc(100% - 300px);overflow-y:scroll;">
       <search-box :color="config.state.primary" header-icon-class="fa-solid fa-earth-americas" type="light" :title="$t('spatial_extent')">
            <spatial-search :lang="config.state.lang" :primary="config.state.primary" :color="config.state.lightcolor"></spatial-search> 
       </search-box>
       <search-box :color="config.state.primary" header-icon-class="fa-solid fa-calendar" type="light" :title="$t('time_slot')">
         <temporal-search :lang="config.state.lang" :color="config.state.lightcolor" :day-min="daymin" :day-max="daymax"></temporal-search>  
       </search-box>
       <template v-for="agg in props.aggregations">
      
          <search-box :color="config.state.primary" :header-icon-class="agg.meta.icon" type="light" :title="agg.meta.label[config.state.lang] || agg.meta.label">
                <template v-if="agg.meta.type === 'dimension'">
                   <dimension-block :aggregation="agg" />
                </template>
                <template v-else>
                    <aggregation-block :aggregation="agg"></aggregation-block>
                </template>
         </search-box>
       </template>
   </div>
  </aside>
</template>
<style scoped>
aside {
  max-width:330px;
  width:330px;
  height:calc(100vh - 100px);
  max-height:calc(100vh - 100px);
  float:left;
  border:1px solid grey;
  padding: 10px 0px 0px 0px;
  border: 1px solid #ccc;
  box-shadow: 1px 1px 1px 2px rgba(0, 0, 0, 0.1);
}

.formater-input-group input[name="any"] {
  line-height: 35px;
  height: 35px;
  width: calc(100% - 40px);
}
.formater-input-group input {
  border: none;
  background-color: transparent;
  padding: 0 10px;
  outline: none;
}
</style>