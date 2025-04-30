<script setup>
  import { reactive, watch, onMounted } from 'vue'; 
  import { useRoute } from "vue-router"
  import { useElasticsearch } from '@/stores/elasticsearch';
  import MetadataList from '@/components/MetadataList.vue'
  import FormGrid from '@/components/FormGrid.vue'
  import PageNavigation from '@/components/PageNavigation.vue'
  const elasticsearch = useElasticsearch()
  let data = reactive({
    list: [],
    pagination: {
      count: 0,
      total: 0
    },
    aggregations: []
  })
  const route = useRoute()
  watch(  route,
   (route) => {
    elasticsearch.setCatalog(route.name, route.params.catalog)
    getRecords(route.query)
  }, {flush: 'pre', immediate: true, deep: true})
  onMounted(() => {
    elasticsearch.setCatalog(route.name, route.params.catalog)
    getRecords(route.query)
  })
  function getRecords (query) {
    elasticsearch.getRecords(query)
    .then(json => {
      data.aggregations = json.aggregations
      if (json.hits && json.hits.hits) {
        data.list = json.hits.hits
        data.pagination.count = json.hits.hits.length
        data.pagination.total = json.hits.total.value
        data.pagination.relation = json.hits.total.relation
      }
    })
  }
</script>

<template>
  <main>
    <FormGrid :aggregations="aggregations"></FormGrid> 
    <div class="grid-content">
    <div style="text-align:center;margin:15px 0;"><PageNavigation :tot="data.pagination"></PageNavigation> </div>
    <MetadataList :list="data.list"></MetadataList>
    </div>
  </main>
</template>
<style scoped>
div.grid-content {
  
  max-width: calc(100% - 270px);
  margin-left:270px;
}
</style>
