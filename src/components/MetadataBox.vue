<script setup>
import {computed} from 'vue'
import { useRoute,RouterLink} from 'vue-router'
import {useConfig} from '@/stores/config'
import {useCatalog} from '@/stores/catalog'
import TemporalExtent from '@/components/TemporalExtent.vue'
import RelatedLinks from '@/components/RelatedLinks.vue'
import StacParameters from '@/components/StacParameters.vue'
let config = useConfig()
let catalogs = useCatalog()
let route = useRoute()


const {metadata, access, ssoId} = defineProps({
    metadata: Object,
    access: {
        type:Object,
        default: null
    },
    ssoId: {
        type: String,
        default:null
    }
})
const emit = defineEmits(['show'])
const catalog = computed(() => {
    return catalogs.getCurrent()
})
const isExterior = computed(() => {
    return metadata.fromStac || metadata.fromOs
})
const linkMetadata = computed(() => {
    var link = {name:'metadata', params: {id: metadata.id }}
    if (route.params.catalog) {
        link.name = 'catalog-metadata'
        link.params.catalog = route.params.catalog
    }
    var query = {}
    var props = ['start', 'end', 'bbox']
    props.forEach(function (prop) {
        if (route.query && route.query[prop]) {
            query[prop] = route.query[prop]
        }
        
    })
    link.query = query
    return link
    
})

function show () {
    emit('show')
}
</script>
<template>
    <div class="element-metadata-flex" >
        <template v-if="isExterior">
           <a class="service-link" @click="show" >
                <h3 :style="{background: config.state.emphasis}">
                    <font-awesome-icon :icon="['fas', metadata.hierachyLevel.icon]" />
                    <div >{{metadata.title}}</div>
                </h3>
            </a>
        </template>
        <template v-else>
            <router-link class="service-link" :to="linkMetadata" >
                <h3 :style="{background: config.state.emphasis}">
                    <font-awesome-icon :icon="['fas', metadata.hierachyLevel.icon]" />
                    <div >{{metadata.title}}</div>
                </h3>
            </router-link>
        </template>
        <div class="element-description">
            <div v-if="metadata.quicklook || metadata.status" style="display:block;float:left;max-width:120px;text-align:center;">
                <img :src="metadata.quicklook.src" :title="metadata.quicklook.title" v-if="metadata.quicklook"/>
                 <div class="mtdt-status" v-if="metadata.status"  
                 :style="{color: config.state.primary, borderColor: config.state.primary}">
                    {{metadata.status.label || metadata.status}}
                 </div>
       
            </div>
            <temporal-extent v-for="extent in metadata.temporalExtents" :extent="extent"></temporal-extent>
            <div v-if="metadata.subtitle">{{metadata.subtitle}}</div>
            <div v-html="metadata.description"></div>
            <div v-for="item in metadata.thesaurus" >
                <label :style="{color: config.state.primary}">{{ item.label }}: </label> 
                <span v-for="value in item.values">{{ value }} </span>
            </div>
            <stac-parameters :metadata="metadata" />
            
        </div>
        <div class="mtdt-footer">
            <div  class="mtdt-center">
                <template v-if="!catalog && metadata.catalog">
                  <router-link :to="{name: 'catalog-grid', params: {catalog: metadata.catalog.name.toLowerCase()}}" :title="metadata.catalog.name">
                    <img :src="config.state.geonetwork + '/images/harvesting/' + metadata.catalog.logo"   height="31" />
                  </router-link>
                </template>
                <template v-else-if="metadata.provider">
                   <a :href="metadata.provider.href" :title="metadata.provider.title[config.state.lang]" target="_blank">
                    <img :src="metadata.provider.logo"  />
                   </a>
                </template>
            </div>
            <div style="display:inline-block;text-align:right;vertical-align:middle;margin-right:4px;width:calc(100% - 100px);">
              <related-links :uuid="metadata.id" :links="metadata.links" :sso-id="ssoId" :access="access"></related-links></div>
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
  background: var(--color-background-soft);
  min-height:250px;
  max-height:250px;
  overflow:hidden;
  
  
  }
 div.element-metadata-flex h3 {
    margin: 0px -10px 0px -10px;
    padding: 3px 5px;
    color: white;
    text-align: left;
    min-height:40px;
    max-height:44px;
    cursor: pointer;
    line-height:1;
    font-size:1.2rem;
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
   background: var(--color-background-mute);
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
  background:var(--color-background-soft);
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