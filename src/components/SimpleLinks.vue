<script setup>
import { computed} from 'vue';
import {useConfig} from '@/stores/config'
// import {useCatalog} from '@/stores/catalog'
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
let icon = computed(() => {
    if (props.type === 'information') {
        return 'fa-solid fa-link'
    } else {
        return 'fa-solid fa-asterisk'
    }
})
let config = useConfig()


</script>
<template>
    <template v-if="props.links.length > 1">
      <!-- liens d'information -->
       <div class="mtdt-related-type" :style="{backgroundColor: config.state.primary}">
       <font-awesome-icon :icon="icon" /> 
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
    <template v-else-if="props.links.length === 1">
        <a :href="props.links[0].url" target="_blank" :title="props.links[0].name">
            <div class="mtdt-related-type" :style="{backgroundColor: config.state.primary}">
                <font-awesome-icon :icon="icon" /> 
            </div>
        </a>
    </template>
</template>
