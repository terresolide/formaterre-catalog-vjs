<script setup>
import {computed} from 'vue';
import {useConfig} from '@/stores/config'
import {useSelection} from '@/stores/selection'
// const SimpleLinks = () => import('@/components/SimpleLinks.vue')
const props = defineProps({
   uuid: String,
   layers: Array,
   access: {
        type: Object,
        default: () => {return {view: 'free', download: 'free'}}
   }
})
let config = useConfig()
let selection = useSelection()

let selectedUuid = computed(() => selection.uuid)
function select() {
  selection.toggle(props.uuid)
}
console.log(config)

</script>
<template>

  <!-- afficher la couche sur la carte -->
  <div class="mtdt-related-type" :style="{backgroundColor: config.state.primary}">
    <font-awesome-icon icon="fa-solid fa-earth-americas" />
  </div>  
  
</template>
