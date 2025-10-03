<script setup>
import { computed} from 'vue';
import {useUser} from '@/stores/user.js'
import {useSelection} from '@/stores/selection'
const {links, service, access, mode} = defineProps({
    links: Array,
    service: null,
    access: Object,
    mode: {
        type: String,
        default: 'box'
    }
})
const user = useUser()
const selection = useSelection()
const isDisable = computed(() => {return false})
function commandLine(index) {
    selection.setDownload(links[index])
}

function download (index) {
}
</script>
<template>     
     <template v-if="links.length === 1 && mode === 'box'">
        <div class="mtdt-related-type" :title="links[0].name" :class="{disabled: access.download < 0}">
            <a :href="links[0].url" target="_blank" download  style="color:white;"><font-awesome-icon icon="fa-solid fa-download" /></a>
        </div>
     </template>
     <template v-else>
         <div class="mtdt-related-type" :title="$t('download_link')" :class="{disabled: access.download < 0}">
             <font-awesome-icon icon="fa-solid fa-download"  />
             <font-awesome-icon v-if="mode === 'box'"
              style="margin-left: 2px"
              icon="fa-solid fa-caret-down"
             />
        </div>
     </template>

  <div v-if="links.length > 1 || mode === 'page'" class="mtdt-expand mtdt-links">
    <ul>
      <template v-for="(link, index) in links">
        <li @click="download(index)" style="cursor:pointer;">
          <a :href="link.url" target="_blank" download :title="link.description">{{ link.name }}</a>
        </li>
      </template>
    </ul>
  </div>
  <!-- téléchargement en ligne de commande si un seul lien-->
  <template v-if="links.length === 1 && mode === 'box'" >
      <div class="mtdt-related-type" :title="$t('command_line')" @click="commandLine(0)">
        <font-awesome-icon icon="fa-solid fa-terminal" />
      </div>
  </template>
  <template v-else>
       <div class="mtdt-related-type" :class="{disabled: access.download < 0}" :title="$t('command_line')" >
        <font-awesome-icon icon="fa-solid fa-terminal" />
      </div>
       <div v-if="links.length > 1 || mode === 'page'" class="mtdt-expand mtdt-links">
    <ul>
      <template v-for="(link, index) in links">
        <li @click="commandLine(index)" style="cursor:pointer;">
          <a   :title="link.description">{{ link.name }}</a>
        </li>
      </template>
    </ul>
  </div>
  </template>
</template>