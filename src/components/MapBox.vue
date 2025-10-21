<script setup>
import { computed, ref, reactive, onMounted, watch } from 'vue'
import {useRoute, useRouter} from 'vue-router'
import L from 'leaflet'
import '@/modules/leaflet.control.mylayers.js'
import '@/modules/leaflet.control.legend.js'
import '@/modules/leaflet.control.fullscreen.js'
import 'leaflet-draw'
import { useSelection } from '@/stores/selection'
import { useConfig } from '@/stores/config'
import DraggableBox from '@/components/DraggableBox.vue'

// initialize window.type for leaflet-draw bug
window.type = true

const getReader = () => import('@/modules/capabilities-reader.js')
const config = useConfig()
const route = useRoute()
const router = useRouter()
const map = ref(null)

const props = defineProps({
  list: Array,
  bbox: Object
})

const data = reactive({
  map: null,
  controlLayer: null,
  controlLegend: null,
  controlDraw: null,
  layers: [],
  bbox: null, // ensemble des bbox
  singleBbox: null, // bbox pour page metadonnées
  selectedBbox: null, // la bbox sélectionnée parmi toutes
  drawnBbox: null, // la bbox dessinée
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
    case 'OGC:WMS-1.1.1-http-get-map':
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
      console.log('get map')
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
          opacity: 0.5
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
      //        this.addLayerToMap(layer.id, newLayer)
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
      //              this.addLayerToMap(layer.id, newLayer)
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
        addLayerToMap(layer.id, newLayer)
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
  var tileLayer = L.tileLayer(layer.url, layer.options)
  addLayerToMap(layer.options.id, tileLayer)
}
function addWMSLayer(layerObj, metaId) {
  // add bearer if necessary
  // layerObj.options._bearer = 'mon bearer'
  var newLayer = L.tileLayer.wms(layerObj.url, layerObj.options)
  addLayerToMap(layerObj.options.id, newLayer)
  addLegend()
  // Add legend if there is specific legend with the layer and only one metadata
 // if (layerObj.options.legend && selection.uuid && layerObj.options.uuid === selection.uuid ) {
 //    data.legendControl.addLegend(selection.uuid, layerObj.id, layerObj.options.legend.src)
 //  }
 // } else if (data.selectedMetadata && data.selectedMetadata.legend) {
 //   data.legendControl.addLegend(data.selectedMetadata.id, '0', data.selectedMetadata.legend)
 // }
}
function addLegend () {
    if (!selection.uuid) {
        return
    }
    // get layers
    var layers = []
    for (var key in data.layers) {
        if (data.layers[key].options.uuid === selection.uuid) {
            layers.push(data.layers[key])
        }
    }
    for (var i in layers) {
        if (layers[i].options.legend) {
            data.legendControl.addLegend(selection.uuid, layers[i].options.id, layers[i].options.legend.src)
        }
    }
}
function addLayerToMap(id, newLayer) {
  if (newLayer) {

    newLayer.addTo(data.map)
    newLayer.bringToFront()
    data.layers[id] =  newLayer
    data.controlLayer.addOverlay(newLayer, newLayer.options.layers)
  }
}

function validBbox (bounds) {
  if (!data.drawnBbox) {
      return
  }
  data.drawnBbox.clearLayers()

  var query = Object.assign({}, route.query)
  if (!bounds) {
   delete query.bbox
   router.push({name:route.name, params: route.params, query: query})
   return null
  }
  let box = { north: Math.round(bounds.getNorth() * 10000) / 10000,
    south: Math.round(bounds.getSouth() * 10000) / 10000,
    east: Math.round(bounds.getEast() * 10000) / 10000,
    west: Math.round(bounds.getWest() * 10000) / 10000
  }
  // valid bbox
  if (box.east > 180 || box.west < -180) {
     var delta = box.east - box.west
     if ( delta > 360) {
       box.east = 180
       box.west = -180
     }else {
       box.west = L.modLng(bbox.west);
       box.west = bbox.west === 180 ? -180 : box.west
       box.east = Math.min(box.west + delta, 180)
     }
  }
  query.bbox = box.west + ',' + box.south + ',' + box.east + ',' + box.north
  router.push({name:route.name, params: route.params, query: query})

  return box;
}

function drawBbox (query) {
     if (!data.drawnBbox) {
         return
     }
     data.drawnBbox.clearLayers()
     if (query.bbox) {
           var points = query.bbox.split(',')
           points = points.map(x => parseFloat(x))
           var bounds = [[points[1], points[0]], [points[3], points[2]]]
           var rectangle = L.rectangle(bounds, {color: '#ff0000'})

           data.drawnBbox.addLayer(rectangle)

          // bounds = data.drawnBbox.getBounds()
           data.map.fitBounds(bounds)
       } else {
           data.drawnBbox.clearLayers()
       }
}
watch(
    () => route.query,
    (query) => {
       drawBbox(query)
})
watch(
    () => props.bbox,
    (bbox) => {
        if(data.singleBbox) {
            data.singleBbox.remove()
            data.singleBbox = null
        }
        if (bbox) {
            data.singleBbox = L.geoJSON(bbox, { style: selectedOptions })
            data.singleBbox.addTo(data.map)
            let bounds = data.singleBbox.getBounds()
            if (bounds) {
                data.map.fitBounds(bounds, [10, 10])
            }
        }
    }
)
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
      if (mtdt.geom) {
        if (mtdt.geom.length === 1) {
          geojson.features.push({
            type: 'Feature',
            id: mtdt.id,
            geometry: mtdt.geom[0],
          })
        } else {
          var geometry = { type: 'MultiPolygon', coordinates: [] }
          mtdt.geom.forEach(function (geom) {
            geometry.coordinates.push(geom.coordinates)
          })
          geojson.features.push({ type: 'Feature', id: mtdt.id, geometry: geometry })
        }
      }
    })
    if (geojson.features.length > 0) {
        data.bbox.addLayer(L.geoJSON(geojson, { style: currentOptions }))
        data.bbox.addTo(data.map)
        var bounds = data.bbox.getBounds()
        if (bounds) {
            data.map.fitBounds(bounds)
        }
    }
  },
)
watch(
  () => selection.uuid,
  (uuid) => {
    if (data.selectedBbox) {
      data.selectedBbox.setStyle(currentOptions)
    }
    data.legendControl.removeAll()
    if (!uuid) {
      data.selectedBbox = null
      
      var bounds = data.bbox.getBounds()
        if (bounds.isValid()) {
            data.map.fitBounds(bounds)
        }

      return
    }
    var layers = data.bbox.getLayers()
    if (layers.length === 0) {
        return
    }
    layers = layers[0].getLayers()

    data.selectedBbox = layers.find((ly) => ly.feature.id === uuid)
    if (data.selectedBbox) {
        data.selectedBbox.setStyle(selectedOptions)
        data.map.fitBounds(data.selectedBbox.getBounds())
        // if layer add legend
        addLegend()
    }

  },
)
watch(
  () => selection.layers,
  (layers) => {
    var onMap = layers.map(l => l.id)
    // remove layers
    for(var key in data.layers) {
        if (onMap.indexOf(key) < 0) {
            data.controlLayer.removeLayer(data.layers[key])
            data.layers[key].remove()
            delete data.layers[key]
            // data.legendControl.removeLegend(key)
        }
    }
    // add new layers
    layers.forEach(function (layer) {
      if (!data.layers[layer.id]) {
          addLayer(layer)
      }
    })
  },
  { deep: true },
)

