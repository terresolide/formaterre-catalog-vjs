<script setup>
import { computed } from 'vue'
import { useConfig } from '@/stores/config'
import { useSelection } from '@/stores/selection'
const props = defineProps({
  uuid: String,
  links: {
    type: Array,
    default: () => [],
  },
  mode: {
      type: String,
      default: 'box'
  },
  access: {
    type: Object,
    default: () => {
      return { view: 'free', download: 'free' }
    },
  },
})
let config = useConfig()
let selection = useSelection()
function isSelected(index) {
  return selection.hasLayer(props.links[index])
}
function hasSelectedLayer() {
  for (var index in props.links) {
    if (selection.hasLayer(props.links[index])) {
      return true
    }
  }
  return false
}
function select(index) {
  selection.toggleLayer(props.links[index])
}
</script>
<template>
  <!-- afficher la couche sur la carte -->
  <div
    class="mtdt-related-type"
    :style="{ backgroundColor: hasSelectedLayer() ? config.state.over : config.state.primary }"
    :title="props.links.length === 1 ? props.links[0].name : ''"
    @click="select(0)"
  >
    <font-awesome-icon icon="fa-solid fa-earth-americas" />
    <font-awesome-icon
      v-if="props.links.length > 1 && props.mode === 'box'"
      style="margin-left: 2px"
      icon="fa-solid fa-caret-down"
    />
  </div>

  <div v-if="props.links.length > 1 || props.mode === 'page'" class="mtdt-expand mtdt-layers">
    <ul class="mtdt-layers">
      <template v-for="(layer, index) in props.links">
        <li @click="select(index)">
          <font-awesome-icon
            :icon="isSelected(index) ? 'fa-regular fa-check-square' : 'fa-regular fa-square'"
          />
          <div :title="layer.description">{{ layer.name }}</div>
        </li>
      </template>
    </ul>
  </div>
</template>
