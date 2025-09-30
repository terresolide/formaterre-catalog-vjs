<script setup>
  import { computed, defineAsyncComponent, reactive, watch, onMounted } from 'vue';
  import { useRoute, useRouter } from "vue-router"
  import { useElasticsearch } from '@/stores/elasticsearch';
  import { useSelection } from '@/stores/selection'
  import { useConfig } from '@/stores/config'
  
  import { useClient } from '@/stores/client'
  import { useUser } from '@/stores/user'
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
    osRequester: null,
    reset: false,
    oldroute: {name: null, params: {}, query: {}},
    aggregations: [],
    metadata: null,
    stacRequester: null,
    lastGrid: null
  })
  const route = useRoute()
  const router = useRouter()
  const config = useConfig()
  const user = useUser()
  const client = useClient()
  const access = computed(() => {
        if (!data.metadata) {
            client.setCurrent(null)
            return null
        }
        if (data.metadata.stac) {
            var stac = data.metadata.links.api.STAC
            var stacAccess = stac.access
            if (!stacAccess) {
                return {view:true, download:true}
            }
            if (!user.email) {
                console.log('ici')
                return {view: stacAccess.view === "free" ? 1 : -1, download: stacAccess.download === "free" ? 1: -1}
            }
            console.log(stacAccess)
            if (user.email) {
                var acc = {view: user.hasRole(stacAccess.view), download: user.hasRole(stacAccess.download)}
                
            }
            var url = new URL(stac.url)
            var cl = client.getSSO(url.hostname)
            if ( !cl ) {
                return acc
            }
            
             // afficher le client courrant auquel se connecter
            client.setCurrent(cl)
           
            console.log(cl)
        }
        return {view: 1, download:1}
  })
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
     
     
      elasticsearch.setCatalog(newroute.name, newroute.params.catalog, newroute.params.id)
      if (newroute.params.id && (!data.oldroute.params.id || data.oldroute.params.id !== newroute.params.id)) {
           data.lastGrid = data.oldroute
          getMetadata(newroute.params.id)
      } else {
         
          if (!newroute.params.id) {
              data.metadata = null
              data.bbox = null
             
          }
          getRecords(newroute.query)
      }
       data.oldroute = Object.assign({},newroute)
  }, {immediate: true, deep: true})
  onMounted(() => {
    console.log('--- ON MOUNTED  DANS GRID VIEW ---')
    // elasticsearch.setCatalog(route.name, route.params.catalog)
    // getRecords(route.query)
    
  })
  function convert (uuid, metadata) {
      if (!data.converter) {
          getMetaConverter()
          .then(converter => {
              data.converter = converter.default()
              data.metadata = data.converter.transform(uuid, metadata)
              data.bbox = data.metadata.geojson
              getRecords(route.query)
          })
      } else {
            data.metadata = data.converter.transform(uuid, metadata)
            data.bbox = data.metadata.geojson
            getRecords(route.query)
      }
      // calcule l'accès pour les enfants??? ou dans computed???
  }
  function launchStac () {
      if (!data.stacRequester) {
          getStacRequester()
          .then(x => { 
              console.log(x)
               data.stacRequester = x.stacRequester
               getStacRecords()
          })
      } else {
          getStacRecords()
      }
  }
  function getStacRecords () {
      var stac = data.metadata.links.api.STAC
      stac.query = Object.assign(stac.query, {'product:type': ['INTERFEROGRAM', 'TIMESERIE', 'AUXILIARYDATA']})
      var requester = data.stacRequester(stac.url, stac.query, config.state.size, data.metadata.cds)
      requester.getRecords(data.metadata, route)
      .then(json => { 
            if (json.list) {
              console.log(json.list)
              data.list = json.list
              data.pagination = Object.assign(data.pagination, json.pagination)
              data.bbox = null
            }
            console.log(json.aggregations)
            data.aggregations = json.aggregations
      })
  }
  function getMetadata(uuid) {
      if (!uuid) {
          data.metadata = null
          return
      }
      elasticsearch.getMetadata(uuid)
      .then(meta => { convert(uuid, meta)})
  }
  function close () {
    console.log(data.lastGrid)
    if (data.lastGrid) {
        router.push(data.lastGrid)
    } else {
        router.push({name:'grid'})
    }
  }
  function getRecords (query) {
    console.log(data.metadata)
    if (data.metadata && data.metadata.stac && data.stacRequester) {
        launchStac()
        return
    }
    elasticsearch.getRecords(query)
    .then(json => {
        if (json.list) {
          console.log(json.list)
          data.list = json.list
          data.pagination = Object.assign(data.pagination, json.pagination)
          data.bbox = null
        }
        if (json.list.length === 0 && data.metadata && data.metadata.stac) {
            launchStac()

            return {}
        } else {
            return elasticsearch.treatmentAggregations(json.aggregations)
        }
    }).then(values => {
        mergeAggregations(values)
    })
  }
</script>

<template>
  <main>
  {{access}}
    <FormGrid :aggregations="data.aggregations" :list="data.list" :bbox="data.bbox"></FormGrid>
    <template v-if="selection.download">
        <command-line :download="selection.download"></command-line>
    </template>
    <template v-if="route.params.id">
       <metadata-page :metadata="data.metadata" @close="close">
            <div>
              <div style="text-align:center;margin:15px 0;">
                <PageNavigation :tot="data.pagination" :inside="true"></PageNavigation>
              </div>
              <MetadataList :list="data.list" :access="access" :inside="true"></MetadataList>
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
<style>

</style>
<style scoped>
div.grid-content {
  max-width: calc(100% - 330px);
  margin-left:330px;
}

</style>
