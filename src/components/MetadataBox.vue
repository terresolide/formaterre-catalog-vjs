<script setup>
import {computed} from 'vue'
import { RouterLink} from 'vue-router'
// import { defineProps } from 'vue';
import {useConfig} from '@/stores/config';
let config = useConfig()
let x = 3
const props = defineProps({
    metadata: Object
})
const metadata = computed(() => {
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
    
    return meta
})
</script>
<template>
    <div class="element-metadata-flex" >
        <a class="service-link" >
            <h3 :style="{background: config.state.emphasis}">
                <font-awesome-icon :icon="['fas', metadata.hierachyLevel.icon]" />
                <div >{{metadata.title}}</div>
            </h3>
            <div class="element-description">
                <div v-if="metadata.quicklook || metadata.status" style="display:block;float:left;max-width:120px;text-align:center;">
                    <img :src="metadata.quicklook.src" :title="metadata.quicklook.title" v-if="metadata.quicklook"/>
                     <div class="mtdt-status" v-if="metadata.status"  
                     :style="{color: config.state.primary, borderColor: config.state.primary}">
                        {{metadata.status.label}}
                     </div>
           
                </div>
                <div v-html="metadata.description"></div>
            </div>
        </a>
    </div>
</template>
<style scoped>
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
    margin: -25px -10px 5px -10px;
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
  line-height: 30px;
  }
   div.element-metadata-flex  div.element-description{
    max-height:165px;
    overflow:hidden;
    padding: 5px;
    font-size:15px;
}
 div.element-metadata-flex .mtdt-child div.element-description{
   max-height: 170px;
}
 div.element-metadata-flex div.element-description img {
  position: relative;
   max-width: 110px;
   max-height:180px;
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
  bottom:0;
  width:100%;
  min-height: 28px;
  -webkit-box-sizing: content-box;
  box-sizing: content-box;
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