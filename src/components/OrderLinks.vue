<script setup>
// import { computed } from 'vue'
import { useConfig } from '@/stores/config'
import {recordDownload} from '@/modules/recordDownload'
const props = defineProps({
    links: {
      type: Array,
      default: () => [],
    },
    mode: {
        type: String,
        default: 'box'
    },
    group: {
        type: String,
        default: null
    },
    uuid: {
        type: String,
        default: ''
    }
})
let config = useConfig()
const emit = defineEmits(['download'])
function order (index) {
    
   recordDownload({link: props.links[index].url, type: 'order', uuid: props.uuid, cds: props.group })
}

</script>
<template>
  <div
    class="mtdt-related-type"
    :title="props.links.length === 1 ? props.links[0].name : ''"
  >
    <template v-if="props.links.length === 1">
        <a class="icon-link" :href="props.links[0].url" target="_blank" :title="$t('order') + ': ' + props.links[0].name" @click="order(0)">
            <font-awesome-icon icon="fa-solid fa-pencil" />
        </a>
    </template>
    <template v-else>
        <font-awesome-icon icon="fa-solid fa-pencil" :title="$t('order')"/>
        <font-awesome-icon
          v-if="props.mode === 'box'"
          style="margin-left: 2px"
          icon="fa-solid fa-caret-down"
        />
    </template>
  </div>

  <div v-if="props.links.length > 1 || props.mode === 'page'" class="mtdt-expand mtdt-links">
    <ul>
      <template v-for="(link, index) in props.links">
        <li >
          <a :href="link.url" target="_blank" :title="link.description" @click="order(index)">{{ link.name }}</a>
        </li>
      </template>
    </ul>
  </div>
</template>
<style scoped>
  .icon-link {
      color: white;
  }
  .icon-link:hover {
      background:transparent;
      color: white;
  }
  .mtdt-layers.mtdt-expand li a {
}
</style>
