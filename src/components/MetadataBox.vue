<script setup>
import {computed} from 'vue'
import { useRoute,RouterLink} from 'vue-router'
import {useConfig} from '@/stores/config'
import {useCatalog} from '@/stores/catalog'
import {useElasticsearch} from '@/stores/elasticsearch'
import TemporalExtent from '@/components/TemporalExtent.vue'
import RelatedLinks from '@/components/RelatedLinks.vue'
let config = useConfig()
let catalogs = useCatalog()
let route = useRoute()
const props = defineProps({
    metadata: Object
})
const catalog = computed(() => {
    return catalogs.getCurrent()
})
const linkMetadata = computed(() => {
    var link = {name:'metadata', params: {id: props.metadata.id }}
    if (route.params.catalog) {
        link.name = 'catalog-metadata'
        link.params.catalog = route.params.catalog
    }
    return link
    
})
const elasticsearch = useElasticsearch()
function treatmentThesaurus (source) {
    var thesaurus = {}
    for(var step in elasticsearch.aggregations) {
       for (var key in elasticsearch.aggregations[step]) {
          if (elasticsearch.aggregations[step][key].meta.thesaurus) {
           var th = 'th_' + elasticsearch.aggregations[step][key].meta.thesaurus
        } else {
          var field = elasticsearch.aggregations[step][key].terms.field
          var tab = field.split('.')
          var th =  tab[0]
          
        }
        if (source[th] && source[th].forEach) {
            var label = elasticsearch.aggregations[step][key].meta.label
            if (elasticsearch.aggregations[step][key].meta.thesaurus) {
                var th = 'th_' + elasticsearch.aggregations[step][key].meta.thesaurus
            } else {
                var field = elasticsearch.aggregations[step][key].terms.field
                var tab = field.split('.')
                var th =  tab[0]
            }
            var lang = config.state.lang
            if (elasticsearch.aggregations[step][key].meta.label[lang]) {
              label = elasticsearch.aggregations[step][key].meta.label[lang]
            }
            thesaurus[th] = {label: label, values: source[th].map(x => config.tr(x))}
        }
       }
    }
    return thesaurus
}
function treatmentLinks (list, id) {
    var links = {}
    list.forEach((lk, index) => {
    switch(lk.protocol) {
        case 'OpenSearch':
        case 'SensorThings':
        case 'Sensorthings':
          links.api = {}
          links.api.http = lk.urlObject.default
          links.api.name = config.tr(lk.nameObject)
          break;
        case 'GetMap':
        case 'WTS':
        case 'OGC:WMS':
        case 'OGC:WMS-1.1.1-http-get-map':
        case 'OGC:WFS':
        case 'OGC:WFS-G':
        case 'OGC:KML':
        case 'OGC:OWS':
        case 'OGC:OWS-C':
        case 'OGC API - Tiles':
        case 'OGC Web Map Service':
        case 'GLG:KML-2.0-http-get-map':
            if (!links.layers) {
              links.layers = []
            }
            var idLayer =  id + '_' + links.layers.length 
            console.log(idLayer)
            links.layers.push({
                 id: idLayer,
                 uuid: id,
                 name: config.tr(lk.nameObject),
                 description: config.tr(lk.descriptionObject),
                 url:  config.tr(lk.urlObject),
                 type: lk.protocol,
                 checked: false
            })
           break;
        case 'application/vnd.google-earth.kml+xml':
           break;
        case 'WWW:DOWNLOAD-1.0-ftp--download':
            break;
        case 'WWW:DOWNLOAD-1.0-link--download':
        case 'WWW:DOWNLOAD-1.0-http--download':
        case 'download':
        case 'telechargement':
           if (!links.download) {
             links.download = []
           }
           var download = {
                 name:config.tr(lk.nameObject),
                 description: config.tr(lk.descriptionObject),
                 url: config.tr(lk.urlObject),
                 type: lk.protocol
           }
           
           links.download.push(download)
           break;
        case 'WWW:DOWNLOAD-1.0-link--order':
        case 'order':
           if (!links.order) {
             links.order = []
           }
           var download = {
                 name:config.tr(lk.nameObject),
                 description: config.tr(lk.descriptionObject),
                 url: config.tr(lk.urlObject),
                 type: lk.protocol
          }
          links.order.push(download)
           break;
        case 'UKST':
          
          //  if (link[6] && link[6].toLowerCase() === 'opensearch') {
          //    response.api = {}
          //    response.api.http = link[2]
          //    response.api.name = link[0].length > 0 ? link[0] : link[1]
          //  }
           break;
        case 'WWW:LINK-1.0-http--related':
           if (!links.relatedLinks) {
             links.relatedLinks = []
           }
           var link = {
                 name:config.tr(lk.nameObject),
                 description: config.tr(lk.descriptionObject),
                 url: config.tr(lk.urlObject),
                 type: lk.protocol
           }
           links.relatedLinks.push(link)
           break;
        case 'WWW:LINK-1.0-http--link':
        default:
           if (!links.links) {
             links.links = []
           }
           var link = {
                 name:config.tr(lk.nameObject),
                 description: config.tr(lk.descriptionObject),
                 url: config.tr(lk.urlObject),
                 type: lk.protocol
           }
           links.links.push(link)
           break;
      }
     })
     return links
   }
