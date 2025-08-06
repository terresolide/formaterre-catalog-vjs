<script setup>
import {reactive} from 'vue'
import { useConfig } from "@/stores/config.js"
import ExportLinks from '@/components/ExportLinks.vue'
const {metadata,color} = defineProps({
    metadata: {
        type: Object,
        default: null
    },
    color: {
        type:String,
        default: '#fff000'
    }
})
const config = useConfig()
const tabs = {
    description: 'description',
    search: 'search'
}
const data = reactive({
    currentTab: 'description'
})
</script>
<template>
    <div class="metadata-content">
    
        <h1 class="mtdt-metadata-header" :style="{color:config.state.primary}">
            <a v-if="data.dataCenter" :href="data.dataCenter.href" :title="datas.dataCenter.title[lang]" target="_blank" class="mtdt-group-logo">
              <img :src="dataCenter.logo"/>
            </a>
            Titre
            <!--  <i  class="fa" :class="{'fa-files-o':metadata.type === 'series', 'fa-file': metadata.type === 'dataset', 'fa-map-marker': metadata.type === 'feature'}"  v-if="['dataset','series', 'feature'].indexOf(metadata.type) >= 0"></i>
              <div>
              <span v-if="metadata.initiativeType">{{$t(metadata.initiativeType)}}: </span>
              {{metadata.title ? metadata.title: metadata.defaultTitle}}
              </div> -->
                
        </h1> 
        <hr />
        <div class="mtdt-tabs">
             <div v-for="(tab,index) in tabs" class="mtdt-tab" :class="{'selected': data.currentTab === index}" @click="data.currentTab = index">{{$t(index)}}</div>
         
          <export-links v-if="metadata && metadata.exportLinks" :export-links="metadata.exportLinks"></export-links> 
        </div>
    
        <slot></slot>
    </div>

</template>
<style scoped>
.metadata-content hr {
    border:1px solid grey;
    margin:0 -10px 0px -10px;
}
div.metadata-content {
  max-width: calc(100% - 340px);
  padding: 0 10px;
  display:block;
  margin-left:340px;
  position: relative;
  height: auto;
  background: #fff;
  overflow: hidden;
  border: 1px solid #ccc;
  border-radius: 0 0 5px 5px;
  box-shadow: 2px 2px 2px 1px rgba(0, 0, 0, 0.2);
}
div.mtdt-tab,
.mtdt-tab-export{
  display:inline-block;
  padding: 5px 10px;
  border:1px dotted grey;
  border-top:0px;
  background: #eee;
  cursor: pointer;
}
div.mtdt-tab:hover,
.mtdt-tab-export:hover{
   background: #ccc;
}
div.mtdt-tab.selected{
  background: #ddd;
}
</style>