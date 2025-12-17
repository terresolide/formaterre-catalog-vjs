<script setup>
  import { computed, defineAsyncComponent, reactive, watch, onMounted } from 'vue';
  import { useRoute, useRouter } from "vue-router"
  import { useElasticsearch } from '@/stores/elasticsearch';
  import { useSelection } from '@/stores/selection'
  import { useConfig } from '@/stores/config'
  import { useClient } from '@/stores/client'
  import { useUser } from '@/stores/user'
  import { useLoaderState} from '@/stores/loaderState.js'
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
    parent: null,
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
  const loader = useLoaderState()
  const access = computed(() => {
        if (!data.metadata) {
            // voir le sso pour le catalogue....
            
            // sinon
            client.setCurrent(null)
            return {view: 1, download: 1}
        }
        if (data.metadata.stac) {
            var stac = data.metadata.links.api.STAC
            var stacAccess = stac.access
            if (!stacAccess) {
                return {view:true, download:true}
            }
            if (!user.email) {
                getRecords(route)
                return {view: stacAccess.view === "free" ? 1 : -1, download: stacAccess.download === "free" ? 1: -1}
            }
            var acc = {view: user.hasRole(stacAccess.view), download: user.hasRole(stacAccess.download)}
            var url = new URL(stac.url)
            var cl = client.getSSO(url.hostname)
            if ( !cl ) {
                return acc
            }
            data.metadata.ssoId = cl.sso.getId()
            client.setCurrent(cl)
            // fusionne les droits d'accès et l'authentification
            if (cl.sso.getEmail()) {
                getRecords(route)
                return acc
            } else {
                getRecords(route)
                return {view: acc.view > 0 ? 0 : -1, download: acc.download > 0 ? 0 : -1 }
            } 
            
        }
        // cas Opensearch
        // sinon voir où indiquer la contrainte d'accès dans les métadonnées... dans constraints ce serait loguique!
        return {view: 1, download:1}
  })
  const tokenClientCurrent = computed(() => {
        var token = null
        if (client.current) {
            token = client.current.sso.getToken()
        }
        return token
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
      if (newroute.params.id) {
          if (!data.oldroute.params.id) {
              data.lastGrid = data.oldroute
              data.parent = null
          } else if (data.oldroute.params.id !== newroute.params.id) {
              data.parent = data.oldroute
          }
          getMetadata(newroute.params.id)
      } else {
          data.metadata = null
          data.bbox = null
          data.parent = null
          data.lastGrid = null
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
      loader.changeStateTrue()
      if (!data.converter) {
          getMetaConverter()
          .then(converter => {
              data.converter = converter.default()
              data.metadata = data.converter.transform(uuid, metadata)
              data.bbox = data.metadata.geojson
              if (!data.metadata.parentIdentifier) {
                  data.parent = null
              }
              getRecords(route.query)
          })
      } else {
            data.metadata = data.converter.transform(uuid, metadata)
            if (!data.metadata.parentIdentifier) {
                  data.parent = null
            }
            data.bbox = data.metadata.geojson
            getRecords(route.query)
      }
      // calcule l'accès pour les enfants??? ou dans computed???
  }
  function launchStac () {
     
      if (!data.stacRequester) {
          getStacRequester()
          .then(x => { 
               data.stacRequester = x.stacRequester
               getStacRecords()
          })
      } else {
          getStacRecords()
      }
  }
  function getStacRecords () {
      
      var stac = data.metadata.links.api.STAC
      // stac.query = Object.assign(stac.query, {'product:type': ['INTERFEROGRAM', 'TIMESERIE', 'AUXILIARYDATA']})
      // stac.query = Object.assign(stac.query, {'grid:code': ['BALKANS']})
      var requester = data.stacRequester(stac.url, stac.query, config.state.size, data.metadata.cds)
      loader.changeStateTrue()
      requester.getRecords(data.metadata, route, tokenClientCurrent.value)
      .then(json => { 
            if (json.list) {
              data.list = json.list
              data.pagination = Object.assign(data.pagination, json.pagination)
              data.bbox = null
            }
            data.aggregations = json.aggregations
            loader.changeStateFalse()
      }, err => {loader.changeStateFalse()})
  }
  function getMetadata(uuid) {
      if (!uuid) {
          data.metadata = null
          return
      }
      loader.changeStateTrue()
      elasticsearch.getMetadata(uuid)
      .then(meta => { 
          convert(uuid, meta)
      }, err => {loader.changeStateFalse()})
  }
  function close () {
    if (data.parent) {
        router.push(data.parent)
    } else if (data.lastGrid && data.lastGrid.name) {
        router.push(data.lastGrid)
    } else {
        router.push({name:'grid'})
    }
  }
  function getRecords (query) {
    if (data.metadata && data.metadata.stac && data.stacRequester) {
        launchStac()
        return
    }
    loader.changeStateTrue()
    elasticsearch.getRecords(query)
    .then(json => {
        if (json.list) {
          data.list = json.list
          data.pagination = Object.assign(data.pagination, json.pagination)
          data.bbox = null
        }
        
        loader.changeStateFalse()
        if (json.list.length === 0 && data.metadata ) {
           if (data.metadata.stac) {
            launchStac()
           } 

            return {}
        } else {
            return elasticsearch.treatmentAggregations(json.aggregations)
        }
    }, err => {
        loader.changeStateFalse()
    }).then(values => {
        mergeAggregations(values)
    })
  }
  function loginSelection() {
      
    client.getSsoFromId(selection.sso).sso.login()
    selection.setSSO(null)
    
  }
</script>

<template>
  <template v-if="selection.sso && !client.getSsoFromId(selection.sso).sso.getEmail()">
    <div   class="warning" >
        <div @click="selection.setSSO(null)" class="fmt-close" >
            <font-awesome-icon icon="fa-solid fa-remove" />
        </div>
        <div> {{$t('connect_to_sso', {sso: client.getSsoFromId(selection.sso).name})}}</div>
        <div style="text-align:right;"><button @click="loginSelection">{{$t('login')}}</button></div>
    </div>
  </template>
  <main>
    <FormGrid :aggregations="data.aggregations" :list="data.list" :bbox="data.bbox"></FormGrid>
    <template v-if="selection.download">
        <command-line :download="selection.download"></command-line>
    </template>
    <template v-if="route.params.id">
       <metadata-page :metadata="data.metadata" :access="access" @close="close">
            <div>
              <div style="text-align:center;margin:15px 0;">
                <PageNavigation :tot="data.pagination" :inside="true"></PageNavigation>
              </div>
              <MetadataList :list="data.list" :access="access" :ssoId="data.metadata.ssoId" :inside="true"></MetadataList>
            </div>
       </metadata-page>
    </template>
    <template v-else>
        <div class="grid-content">
          <div style="text-align:center;margin:15px 0;">
            <PageNavigation :tot="data.pagination"></PageNavigation>
          </div>
          <MetadataList :list="data.list" :access="access"></MetadataList>
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
div.warning {
    position:fixed;
    padding: 20px;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    text-align:left;
    font-size: 1.5em;
    border: 1px solid darkred;
    background: white;
    box-shadow: 2px 2px 2px 1px rgba(0, 0, 0, 0.5);
    z-index:100;
}
div.warning div.fmt-close {
   font-size: 1rem;
   position:absolute;
   right: 1px;
   top: 1px;
   padding:0 1px;
   line-height:1;
}
div.warning div.fmt-close:hover {
    border-color: darkred;
}
</style>
