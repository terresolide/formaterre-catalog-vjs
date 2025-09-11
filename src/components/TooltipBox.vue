<script setup>
const {description} = defineProps({
    icon: {
        type: String,
        default: 'fa-solid fa-info-circle'
    },
    description: null
})
</script>
<template v-if="description">
 <div class="tooltip-container" style="position:relative;">
      <span class="fa-solid fa-info-circle" @click="showTooltip($event)"></span>
      <div class="fmt-tooltip" @click="hideTooltip()" v-html="description"></div>
</div> 
</template>
<style scoped>
.tooltip-container {
    display:inline-block;
    position: relative;
}
</style>