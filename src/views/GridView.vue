<script setup>
  import { reactive, watch, onMounted } from 'vue'; 
  import { useRoute } from "vue-router"
  import { useElasticsearch } from '@/stores/elasticsearch';
  import MetadataList from '@/components/MetadataList.vue'
  const elasticsearch = useElasticsearch()
  let data = reactive({
    list: [],
    aggregations: []
  })
  const route = useRoute()
  watch(route, () => {
    console.log('routechange')
    if (route.params.id) {
      elasticsearch.setCatalog(newvalue.name, newvalue.params.id)
    }
    getRecords(route.query)
  })
  onMounted(() => {
    console.log('mounted')
    console.log(route)
    elasticsearch.setCatalog(route.name, route.params.id)
    getRecords(route.query)
  })
  function getRecords (query) {
    elasticsearch.getRecords(query)
    .then(json => {
      data.aggregations = json.aggregations
      if (json.hits && json.hits.hits) {
        data.list = json.hits.hits
      }
    })
  }
</script>

<template>
  <main>
    <!--<FormGrid :aggregations="aggregations"></FormGrid>
    <PageNavigation></PageNavigation> -->
    <MetadataList :list="data.list"></MetadataList>

  </main>
</template>
