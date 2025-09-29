<script setup>
import {useTemplateRef} from 'vue'
const {icon,description,color} = defineProps({
    icon: {
        type: String,
        default: 'fa-solid fa-circle-info'
    },
    description: null,
    style: {
        type: String,
        default: 'color:#000;'
    }
})
const tooltip = useTemplateRef('tooltip')
function hideTooltip(event) {
    event.preventDefault()
    event.stopPropagation()
    document.querySelectorAll('.tooltip-show').forEach(function (node) {
      node.classList.remove('tooltip-show')
    })
}
function showTooltip (event) {
    event.preventDefault()
    event.stopPropagation()
    if (event.target.classList.contains('tooltip-show')) {
      event.target.classList.remove('tooltip-show')
      return
    }
    hideTooltip(event)
    tooltip.value.classList.add('tooltip-show')
}
</script>
<template>
 <div v-if="description" class="tooltip-container" style="position:relative;">
      <span ref="tooltip" @click="showTooltip($event)" :style="style">
          <font-awesome-icon :icon="icon" /> 
      </span>
      <div class="fmt-tooltip" @click="hideTooltip($event)" v-html="description"></div>
</div> 
</template>
<style scoped>
.tooltip-container {
    display:inline-block;
    position: relative;
    cursor:pointer;
}
div.fmt-tooltip {
  position: absolute;
  display:none;
  background-color: #fafafa;
  border: 1px solid #a3a3a3;
  font-size: smaller;
  line-height:1;
  text-align:left;
  padding: 5px;
  cursor: pointer;
  width: 250px;
  box-shadow: 2px 2px 3px rgba(0, 0, 0, 0.4);
  z-index:1;
}
b {
    font-weight: 700;
}
.tooltip-show + div.fmt-tooltip {
  display:block;
}
</style>