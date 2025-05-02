<script setup>
import {computed, ref, reactive, onMounted, watch} from 'vue'
import L from 'leaflet'
import '@/modules/leaflet.control.mylayers.js'
const map = ref(null)
const props = defineProps( {
    list: Array
})
const data = reactive({
    map: null,
    controlLayer: null,
    bbox: null
})
watch(() => props.list,
(list) => {
    var geojson = {
        type: 'FeatureCollection',
        features: []
    }
    if (data.bbox) {
        data.bbox.clearLayers()
    }
    list.forEach(function (mtdt) {
        if (mtdt._source && mtdt._source.geom) {
            geojson.features.push({type: 'Feature', id: mtdt._source.uuid, geometry: mtdt._source.geom[0]})
        }
    })
    data.bbox = L.geoJSON(geojson)
    data.bbox.addTo(data.map)
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
    <div id="map" ref="map" class="mtdt-small">map box</div>
</template>
<style src='leaflet/dist/leaflet.css' />
<style>
div[id="map"] {
      position:relative;
      height:500px;
      width:100%;
}
div[id="map"].mtdt-small {
    height: 200px;
}  
div[id="map"].mtdt-small .leaflet-top .leaflet-control{
   margin-top: 3px;
}
div[id="map"].mtdt-small .leaflet-left .leaflet-control{
   margin-left: 3px;
}
div[id="map"].mtdt-small .leaflet-control .leaflet-control-zoom-in, 
div[id="map"].mtdt-small .leaflet-control .leaflet-control-zoom-out{
  font-size:16px;
}
div[id="map"].mtdt-small .leaflet-bar a,
div[id="map"].mtdt-small .leaflet-control a{
 width: 15px;
 height:15px;
 line-height:15px;
 }
</style>