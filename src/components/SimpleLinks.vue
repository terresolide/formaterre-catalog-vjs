<script setup>
import { computed} from 'vue';
import {useConfig} from '@/stores/config'
import {useCatalog} from '@/stores/catalog'
const props = defineProps({
   links: {
       type: Array,
       default: () => []
   },
   type: {
       type:String,
       default: 'information'
    }
})
let config = useConfig()


</script>
<template v-if="props.links.length">
  <!-- liens d'information -->
   <div class="mtdt-related-type" :style="{backgroundColor: config.state.primary}">
   <template v-if="props.type === 'information'">
    <font-awesome-icon icon="fa-solid fa-link" /> 
  </template>
  <template v-else>
    <font-awesome-icon icon="fa-solid fa-asterisk" /> 
  </template>
  <font-awesome-icon v-if="props.links.length > 1" icon="fa-solid fa-caret-down" />
  </div>
   <div v-if="props.links.length > 1" class="mtdt-expand mtdt-links">
        <ul >
            <template v-for="link in props.links">
              <li >
                <a :href="link.url" target="_blank" :title="link.description">{{link.name}}</a>
              </li>
            </template>
       </ul>    
       </div> 
</template>
