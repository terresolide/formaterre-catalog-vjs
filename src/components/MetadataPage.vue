<script setup>
import {computed, reactive, watch} from 'vue'
import { useRoute } from 'vue-router'
// import { useSelection } from "@/stores/selection.js"
import ExportLinks from '@/components/ExportLinks.vue'
import MetadataContent from '@/components/MetadataContent.vue'
import MessageAccess from '@/components/MessageAccess.vue'
const {metadata,access, inside, color, ssoId} = defineProps({
    metadata: {
        type: Object,
        default: null
    },
    access: {
        type: Object,
        default: null
    },
    inside: {
        type:Boolean,
        default: false
    },
    color: {
        type:String,
        default: '#fff000'
    },
    ssoId: {
        type:String,
        default:null
    }
})
const emit= defineEmits(["close"])

const route = useRoute()
// const selection = useSelection()
const tabs = {
    description: 'description',
    search: 'search'
}
const data = reactive({
    currentTab: 'description'
})

function close () {
    emit('close')
}
watch(() => metadata,
    meta => {
        if (!route.query || Object.keys(route.query).length === 0 ) {
              data.currentTab = 'description'
        }
})
</script>

<template>
    <div class="metadata-content" :class="{'metadata-single': inside}" v-if="metadata">
        <span class="mtdt-metadata-close fa fa-close" @click="close"><font-awesome-icon icon="fa-solid fa-close" /> </span>
        <h1 class="mtdt-metadata-header" >
            <template v-if="metadata.dataCenter">
            <a v-for="item in metadata.dataCenter" :href="item.website" :title="item.description" target="_blank" class="mtdt-group-logo">
              <img :src="item.logo"/>
            </a>
            </template>
            <font-awesome-icon :icon="metadata && metadata.hierarchyLevel === 'series' ? 'fa-solid fa-folder-open': 'fa-solid fa-file'" /> 
            <div>
               <span v-if="metadata.initiativeType">{{$t(metadata.initiativeType)}}: </span>
              {{metadata.title ? metadata.title: metadata.defaultTitle}}
            </div> 
                
        </h1> 
        <hr />
        <div class="mtdt-tabs">
            <template v-if="!inside && metadata.hierarchyLevel === 'series'">
                <div v-for="(tab,index) in tabs" class="mtdt-tab" :class="{'selected': data.currentTab === index}" @click="data.currentTab = index">{{$t(index)}}</div>
            </template>
            <export-links v-if="metadata.exportLinks" :export-links="metadata.exportLinks"></export-links> 
        </div>
        <message-access :access="access"></message-access>
        <template v-if="inside">
            <div>
                <metadata-content :metadata="metadata" :access="access" :sso-id="ssoId" />
            </div>
        </template>
        <template v-else>
            <div v-show="data.currentTab === 'description'">
             <metadata-content :metadata="metadata" :access="access" :sso-id="ssoId" />
            </div>
            <div v-show="data.currentTab === 'search'">
                <slot></slot>
            </div>
        </template>
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
  color:var(--color-text-primary);
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
    width: 100%;
}
div.metadata-content {
  max-width: calc(100% - 340px);
  padding: 5px 10px;
  display:block;
  margin-left:340px;
  position: relative;
  height: auto;
  background: var( --color-background);
  overflow: hidden;
  border: 1px solid #ccc;
  border-radius: 0 0 5px 5px;
  box-shadow: 2px 2px 2px 1px rgba(0, 0, 0, 0.2);
}
div.metadata-content.metadata-single {
    position:absolute;
    left:-335px;
    top:5px;
    z-index:10;
    border: 1px solid #333;
    border-radius: 5px 5px;
    box-shadow: 2px 2px 2px 1px rgba(0, 0, 0, 0.5);
    background: var( --color-background);
    max-width:calc(100% - 10px);
    
}
div.mtdt-tabs {
     display:block;
     min-height: 38px;
}
div.mtdt-tab,
.mtdt-tab-export{
  display:inline-block;
  padding: 5px 10px;
  border:1px dotted grey;
  border-top:0px;
  background:var(--color-border);
  cursor: pointer;
  
}
div.mtdt-tab:hover,
.mtdt-tab-export:hover{
   background:var(--color-background-soft);
}
div.mtdt-tab.selected{
  background:var(--color-background);
}
</style>