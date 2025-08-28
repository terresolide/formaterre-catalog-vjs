<script setup>
  import { defineAsyncComponent, reactive, watch, onMounted } from 'vue';
  import { useRoute, useRouter } from "vue-router"
  import { useElasticsearch } from '@/stores/elasticsearch';
  import { useSelection } from '@/stores/selection'
  import MetadataList from '@/components/MetadataList.vue'
  import FormGrid from '@/components/FormGrid.vue'
  import PageNavigation from '@/components/PageNavigation.vue'
  import MetadataPage from '@/components/MetadataPage.vue'
  const getMetaConverter = () => import('@/modules/metadataConverter.js') 
  const getStacRequester = () => import('@/modules/stacRequester.js')
  const CommandLine = defineAsyncComponent(() => import('@/components/CommandLine.vue'))
  const selection = useSelection()
  const elasticsearch = useElasticsearch()
  let data = reactive({
    list: [],
    bbox: null,
    pagination: {
      count: 0,
      total: 0
    },
    converter: null,
    reset: false,
    oldroute: null,
    aggregations: [],
    metadata: null,
    stacRequester: null
  })
  const route = useRoute()
  const router = useRouter()
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
      elasticsearch.setCatalog(newroute.name, newroute.params.catalog, newroute.params.id)
      if (newroute.params.id) {
          getMetadata(newroute.params.id)
      } else {
          getRecords(newroute.query)
      }
  }, {immediate: true, deep: true})
  onMounted(() => {
    console.log('--- ON MOUNTED  DANS GRID VIEW ---')
    // elasticsearch.setCatalog(route.name, route.params.catalog)
    // getRecords(route.query)
    
  })
  
  function getMetadata(uuid) {
      if (!uuid) {
          data.metadata = null
          return
      }
      elasticsearch.getMetadata(uuid)
      .then(meta => {
          console.log(meta)
          getMetaConverter()
          .then(converter => {
              data.converter = converter.default()
              data.metadata = data.converter.transform(uuid, meta)
              console.log(data.metadata)
              data.bbox = data.metadata.geojson
              if (data.metadata.links.api && data.metadata.links.api.STAC) {
                  var access = data.metadata.links.api.STAC.access
                  var query = data.metadata.links.api.STAC.query
                  getStacRequester()
                  .then(x => {
                      data.stacRequester = x.default(data.metadata.links.api.STAC.url, query, 12, data.metadata.cds)
                      data.stacRequester.getRecords(route)
                      .then(json => { 
                            if (json.list) {
                              console.log(json.list)
                              data.list = json.list
                              data.pagination = Object.assign(data.pagination, json.pagination)
                              data.bbox = null
                            }
                      })
                  })
              }
              
              
           })
          
      })
  }
  function close () {
    // enregistrer la dernière page grid...
    let lastPath = router.options.history.state.back;
    if (lastPath) {
        router.back()
    } else {
        router.push({name:'grid'})
    }
  }
  function getRecords (query) {

    elasticsearch.getRecords(query)
    .then(json => {
        console.log(json)
        if (json.list) {
          console.log(json.list)
          data.list = json.list
          data.pagination = Object.assign(data.pagination, json.pagination)
          data.bbox = null
        }
        return elasticsearch.treatmentAggregations(json.aggregations)
    }).then(values => {
        mergeAggregations(values)
    })
  }
</script>

<template>
  <main>
    <FormGrid :aggregations="data.aggregations" :list="data.list" :bbox="data.bbox"></FormGrid>
    <template v-if="selection.download">
        <command-line :download="selection.download"></command-line>
    </template>
    <template v-if="route.params.id">
       <metadata-page :metadata="data.metadata" @close="close">
            <div>
              <div style="text-align:center;margin:15px 0;">
                <PageNavigation :tot="data.pagination"></PageNavigation>
              </div>
              <MetadataList :list="data.list" :inside="true"></MetadataList>
            </div>
       </metadata-page>
    </template>
    <template v-else>
        <div class="grid-content">
          <div style="text-align:center;margin:15px 0;">
            <PageNavigation :tot="data.pagination"></PageNavigation>
          </div>
          <MetadataList :list="data.list"></MetadataList>
        </div>
    </template>
  </main>
</template>
<style scoped>
div.grid-content {
  max-width: calc(100% - 330px);
  margin-left:330px;
}
</style>
