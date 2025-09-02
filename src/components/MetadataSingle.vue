<script setup>
import {useConfig} from '@/stores/config.js'
import MetadataContent from '@/components/MetadataContent.vue'
const {metadata} = defineProps({
    metadata: {
        type: Object,
        default: null
    }
})
const config = useConfig()
</script>
<template>
   <div class="metadata-content" v-if="metadata">
        <span class="mtdt-metadata-close fa fa-close" @click="close"><font-awesome-icon icon="fa-solid fa-close" /> </span>
        <h1 class="mtdt-metadata-header" :style="{color:config.state.primary}">
            <a v-if="metadata.dataCenter" :href="dataCenter.href" :title="dataCenter.title[config.lang]" target="_blank" class="mtdt-group-logo">
              <img :src="dataCenter.logo"/>
            </a>
            <font-awesome-icon icon="fa-solid fa-file" /> 
            <div>

              {{metadata.title}}
            </div> 
                
        </h1> 
       
         <metadata-content :metadata="metadata" />
        
    </div>

</template>