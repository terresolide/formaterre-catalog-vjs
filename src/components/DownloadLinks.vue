<script setup>
import { computed} from 'vue';
import {useSelection} from '@/stores/selection'
const {links, service} = defineProps({
   links: Array,
   service: null
})
const selection = useSelection()
const isDisable = computed(() => {return false})
function commandLine() {
    selection.setDownload(links[0])
}
function download (index) {
}
</script>
<template>
  <div class="mtdt-related-type">
     
     <template v-if="links.length === 1">
        <a :href="links[0].url" target="_blank" download :title="links[0].name" style="color:white;"><font-awesome-icon icon="fa-solid fa-download" /></a>
     </template>
     <template v-else>
         <font-awesome-icon icon="fa-solid fa-download"  />
         <font-awesome-icon
          style="margin-left: 2px"
          icon="fa-solid fa-caret-down"
         />
     </template>
  </div>
  <div v-if="links.length > 1" class="mtdt-expand mtdt-links">
    <ul>
      <template v-for="(link, index) in links">
        <li @click="download(index)" style="cursor:pointer;">
          <a :href="link.url" target="_blank" download :title="link.description">{{ link.name }}</a>
        </li>
      </template>
    </ul>
  </div>
  <!-- téléchargement en ligne de commande si un seul lien-->
  <template v-if="links.length === 1">
      <div class="mtdt-related-type" :title="$t('command_line')" @click="commandLine">
        <font-awesome-icon icon="fa-solid fa-terminal" />
      </div>
  </template>
</template>