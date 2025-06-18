<script setup>
import { ref, reactive, onMounted, watch } from 'vue'
import L from 'leaflet'
import '@/modules/leaflet.control.mylayers.js'
import '@/modules/leaflet.control.legend.js'
import { useSelection } from '@/stores/selection'
import { useConfig } from '@/stores/config'
const getReader = () => import('@/modules/capabilities-reader.js')
const config = useConfig()
const map = ref(null)
const props = defineProps({
  list: Array,
})
const data = reactive({
  map: null,
  controlLayer: null,
  controlLegend: null,
  layers: [],
  bbox: null,
  selectedBbox: null,
  reader: null
})
const selectedOptions = {
  color: 'red',
  fillColor: 'red',
  fillOpacity: 0.01,
  strokeWidth: 2,
  weight: 1,
}
const currentOptions = {
  color: 'purple',
  fillColor: 'purple',
  fillOpacity: 0.05,
  strokeWidth: 1,
  weight: 1,
}
const selection = useSelection()


function addLayer(layer) {
  
  var metaId = layer.uuid
  console.log(metaId)
  // voir comment passer le token quand authentifié
  // var token = event.detail.token


  switch (layer.type) {
    case 'WMS':
    case 'OGC:WMS':
    case 'OGC Web Map Service':
      var regex = new RegExp(/GetCapabilities/i)
      if (regex.test(layer.url)) {
        beforeAddWMS(layer, metaId)
        return
      }
      if (!layer.options) {
        var extract = layer.url.match(/^(.*\?).*$/)
        var url = extract[1]
        layer.url = url
        layer.options = {
          id: layer.id,
          uuid: layer.uuid,
          service: 'WMS',
          layers: layer.name,
          format: 'image/png',
          opacity: 0.5,
        }
        if (token && token !== -1) {
          layer.options._bearer = token
        }
      }
      addWMSLayer(layer, metaId)
      break
    case 'GetMap':
      if (!layer.options) {
        layer.options = {
          id: layer.id,
          uuid: layer.uuid,
          service: 'WMS',
          layers: layer.name,
          format: 'image/png',
          opacity: 0.5,
        }
      }
      addWMSLayer(layer, metaId)
      break
    case 'WMTS':
    case 'OGC API - Tiles':
    case 'WTS':
      if (!layer.options) {
        layer.options = {
          id: layer.id,
          uuid: layer.uuid,
          service: 'WTS',
          layers: layer.name,
        }
      }
      addWTSLayer(layer, metaId)
      break
    case 'XXX':
      var extract = layer.url.match(/^(.*\?).*$/)
      var url = extract[1]
      var options = {
        service: 'WMS',
        layers: layer.name,
        uuid: layer.uuid,
        id: layer.id,
        url: layer.url, //,
        //  format: 'image/png',
        // opacity: 0.5
      }

      //GET CAPABILITIES
      //        var param = 'service=WMS&layer=' + encodeURIComponent(layer.name) + '&url=' + encodeURIComponent(url)
      //        this.$http.get('http://api.formater/interface-services/index.php?' + param).then(
      //          response => { console.log(response.body)}
      //         )
      //        var newLayer = L.tileLayer.wms(url, options);
      //        this.addLayerToMap(layer.id, metaId, newLayer)
      break
    case 'OGC:WFS':
    case 'OGC:WFS-G':
      var extract = layer.url.match(/^(.*\?).*$/)
      url = layer.url + 'r?'
      url += 'version=1.0.0&request=GetFeature&typeName=' + layer.name
      url += '&service=WFS'
      url += '&outputFormat=' + encodeURIComponent('application/vnd.google-earth.kml+xml')

      //        this.$http.get('http://api.formater/interface-services/kmlFeature.php?url=' + encodeURIComponent(url)).then(
      //            response => {
      //              const parser = new DOMParser();
      //              const kml = parser.parseFromString(response.body, 'text/xml');
      //              var newLayer = new L.KML(kml)
      //              this.addLayerToMap(layer.id, metaId, newLayer)
      //            }
      //        )
      break
    case 'OGC:KML':
    case 'OGC:OWS':
    case 'OGC:OWS-C':
    case 'GLG:KML-2.0-http-get-map':
      this.$http.get(layer.url).then((response) => {
        const parser = new DOMParser()
        const kml = parser.parseFromString(response.body, 'text/xml')
        var newLayer = new L.KML(kml)
        addLayerToMap(layer.id, metaId, newLayer)
      })
      break

    // var kmlLayer = new L.KML(layer.href, {async: true});
    // kmlLayer.addTo(this.map)
  }
}
function beforeAddWMS(layer, metaId) {
  if (!data.reader) {
    getReader().then((rd) => {
      console.log(rd)
      data.reader = rd.default
      data.reader.init(config.state.proxy)
      data.reader.loadInfo(layer, { opacity: 0.5}, metaId, addWMSLayer)
    })
  } else {
      data.reader.loadInfo(layer, { opacity: 0.5}, metaId, addWMSLayer)
  }
}
function addWTSLayer(layer, metaId) {
  var tileLayer = L.tileLayer(layer.url, { opacity: 0.5 })
  addLayerToMap(layer.options.id, metaId, tileLayer)
}
function addWMSLayer(layerObj, metaId) {
  // add bearer if necessary
  // layerObj.options._bearer = 'mon bearer'
  var newLayer = L.tileLayer.wms(layerObj.url, layerObj.options)
  addLayerToMap(layerObj.options.id, metaId, newLayer)
  // Add legend if there is specific legend with the layer and only one metadata
  console.log(layerObj.options)
 if (layerObj.options.legend && selection.uuid && layerObj.options.uuid === selection.uuid ) {
    data.legendControl.addLegend(selection.uuid, layerObj.id, layerObj.options.legend.src)
  } 
 // } else if (data.selectedMetadata && data.selectedMetadata.legend) {
 //   data.legendControl.addLegend(data.selectedMetadata.id, '0', data.selectedMetadata.legend)
 // }
}
function addLayerToMap(id, groupId, newLayer) {
  if (newLayer) {
    newLayer.addTo(data.map)
    newLayer.bringToFront()
    data.layers[id] =  newLayer
  }
}

