<script setup>
import { computed, ref, reactive, onMounted, watch } from 'vue'
import L from 'leaflet'
import '@/modules/leaflet.control.mylayers.js'
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
  layers: [],
  bbox: null,
  selectedBbox: null,
  reader: null
})
const selectedOptions = {
  color: 'red',
  fillColor: 'red',
  fillOpacity: 0.3,
  strokeWidth: 1,
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

function searchBboxBoundsById(id) {
  var self = this
  var bounds = null
  data.bbox.eachLayer(function (layer) {
    if (layer.options.id === id || (layer.feature && layer.feature.id === id)) {
      var bds = layer.getBounds()
      if (!bounds) {
        bounds = bds
      } else {
        bounds.extend(bds)
      }
    }
  })
  return bounds
}
function addLayer(layer, zoom) {
  
  var metaId = layer.id.split('_')[0]
  console.log(metaId)
  // var token = event.detail.token

  var bounds = searchBboxBoundsById(metaId)
  var newLayer = null

  switch (layer.type) {
    case 'WMS':
    case 'OGC:WMS':
    case 'OGC Web Map Service':
      var regex = new RegExp(/GetCapabilities/i)
      if (regex.test(layer.url)) {
        beforeAddWMS(layer, metaId, zoom)
        return
      }
      if (!layer.options) {
        var extract = layer.url.match(/^(.*\?).*$/)
        var url = extract[1]
        layer.url = url
        layer.options = {
          id: layer.id,
          service: 'WMS',
          layers: layer.name,
          format: 'image/png',
          opacity: 0.5,
        }
        if (token && token !== -1) {
          layer.options._bearer = token
        }
      }
      addWMSLayer(layer, metaId, zoom)
      break
    case 'GetMap':
      if (!layer.options) {
        layer.options = {
          id: layer.id,
          service: 'WMS',
          layers: layer.name,
          format: 'image/png',
          opacity: 0.5,
        }
      }
      addWMSLayer(layer, metaId, zoom)
      break
    case 'WMTS':
    case 'OGC API - Tiles':
    case 'WTS':
      if (!layer.options) {
        layer.options = {
          id: layer.id,
          service: 'WTS',
          layers: layer.name,
        }
      }
      this.addWTSLayer(layer, metaId)
      break
    case 'XXX':
      var extract = layer.url.match(/^(.*\?).*$/)
      var url = extract[1]
      var options = {
        service: 'WMS',
        layers: layer.name,
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
      //              this.addLayerToMap(layer.id, metaId, newLayer, zoom)
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
        addLayerToMap(layer.id, metaId, newLayer, zoom)
      })
      break

    // var kmlLayer = new L.KML(layer.href, {async: true});
    // kmlLayer.addTo(this.map)
  }
}
function beforeAddWMS(layer, metaId, zoom) {
  if (!data.reader) {
    getReader().then((rd) => {
      console.log(rd)
      data.reader = rd.default
      data.reader.init(config.state.proxy)
      data.reader.loadInfo(layer, { opacity: 0.5, zoom: zoom }, metaId, addWMSLayer)
    })
  } else {
      data.reader.loadInfo(layer, { opacity: 0.5, zoom: zoom }, metaId, addWMSLayer)
  }
}
function addWTSLayer(layer, metaId) {
  var tileLayer = L.tileLayer(layer.href, { opacity: 0.5 })
  addLayerToMap(layer.options.id, metaId, tileLayer, true)
}
function addWMSLayer(layerObj, metaId, zoom) {
  // add bearer if necessary
  // layerObj.options._bearer = 'mon bearer'
  var newLayer = L.tileLayer.wms(layerObj.url, layerObj.options)
  addLayerToMap(layerObj.options.id, metaId, newLayer, zoom)
  // Add legend if there is specific legend with the layer and only one metadata
 // if (layerObj.options.legend && selection.uuid && layerObj.id.indexOf(selection.uuid) >= 0) {
 //   data.legendControl.addLegend(selection.uuid, layerObj.id, layerObj.options.legend.src)
 // } else if (data.selectedMetadata && data.selectedMetadata.legend) {
 //   data.legendControl.addLegend(data.selectedMetadata.id, '0', data.selectedMetadata.legend)
 // }
}
function addLayerToMap(id, groupId, newLayer, zoom) {
  if (newLayer) {
    newLayer.addTo(data.map)
    newLayer.bringToFront()
    data.layers[id] =  newLayer
    var bounds = searchBboxBoundsById(groupId)
    console.log(bounds)
    console.log(groupId)
    if (newLayer._kml) {
      bounds = newLayer.getBounds()
    }
    if (bounds && zoom) {
      data.map.fitBounds(bounds, { animate: true, padding: [30, 30] })
    }
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
    if (!uuid) {
      data.selectedBbox = null
      data.map.fitBounds(data.bbox.getBounds())
      return
    }
    var layers = data.bbox.getLayers()
    data.selectedBbox = layers.find((ly) => ly.feature.id === uuid)
    data.selectedBbox.setStyle(selectedOptions)
    data.map.fitBounds(data.selectedBbox.getBounds())
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
</style>