const metadata = computed(() => {
    return props.metadata
    let source = props.metadata._source
    let meta = {
         id: source.uuid, 
         title: config.tr(source.resourceTitleObject),
         catalogId: source.groupOwner,
         description: config.tr(source.resourceAbstractObject).replace('\n', '<br>')
    }
    
    if (source.cl_hierarchyLevel && source.cl_hierarchyLevel.length > 0) {
        meta.hierachyLevel = {
            icon: source.cl_hierarchyLevel[0].key === 'dataset' ? 'file' : 'folder-open',
            name: config.tr(source.cl_hierarchyLevel[0])
        }
    } else {
        meta.hierachyLevel = { icon: 'file', name: null}
    }
    meta.status = null
    if (source.cl_status && source.cl_status.length > 0) {
        meta.status = {
            key: source.cl_status[0].key,
            label: config.tr(source.cl_status[0])
        }
    }
    meta.quicklook = null
    if (source.overview && source.overview.length > 0) {
      meta.quicklook = {
          src: source.overview[0].url,
          title: source.overview[0].nameObject ? config.tr(source.overview[0].nameObject) : ''
      }
    }
    meta.temporalExtents = source.resourceTemporalExtentDetails
    meta.related = []
    if (source.link) {
        meta.related = source.link
    }
    // catalog
    meta.catalog = catalogs.getCatalogById(source.groupOwner)
    
    // fournisseur (on utilise distributor pour le moment)
    meta.provider = null
    if (source['th_formater-distributor']) {
        meta.provider = config.getProvider(source['th_formater-distributor'][0].link)
    }
    meta.thesaurus = treatmentThesaurus(source)
    meta.links = treatmentLinks(source.link, meta.id)
    return meta
})

</script>
<template>
    <div class="element-metadata-flex" >
        <router-link class="service-link" :to="linkMetadata" >
            <h3 :style="{background: config.state.emphasis}">
                <font-awesome-icon :icon="['fas', metadata.hierachyLevel.icon]" />
                <div >{{metadata.title}}</div>
            </h3>
        </router-link>
        <div class="element-description">
            <div v-if="metadata.quicklook || metadata.status" style="display:block;float:left;max-width:120px;text-align:center;">
                <img :src="metadata.quicklook.src" :title="metadata.quicklook.title" v-if="metadata.quicklook"/>
                 <div class="mtdt-status" v-if="metadata.status"  
                 :style="{color: config.state.primary, borderColor: config.state.primary}">
                    {{metadata.status.label}}
                 </div>
       
            </div>
            <temporal-extent v-for="extent in metadata.temporalExtents" :extent="extent"></temporal-extent>
            <div v-html="metadata.description"></div>
            <div v-for="item in metadata.thesaurus" >
                <label :style="{color: config.state.primary}">{{ item.label }}: </label> 
                <span v-for="value in item.values">{{ value }} </span>
            </div>
            
        </div>
        <div class="mtdt-footer">
            <div  class="mtdt-center">
                <template v-if="!catalog && metadata.catalog">
                  <router-link :to="{name: 'catalog-grid', params: {catalog: metadata.catalog.name.toLowerCase()}}" :title="metadata.catalog.name">
                    <img :src="config.state.api + '/images/harvesting/' + metadata.catalog.logo"   height="31" />
                  </router-link>
                </template>
                <template v-else-if="metadata.provider">
                   <a :href="metadata.provider.href" :title="metadata.provider.title[config.state.lang]" target="_blank">
                    <img :src="metadata.provider.logo"  />
                   </a>
                </template>
            </div>
            <div style="display:inline-block;text-align:right;vertical-align:middle;margin-right:4px;width:calc(100% - 100px);">
              <related-links :uuid="metadata.id" :links="metadata.links"></related-links></div>
        </div>
      
    </div>