watch(
  () => props.list,
  (list) => {
    var geojson = {
      type: 'FeatureCollection',
      features: [],
    }
    if (data.bbox) {
      data.bbox.clearLayers()
      data.legendControl.removeAll()
      selection.select(null)
    }
    list.forEach(function (mtdt) {
      if (mtdt._source && mtdt._source.geom) {
        if (mtdt._source.geom.length === 1) {
          geojson.features.push({
            type: 'Feature',
            id: mtdt._source.uuid,
            geometry: mtdt._source.geom[0],
          })
        } else {
          var geometry = { type: 'MultiPolygon', coordinates: [] }
          mtdt._source.geom.forEach(function (geom) {
            geometry.coordinates.push(geom.coordinates)
          })
          geojson.features.push({ type: 'Feature', id: mtdt._source.uuid, geometry: geometry })
        }
      }
    })
    data.bbox = L.geoJSON(geojson, { style: currentOptions })
    data.bbox.addTo(data.map)
    var bounds = data.bbox.getBounds()
    data.map.fitBounds(bounds)
  },
)
watch(
  () => selection.uuid,
  (uuid) => {
    if (data.selectedBbox) {
      data.selectedBbox.setStyle(currentOptions)
    }
    console.log(uuid)
    if (!uuid) {
      data.selectedBbox = null
      data.map.fitBounds(data.bbox.getBounds())
      return
    }
    var layers = data.bbox.getLayers()
    data.selectedBbox = layers.find((ly) => ly.feature.id === uuid)
    if (data.selectedBbox) {
        data.selectedBbox.setStyle(selectedOptions)
        data.map.fitBounds(data.selectedBbox.getBounds())
    }
  },
)
watch(
  () => selection.layers,
  (layers) => {
    // add new layers or remove
    layers.forEach(function (layer) {
      if (!data.layers[layer.id]) {
          addLayer(layer)
      }
    })
    // remove 
    var onMap = Object.keys(data.layers)
    var onMap = layers.map(l => l.id)
    console.log(onMap)
    for(var key in data.layers) {
        if (onMap.indexOf(key) < 0) {
            data.layers[key].remove()
            delete data.layers[key]
        }
    }
    
  },
  { deep: true },
)
function initialize() {
  if (data.map) {
    return
  }

  data.map = L.map(map.value).setView([35, 5], 3)
  data.controlLayer = new L.Control.MyLayers(null, null, { position: 'topright' })
  data.controlLayer.tiles.arcgisTopo.layer.addTo(data.map)
  data.controlLayer.addTo(data.map)
  L.control.scale().addTo(data.map)
  data.legendControl = new L.Control.Legend(config.state.lang, function (uuid) {    
     // create Dom identifier from uuid
      // first character must be letter and character other than "_" and "-" are forbidden
      return 'i' + uuid.toLowerCase().replace(/[^a-z0-9\-_]+/, '')
  })
  data.legendControl.addTo(data.map)
}
onMounted(() => {
  initialize()
})
</script>
<template>
  <div id="map" ref="map" class="mtdt-small">map box</div>
</template>
<style src="leaflet/dist/leaflet.css" />
<style>
div[id='map'] {
  position: relative;
  height: 500px;
  width: 100%;
}
div[id='map'].mtdt-small {
  height: 200px;
}
div[id='map'].mtdt-small .leaflet-top .leaflet-control {
  margin-top: 3px;
}
div[id='map'].mtdt-small .leaflet-left .leaflet-control {
  margin-left: 3px;
}
div[id='map'].mtdt-small .leaflet-control .leaflet-control-zoom-in,
div[id='map'].mtdt-small .leaflet-control .leaflet-control-zoom-out {
  font-size: 16px;
}
div[id='map'].mtdt-small .leaflet-bar a,
div[id='map'].mtdt-small .leaflet-control a {
  width: 15px;
  height: 15px;
  line-height: 15px;
}
div[id="map"] .lfh-control-legend {
 cursor: pointer;
 background: white;
 display:none;
}
div[id="map"] .lfh-control-legend img{
  max-height:250px;
}
 div[id="map"]  div.lfh-control-legend{
  display:block;
}
  div[id="map"]  div.lfh-control-legend.hidden{
  display:none;
}

div[id="map"].mtdt-small .lfh-control-legend img{
 max-width:120px;
 max-height:100px;
}
div[id="map"] .lfh-control-legend img{
  display: none;
}

div[id="map"] .lfh-control-legend.expand img{
 display:block;
 float:left;
 margin-left:5px;
}
 div[id="map"] .lfh-control-legend.expand img:first-child{
  margin-left:0px;
 }
div[id="map"] .lfh-control-legend.expand a{
 display:none;

}
</style>