function initDrawControl () {
    data.drawnBbox = L.featureGroup()
    data.drawnBbox.addTo(data.map)
    data.controlDraw = new L.Control.Draw({
         draw: {
          rectangle: {
            shapeOptions: {
              color: '#ff0000'
            }
          },
          circlemarker: false,
          circle: false,
          marker: false,
          polygon: false,
          polyline: false
        },
        edit: {
          featureGroup: data.drawnBbox
        }
    })
    data.controlDraw.addTo(data.map)
    data.map.on(L.Draw.Event.CREATED, function (e) {
        let layer = e.layer
        let bounds = e.layer.getBounds()
        validBbox(bounds)
    })
    data.map.on(L.Draw.Event.EDITED, function (e) {

        let bounds
        e.layers.eachLayer(function (layer) {
          bounds = layer.getBounds()
        })
        validBbox(bounds)
    })

    data.map.on(L.Draw.Event.DELETED , function (e) {
        validBbox(null)
    })
    data.controlLayer.addOverlay(data.drawnBbox, 'Seleted Area')
    drawBbox(route.query)
}
function initialize() {
  if (data.map) {
    return
  }

  data.map = L.map(map.value).setView([35, 5], 3)
  data.controlLayer = new L.Control.MyLayers(null, null, { position: 'topright' })
  data.controlLayer.tiles.arcgisTopo.layer.addTo(data.map)
  data.controlLayer.addTo(data.map)
  data.bbox = L.featureGroup()
  data.controlLayer.addOverlay(data.bbox, 'Les bbox')
  var fullscreen = new L.Control.Fullscreen('fmtLargeMap', {lang: config.state.lang, mouseWheel: true})
  fullscreen.addTo(data.map)
  L.control.scale().addTo(data.map)
  data.legendControl = new L.Control.Legend(config.state.lang, function (uuid) {
     // create Dom identifier from uuid
      // first character must be letter and character other than "_" and "-" are forbidden
      return 'i' + uuid.toLowerCase().replace(/[^a-z0-9\-_]+/, '')
  })
  data.legendControl.addTo(data.map)
  initDrawControl()

}
onMounted(() => {
  initialize()
})
</script>
<template>
    <DraggableBox>
        <div id="fmtLargeMap"></div>
    </DraggableBox>
    <div class="map-container">
        <div id="map" ref="map" class="mtdt-small"></div>
    </div>
</template>
<style src="leaflet/dist/leaflet.css" />
<style src="leaflet-draw/dist/leaflet.draw.css"></style>
<style>

