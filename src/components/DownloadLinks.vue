<script setup>
import { computed} from 'vue';
import {useConfig} from '@/stores/config'
import {useCatalog} from '@/stores/catalog'
const props = defineProps({
   links: Object,
   type: {
       type:String,
       default: 'information'
    }
})
let config = useConfig()
let links = computed(() => {
    
})

</script>
<template>
   <div class="mtdt-related-type">
    <font-awesome-icon icon="fa-solid fa-download" />
  </div>
  <!-- téléchargement en ligne de commande -->
  <div class="mtdt-related-type">
    <font-awesome-icon icon="fa-solid fa-terminal" />
  </div>
</template>