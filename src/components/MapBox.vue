<script setup>
import {ref, reactive, onMounted} from 'vue'
import L from 'leaflet'
import '@/modules/leaflet.control.mylayers.js'
const map = ref(null)
const data = reactive({
    map: null,
    controlLayer: null
})
function initialize () {
    if (data.map) {
      return
    }
    
    data.map = L.map(map.value).setView([35,5], 3)
    data.controlLayer = new L.Control.MyLayers(null, null,{position: 'topright'})
    data.controlLayer.tiles.arcgisTopo.layer.addTo(data.map)    
    data.controlLayer.addTo(data.map)
    L.control.scale().addTo(data.map)
}
onMounted(() => {initialize()})

</script>
<template>
    <div id="map" ref="map">map box</div>
</template>
<style src='leaflet/dist/leaflet.css' />
<style>
div[id="map"] {
      position:relative;
      height:200px;
      width:100%;
  }
</style>