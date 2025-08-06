<script setup>
import {reactive} from 'vue'
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
const tabs = {
    description: 'description',
    search: 'search'
}
const data = reactive({
    currentTab: 'description'
})
</script>
<template>
    <div class="grid-content">
    
        <h1 class="mtdt-metadata-header" :style="{backgroundColor:color}">
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
        <hr style="border:1px solid grey;margin-bottom:0px;clear:both;"/>
        <div class="mtdt-tabs">
             <div v-for="(tab,index) in tabs" class="mtdt-tab" :class="{'selected': data.currentTab === index}" @click="data.currentTab = index">{{$t(index)}}</div>
         
            <!-- <formater-export-links v-if="metadata.exportLinks" :export-links="metadata.exportLinks"></formater-export-links> -->
        </div>
    </div>
    <slot></slot>

</template>
<style scoped>
div.grid-content {
  max-width: calc(100% - 340px);
  display:inline-block;
}
</style>