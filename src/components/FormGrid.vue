<script setup>
  import { ref, reactive, watch, onMounted } from 'vue'; 
  import { useRoute } from "vue-router"
  import { useConfig } from "@/stores/config.js"
  import MapBox from '@/components/MapBox.vue'
  import SearchBox from '@/components/SearchBox.vue'
  import SpatialSearch from '@/components/SpatialSearch.vue'
  import TemporalSearch from '@/components/TemporalSearch.vue'
  const config = useConfig()
  const props = defineProps({
    aggregations: Object,
    list: Array
  })

  


</script>

<template>
  <aside>
   <div class="formater-input-group" style="margin: 10px; width: calc(100% - 20px); " :style="{backgroundColor: config.state.lightcolor}"><input id="any" name="any" :placeholder="$t('search')  + '...'">
    <font-awesome-icon icon="fa-solid fa-search"/></div>
   <map-box :list="props.list"></map-box>
   <search-box :color="config.state.primary" header-icon-class="fa-solid fa-earth-americas" type="light" :title="$t('spatial_extent')">
        <spatial-search :lang="config.state.lang" :color="config.state.lightcolor"></spatial-search> 
   </search-box>
   <search-box :color="config.state.primary" header-icon-class="fa-solid fa-calendar" type="light" :title="$t('time_slot')">
     <temporal-search :lang="config.state.lang" :color="config.state.lightcolor"></temporal-search> --> 
   </search-box>

  </aside>
</template>
<style scoped>
aside {
  max-width:330px;
  width:330px;
  float:left;
  border:1px solid grey;
  padding: 0px 0px 0px 0px;
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