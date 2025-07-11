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
    reset: false,
    oldroute: null,
    aggregations: []
  })
  const route = useRoute()
  function mergeAggregations (aggregations) {
    if (Object.keys(data.aggregations).length === 0 || data.reset) {
      data.aggregations = aggregations
      data.reset = false
      return aggregations
    }
    for (var key in aggregations) {
      if (data.aggregations[key]) {
        data.aggregations[key] = aggregations[key]
      } else {
        data.aggregations[key].category = []
      }
    }
    return data.aggregations

  }
  watch(() => route,
   (newroute) => {
      console.log('--- WATCH ROUTE DANS GRID VIEW ---')

      if (data.oldroute) {
        if (data.oldroute.name !== newroute.name || (newroute.params.catalog && newroute.params.catalog !== data.oldroute.params.catalog)) {
          console.log('--- RESET ---')
          data.reset = true

        }
      }
      data.oldroute = Object.assign({},newroute)
      elasticsearch.setCatalog(newroute.name, newroute.params.catalog)
      getRecords(newroute.query)
  }, {immediate: true, deep: true})
  onMounted(() => {
    console.log('--- ON MOUNTED  DANS GRID VIEW ---')
    // elasticsearch.setCatalog(route.name, route.params.catalog)
    // getRecords(route.query)
  })
  function getRecords (query) {

    elasticsearch.getRecords(query)
    .then(json => {
        if (json.hits && json.hits.hits) {
          data.list = json.hits.hits
          data.pagination.count = json.hits.hits.length
          data.pagination.total = json.hits.total.value
          data.pagination.relation = json.hits.total.relation
        }
        return elasticsearch.treatmentAggregations(json.aggregations)
    }).then(values => {
        mergeAggregations(values)
    })
  }
</script>

<template>
  <main>
    <FormGrid :aggregations="data.aggregations" :list="data.list"></FormGrid>
    <div class="grid-content">
      <div style="text-align:center;margin:15px 0;">
        <PageNavigation :tot="data.pagination"></PageNavigation>
      </div>
      <MetadataList :list="data.list"></MetadataList>
    </div>
  </main>
</template>
<style scoped>
div.grid-content {
  max-width: calc(100% - 330px);
  margin-left:330px;
}
</style>
