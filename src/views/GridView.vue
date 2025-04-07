<script setup>
  import { reactive } from 'vue'; 
  import { useElasticsearch } from '@/stores/elasticsearch';
  import MetadataList from '@/components/MetadataList.vue'
  const elasticsearch = useElasticsearch()
  let data = reactive({
    list: [],
    aggregations: []
  })
  elasticsearch.getRecords({})
  .then(json => {
    data.aggregations = json.aggregations
    if (json.hits && json.hits.hits) {
      data.list = json.hits.hits
    }
  })
</script>

<template>
  <main>
    <!--<FormGrid :aggregations="aggregations"></FormGrid>
    <PageNavigation></PageNavigation> -->
    <MetadataList :list="data.list"></MetadataList>

  </main>
</template>