</template>
<style scoped>
a.service-link {
    height:auto;
    margin:0;
    padding:0;
    }
div.mtdt-center {
    display:inline-block;
    width:90px;
    max-width:90px;
    text-align:left;
}
div.mtdt-center img {
    vertical-align:middle;
    max-height:31px;
    height:31px;
    max-width:80px;
    padding-bottom:1px;
}
div.element-metadata-flex {
  position:relative;
  display:block;
  /* width: auto;
  -webkit-box-flex: 1;
  -ms-flex: 1 1 250px;
  flex: 1 1 250px;
  
  max-height:550px;*/
  width: auto;
  -webkit-box-flex: 1;
  -ms-flex: 1 1 330px;
  flex: 1 1 330px;
  
  padding: 0px 10px 20px 10px;
  margin: 0 10px 20px;
  -webkit-box-shadow: 0 0px 3px rgba(0,0,0,0.5);
  box-shadow: 0 0px 3px rgba(0,0,0,0.5);
  position: relative;
  background: #fff;
  min-height:250px;
  max-height:250px;
  overflow:hidden;
  
  
  }
 div.element-metadata-flex h3 {
    margin: 0px -10px 0px -10px;
    padding: 5px;
    color: white;
    text-align: left;
    min-height:40px;
    max-height:40px;
    cursor: pointer;
    line-height:1;
    overflow: hidden;
    word-break: break-all;
  }
  div.element-metadata-flex > div:first-child {
      position:relative;
      overflow: hidden;
      /*padding: 20px;
      /*margin: 0 10px 20px;
      box-shadow: 0 0px 3px rgba(0,0,0,0.5);*/
  }
  div.element-metadata-flex  div.more-info {
   position:absolute;
   height: 30px;
  text-align: center;
  width: 100%;
  left: 0;
  bottom:0;
  background: #f9f9f9;
  padding: 3px 5px;
  vertical-align: middle;
  box-sizing: border-box;
  line-height: 130px;
  }
   div.element-metadata-flex  div.element-description{
    line-height: 1.1;
    text-align: justify;
    font-size: 0.9em;
    max-height:165px;
    overflow:hidden;
    padding: 5px;
    font-size:15px;
}

 div.element-metadata-flex div.element-description img {
  position: relative;
   max-width: 110px;
   max-height:130px;
   display:block;
   background: #ddd;
   margin: 0px 15px 3px 0;
}
 div.element-metadata-flex .mtdt-status {
     display:inline-block;
     padding:2px 5px;
     border:1px solid black;
     border-radius:3px;
     box-sizing:border-box;
     margin-right:10px;
     text-align:center;
     font-size:0.9em;
     background:#F3F3F3;
}
 div.element-metadata-flex  .mtdt-cartouche-elt{
   margin-bottom: 0px;
}
 div.element-metadata-flex  .mtdt-footer{

  position: absolute;
  margin: 0 2px;
  right:-5px;
  bottom:1px;
  width:100%;
  min-height: 28px;
  -webkit-box-sizing: content-box;
  box-sizing: content-box;
  background:white;
  overflow:visible;
}
 div.element-metadata-flex .mtdt-footer > div{
  display: inline-block;
}
 div.element-metadata-flex  .mtdt-footer .mtdt-group-logo img{
  max-width:80px;
  max-height:25px;
}

  div.element-metadata-flex  div.more-info a:hover {
    text-decoration:underline;
  }
 
   div.element-metadata-flex h3 svg {
        float:left;
        width:30px;
    }
     div.element-metadata-flex h3 div {
        float:left;
        width:calc(100% - 30px);
    }

</style>