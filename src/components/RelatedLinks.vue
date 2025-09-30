<script setup>
import { computed } from 'vue'
import { useConfig } from '@/stores/config'
import { useSelection } from '@/stores/selection'
// const SimpleLinks = () => import('@/components/SimpleLinks.vue')
import SimpleLinks from '@/components/SimpleLinks.vue'
import DownloadLinks from '@/components/DownloadLinks.vue'
import LayerLinks from '@/components/LayerLinks.vue'
const props = defineProps({
    uuid: String,
    links: Object,
    access: {
        type: Object,
        default: null
    },
    mode: {
        type: String,
        default:'box'
    }
})
let config = useConfig()
let selection = useSelection()

let computedAccess = computed(() => {
    return { view: 'free', download: 'free' }
})
let selectedUuid = computed(() => selection.uuid)
function select() {
    selection.toggle(props.uuid)
}
</script>
<template>

  <div v-if="props.mode === 'box'"
    class="mtdt-related-type"
    :style="{ backgroundColor: uuid === selectedUuid ? config.state.over : config.state.primary }"
    :title="$t('localize')"
    @click="select"
  >
    <font-awesome-icon icon="fa-solid fa-circle-dot" />
  </div>
  <!-- afficher la couche sur la carte -->
  <template v-if="props.links.layers && props.links.layers.length > 0">
    <layer-links :links="props.links.layers" :uuid="uuid" :access="access" :mode="props.mode"></layer-links>
  </template>
  <!-- instrument -->
  <!--
      <div class="mtdt-related-type">
        <font-awesome-icon icon="fa-solid fa-gauge-simple-high" />
      </div>
  -->
  <template v-if="props.links.download && props.links.download.length > 0">
    <download-links :links="props.links.download" :access="computedAccess" mode="props.mode"></download-links>
  </template>

  <!-- commander les données -->
   <template v-if="props.links.order && props.links.order.length > 0">
      <div class="mtdt-related-type">
       <a :href="props.links.order[0].url" target="_blank" :title="props.links.order[0].name">
        <font-awesome-icon icon="fa-solid fa-pen-to-square" />
       </a>
      </div>
  </template>
  <template v-if="props.links.links && props.links.links.length > 0">
    <simple-links :links="props.links.links" type="information" :mode="props.mode"></simple-links>
  </template>
  <template v-if="props.links.relatedLinks && props.links.relatedLinks.length > 0">
    <simple-links :links="props.links.relatedLinks" type="related" :mode="props.mode"></simple-links>
  </template>
</template>
<style>
.mtdt-related-type {
  text-align: center;
  min-width: 20px;
  vertical-align: bottom;
  border-radius: 3px;
  /*background:#8c0209;*/
  background: #754a15;
  padding: 3px 5px;
  color: white;
  margin-right: 3px;
  display: inline-block;
  box-sizing: content-box;
}
.mtdt-expand ul {
  list-style: none;
  padding-left: 0;
}
.mtdt-related-type {
  cursor: pointer;
  opacity: 0.9;
}
.mtdt-related-type.disabled,
a.disabled,
span.disabled,
.mtdt-expand span.disabled {
  pointer-events: none;
  opacity: 0.5;
}
.mtdt-related-type:hover {
  opacity: 1;
}
.mtdt-expand {
  margin: 20px 10px 30px 10px;
  text-align: left;
}

.mtdt-links a,
.mtdt-links span {
  padding: 1px 3px;
  cursor: pointer;
  color: #444;
  display: inline-block;
  width: 100%;
}
.wrapper-content .mtdt-app .mtdt-links a:hover,
.mtdt-links a:hover,
.wrapper-content .mtdt-app .mtdt-links span:hover,
.mtdt-links span:hover {
  background: darkred;
  color: white;
}
.mtdt-layers li:hover {
  color: darkred;
}
.element-metadata-flex .mtdt-related-type + .mtdt-expand {
  display: none;
  position: absolute;
  bottom: -3px;
  right: 0;
  z-index: 100;
  height: auto;
  min-width: 200px;
  max-width: 320px;
  background: white;
  padding: 5px;
  border-radius: 3px;
  border: 1px dotted grey;
  box-shadow: 2px 2px 2px 1px rgba(0, 0, 0, 0.5);
  width: auto;
  text-align: left;
  max-height: 230px;
  overflow-y: scroll;
}
.element-metadata-flex .mtdt-expand:hover {
  display: block;
}
.element-metadata-flex .mtdt-related-type:hover + .mtdt-expand {
  display: block;
}
.mtdt-related-type span {
  font-size: 0.8em;
  margin-left: 3px;
}
.mtdt-related .mtdt-expand label {
  font-weight: 500;
}

.mtdt-related .mtdt-expand ul {
  padding: 0;
  list-style: none;
  margin: 5px 3px 5px 9px;
}
.mtdt-expand ul {
  display: block;
  margin-top:4px;
}
.element-metadata-flex .mtdt-expand ul li,
.element-metadata-flex .mtdt-expand ul li div {
  word-break: break-word;
  line-height:1;
  padding-bottom:3px;
  font-size:0.9rem;
}
.mtdt-expand ul li {
  word-break: break-word;
  padding: 2px;
  margin: 0;
  line-height:1;
  cursor: pointer;
}
.mtdt-expand ul li.disabled {
  pointer-events: none;
  opacity: 0.5;
}
.mtdt-expand ul:not(.mtdt-layers) li:before {
  content: '\2192';
  padding: 0 5px;
  display: table-cell;
  font-size: 1.1em;
}

.element-metadata-flex .mtdt-expand ul:not(.mtdt-layers) li:before {
  content: '-';
  vertical-align: top;
  padding: 0 5px;
  display: table-cell;
}
.mtdt-expand ul:not(.mtdt-layers) li a,
.mtdt-expand ul:not(.mtdt-layers) li span,
.mtdt-expand ul:not(.mtdt-layers) li div {
  display: table-cell;
  max-width: 92%;
}
.element-metadata-flex .mtdt-expand ul:not(.mtdt-layers) li > a,
.element-metadata-flex .mtdt-expand ul:not(.mtdt-layers) li > span {
  display: table-cell;
  max-width: 300px;
}
.mtdt-related ul.mtdt-layers {
  list-style-type: none;
  margin-left: 0px;
  text-align: left;
}
ul.mtdt-layers li {
  cursor: pointer;
  text-align: left;
}
.mtdt-related ul.mtdt-layers li {
  vertical-align: text-top;
  min-width: 51%;
  max-width: 100%;
}
.mtdt-related ul.mtdt-layers li div {
  display: inline-block;
  max-width: 85%;
  vertical-align: top;
  word-break: break-word;
  text-align: justify;
}
.element-metadata-flex ul.mtdt-layers li i.fa {
  margin-right: 3px;
}
ul.mtdt-layers li div {
  text-overflow: clip;
  margin: 0;
  padding: 0;
  width: calc(100% - 35px);
  overflow: hidden;
  word-break: break-word;
  vertical-align: top;
  line-height: 1;
  max-height: 32px;
  padding: 2px 0;
  display: inline-block;
  margin-left: 3px;
}
.element-metadata-flex .mtdt-expand h4 {
  margin: 5px 0px;
}
</style>
