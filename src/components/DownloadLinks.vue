<script setup>
import { computed} from 'vue';
import {useUser} from '@/stores/user.js'
import {useSelection} from '@/stores/selection'
const {links,  access, mode, ssoId} = defineProps({
    links: Array,
    access: Object,
    mode: {
        type: String,
        default: 'box'
    },
    ssoId: {
        type: String,
        default:null
    }
})
const emit = defineEmits(['click'])
const user = useUser()
const selection = useSelection()
const isDisable = computed(() => {return false})
function commandLine(index) {
    if (access.download === 0) {
        emit('click')
        return
    }

    selection.setDownload(links[index], ssoId)
}

function download (index) {
    console.log('click dans download')
    if (access.download === 0) {
        emit('click')
        return
    }
}
</script>
<template>   
     <template v-if="links.length === 1 && mode === 'box'">
        <div class="mtdt-related-type" :title="links[0].name" :class="{disabled: access.download < 0, notAuthenticated: access.download === 0}"
        @click="download(0)">
            <font-awesome-icon icon="fa-solid fa-download" />
        </div>
     </template>
     <template v-else>
         <div class="mtdt-related-type" :title="$t('download_link')" :class="{disabled: access.download < 0, notAuthenticated: access.download === 0}">
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
        <li @click="download(index)" style="cursor:pointer;" :class="{disabled: access.download < 0, notAuthenticated: access.download === 0}">
          <a :href="link.url" target="_blank" download :title="link.description">{{ link.name }}</a>
        </li>
      </template>
    </ul>
  </div>
  <!-- téléchargement en ligne de commande si un seul lien-->
  <template v-if="links.length === 1 && mode === 'box'" >
      <div class="mtdt-related-type" :title="$t('command_line')" :class="{disabled: access.download < 0, notAuthenticated: access.download === 0}" @click="commandLine(0)">
        <font-awesome-icon icon="fa-solid fa-terminal" />
      </div>
  </template>
  <template v-else>
       <div class="mtdt-related-type" :class="{disabled: access.download < 0, notAuthenticated: access.download === 0}" :title="$t('command_line')" >
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