div[id="fmtLargeMap"] {
    width:calc(100% - 20px);
    margin:auto;
    height:calc(100% - 40px);
}
div[id='map'] {
  position: relative;
  height: 100%;
  width: 100%;
  z-index:1;
}
div.map-container {
  height: 200px;
}
div[id='map'].mtdt-small .leaflet-top .leaflet-control {
  margin-top: 2px;
}
div[id='map'].mtdt-small .leaflet-left .leaflet-control {
  margin-left: 2px;
}
div[id='map'].mtdt-small .leaflet-control-scale {
    margin-bottom:2px;
}
div[id='map'].mtdt-small .leaflet-control .leaflet-control-zoom-in,
div[id='map'].mtdt-small .leaflet-control .leaflet-control-zoom-out {
    font-size: 15px;
    padding:0;
}
div[id='map'].mtdt-small .leaflet-bar a,
div[id='map'].mtdt-small .leaflet-control a {
    width: 15px;
    height: 15px;
    line-height: 15px;
    background-size: 14px 14px;

}
/** leaflet draw **/

/** menu leaflet draw */
 div[id="map"] .leaflet-container .leaflet-draw-section a {
   color: #fff;
   font-weight: 700;
 }
div[id="map"] .leaflet-draw-actions li a {
   color: #fff;
}
div[id="map"] .leaflet-draw-actions li {
  display: block;
  margin: 0 0 1px 0;
  border-radius: 0;
}
div[id="map"] .leaflet-draw-actions {
  background: #555;
  margin-left:5px;
  padding: 2px;
  -webkit-border-radius: 0 4px 4px 4px;
  border-radius: 0 4px 4px 4px;
}
div[id="map"] .leaflet-draw-actions li:first-child a{
  -webkit-border-radius: 0 4px 0 0;
  border-radius: 0 4px 0 0;
}
div[id="map"] .leaflet-draw-actions li:last-child a{
  -webkit-border-radius: 0 0px 4px 4px;
  border-radius: 0 0px 4px 4px;
}
/** leaflet draw small **/
div[id="map"].mtdt-small .leaflet-control.leaflet-draw a {
    background-size: 300px 30px;
}
div[id='map'].mtdt-small.leaflet-touch .leaflet-draw-toolbar .leaflet-draw-draw-rectangle {
  background-position: -67px -7px;
}
div[id='map'].mtdt-small.leaflet-touch .leaflet-draw-toolbar .leaflet-draw-edit-edit  {
  background-position: -157px -7px;
}
div[id="map"].mtdt-small.leaflet-touch .leaflet-draw-toolbar .leaflet-draw-edit-edit.leaflet-disabled {
  background-position: -217px -7px;
}
div[id="map"].mtdt-small.leaflet-touch .leaflet-draw-toolbar .leaflet-draw-edit-remove {
  background-position: -187px -7px;
}
div[id="map"].mtdt-small.leaflet-touch .leaflet-draw-toolbar .leaflet-draw-edit-remove.leaflet-disabled {
  background-position: -247px -7px;
}
/** menu leaflet draw small **/
div[id="map"].mtdt-small .leaflet-draw-actions {
    left: 15px;
}
div[id="map"].mtdt-small .leaflet-container .leaflet-draw-section a {
  color: #fff;
  font-size: 0.9rem;
}
  div[id="map"].mtdt-small .leaflet-draw-actions li a {
  color: #fff;
  width:auto;
  height:20px;
}
/** div[id="map"].mtdt-small .leaflet-draw-actions li {
  display: block;
  margin: 0 0 1px 0;
  border-radius: 0;
}
div[id="map"].mtdt-small .leaflet-draw-actions {
  background: #555;
  margin-left:5px;
  padding: 2px;
  -webkit-border-radius: 0 4px 4px 4px;
  border-radius: 0 4px 4px 4px;
}
div[id="map"].mtdt-small .leaflet-draw-actions li:first-child a{
  -webkit-border-radius: 0 4px 0 0;
  border-radius: 0 4px 0 0;
}
div[id="map"].mtdt-small .leaflet-draw-actions li:last-child a{
  -webkit-border-radius: 0 0px 4px 4px;
  border-radius: 0 0px 4px 4px;
}
**/
/** other control **/
div[id="map"].mtdt-small .leaflet-control-layers-list {
    font-size: 0.9em;
}
div[id='map'].mtdt-small .leaflet-control-scale-line {
    font-size:9px;
    max-width: 50px;
    padding:2px;
}
div[id='map'].mtdt-small .leaflet-right .leaflet-control {
    margin-right: 2px;
}
div[id='map'].mtdt-small .leaflet-control-attribution {
    font-size:9px;
    padding:2px;
    line-height:1.1;
}
div[id="map"] .lfh-control-legend {
    cursor: pointer;
    background: white;
    display:none;
}
 div[id="map"].mtdt-small  div.lfh-control-legend a.icon-palette,
 div[id="map"].mtdt-small  div.lfh-control-fullscreen a {
    padding:1px;
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
