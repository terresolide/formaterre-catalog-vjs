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
let links = computed(() => {
    
})

</script>
<template v-if="props.links.length">
  <!-- liens d'information -->
   <div class="mtdt-related-type">
   <template v-if="props.type === 'information'">
    <font-awesome-icon icon="fa-solid fa-link" /> 
  </template>
  <template v-else>
    <font-awesome-icon icon="fa-solid fa-asterisk" /> 
  </template>
  <font-awesome-icon v-if="props.links.length > 1" icon="fa-solid fa-caret-down" />
  </div>
</template>