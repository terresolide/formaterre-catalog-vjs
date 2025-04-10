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

    elasticsearch.setCatalog(route.name, route.params.catalog)

    getRecords(route.query)
  })
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
