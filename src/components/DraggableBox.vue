<script setup>
import {ref, reactive, onMounted } from 'vue'

const largeContainer = ref(null)
const props = defineProps({
  list: Array,
})
const data = reactive({
  lcontainer: {
      selected: false,
      pos: {x:0, y:0},
      delta: {x:0, y:0}
  },
  mousemoveListener: null,
  mouseupListener: null
})

function movestart (evt) {
      data.lcontainer.selected = true
      data.lcontainer.delta = {
          x: data.lcontainer.pos.x - largeContainer.value.offsetLeft,
          y: data.lcontainer.pos.y - largeContainer.value.offsetTop
      }
    }
 function move (evt) {
      data.lcontainer.pos.x = evt.clientX
      data.lcontainer.pos.y = evt.clientY
      if (data.lcontainer.selected) {
        largeContainer.value.style.left = (data.lcontainer.pos.x - data.lcontainer.delta.x) + 'px'
        var top = data.lcontainer.pos.y - data.lcontainer.delta.y
        largeContainer.value.style.top = top > 0 ? (top + 'px') : 0
      }
    }
 function moveEnd () {
      data.lcontainer.selected = false
 }
 onMounted(() => {
    data.mousemoveListener = move.bind()
    document.addEventListener('mousemove', data.mousemoveListener)
    data.mouseupListener = moveEnd.bind()
    document.addEventListener('mouseup', data.mouseupListener)
 })
</script>
<template>
   <div class="large-container" ref="largeContainer" >
      <div style="" class="move-bar" @mousedown="movestart"></div>
      <slot></slot>
 </div>
</template>
<style scoped>
div.large-container {
    position: fixed;
    display:none;
    border-radius:5px;
    top:10px;
    left:10px;
    width: 90%;
    height: 500px;
    background: lightgrey;
    z-index:10;
    resize:both;
    overflow:hidden;

    -webkit-box-shadow: 0 0px 3px rgba(0,0,0,0.5);
    box-shadow: 0 0px 3px rgba(0,0,0,0.5);

}
div.move-bar {
    background-image: radial-gradient(grey 1px, transparent 0);
    background-size: 5px 5px;
    height:30px;cursor:move;
}
</style>