<script setup>
import {computed, reactive} from 'vue'
import { useConfig } from "@/stores/config.js"
import ExportLinks from '@/components/ExportLinks.vue'
import MetadataContent from '@/components/MetadataContent.vue'
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
const emit= defineEmits(["close"])
const config = useConfig()
const tabs = {
    description: 'description',
    search: 'search'
}
const data = reactive({
    currentTab: 'description'
})
const dataCenter = computed(() => {
    return config.getProvider(metadata.dataCenter)
})
function close () {
    emit('close')
}
</script>
<template>
    <div class="metadata-content" v-if="metadata">
        <span class="mtdt-metadata-close fa fa-close" @click="close"><font-awesome-icon icon="fa-solid fa-close" /> </span>
        <h1 class="mtdt-metadata-header" :style="{color:config.state.primary}">
            <a v-if="metadata.dataCenter" :href="dataCenter.href" :title="dataCenter.title[config.lang]" target="_blank" class="mtdt-group-logo">
              <img :src="dataCenter.logo"/>
            </a>
            <font-awesome-icon :icon="metadata && metadata.hierarchyLevel === 'series' ? 'fa-solid fa-folder-open': 'fa-solid fa-file'" /> 
            <div>
               <span v-if="metadata.initiativeType">{{$t(metadata.initiativeType)}}: </span>
              {{metadata.title ? metadata.title: metadata.defaultTitle}}
            </div> 
                
        </h1> 
        <hr />
        <div class="mtdt-tabs">
             <div v-for="(tab,index) in tabs" class="mtdt-tab" :class="{'selected': data.currentTab === index}" @click="data.currentTab = index">{{$t(index)}}</div>
          <export-links v-if="metadata.exportLinks" :export-links="metadata.exportLinks"></export-links> 
        </div>
        <div v-show="data.currentTab === 'description'">
         <metadata-content :metadata="metadata" />
        </div>
        <div v-show="data.currentTab === 'search'">
            <slot></slot>
        </div>
    </div>

</template>
<style scoped>

.metadata-content h2 {

  font-size: 1.1em;
  margin: 20px 0 0 0;
}
.metadata-content h1{
  font-size:1.5em;
  font-weight:700;
}
.metadata-content h3,
.metadata-content h4{
  font-size: 1em;
  }
.metadata-content h1 svg {
    vertical-align:top;
    margin: 8px auto;
}
.metadata-content h1 div {
  max-width:calc(100% - 150px);
  display:inline-block;
  margin:10px 5px;
  line-height:1em;
  word-break:break-word;
}
span.mtdt-metadata-close{
  position: absolute;
  top:0px;
  right:5px;
  cursor: pointer;
  opacity:0.7;
}
.metadata-content .mtdt-group-logo{
  float:right;
  margin-top:-5px;
  margin-right: 15px;
}
.metadata-content .mtdt-group-logo img{
  max-width:100px; 
  max-height:40px;
}
.metadata-content hr {
    border:1px solid grey;
    margin:0 -10px 0px -10px;
}
div.metadata-content {
  max-width: calc(100% - 340px);
  padding: 5px 10px;
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