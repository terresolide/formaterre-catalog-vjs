<script setup>
  import { reactive } from 'vue'; 
  import { useElasticsearch } from '@/stores/elasticsearch';
  const elasticsearch = useElasticsearch()
  let data = reactive({
    list: [],
    aggregations: []
  })
  elasticsearch.getRecords({})
  .then(json => {
    data.aggregations = json.aggregations
  })
</script>

<template>
  <main>
    {{ data.aggregations }}
    <FormGrid :aggregations="aggregations"></FormGrid>
    <PageNavigation></PageNavigation>
    <MetadataList :list="list"></MetadataList>

  </main>
</template>
