<script setup>
import { computed} from 'vue';
import {useConfig} from '@/stores/config'
import {useSelection} from '@/stores/selection'
// const SimpleLinks = () => import('@/components/SimpleLinks.vue')
import SimpleLinks from '@/components/SimpleLinks.vue'
import DownloadLinks from '@/components/DownloadLinks.vue'
const props = defineProps({
   uuid: String,
   links: Object
})
let config = useConfig()
let selection = useSelection()
let links = computed(() => {
    
})
let selectedUuid = computed(() => selection.uuid)
function select() {
  selection.toggle(props.uuid)
}
console.log(config)

</script>
<template>
  <!-- afficher la position sur la carte -->
  <div class="mtdt-related-type" :style="{backgroundColor: uuid === selectedUuid ? config.state.over: config.state.primary}" @click="select">
    <font-awesome-icon icon="fa-solid fa-circle-dot" />
  </div>
  <!-- afficher la couche sur la carte -->
  <div class="mtdt-related-type">
    <font-awesome-icon icon="fa-solid fa-earth-americas" />
  </div>
  <!-- instrument -->
  <div class="mtdt-related-type">
    <font-awesome-icon icon="fa-solid fa-gauge-simple-high" />
  </div>
  <template v-if="props.links.download && props.links.download.length > 0">
   <download-links :links="props.links.download"></download-links>
  </template>
 
  <!-- commander les données -->
  <div class="mtdt-related-type">
    <font-awesome-icon icon="fa-solid fa-pen-to-square" />
  </div>
  
   <template v-if="props.links.links && props.links.links.length > 0">
    <simple-links :links="props.links.links" type="information"></simple-links>
  </template>
  <template v-if="props.links.relatedLinks && props.links.relatedLinks.length > 0">
    <simple-links :links="props.links.relatedLinks" type="related"></simple-links>
  </template>
  
  
</template>
<style>
.mtdt-related-type{
 text-align:center;
 min-width:20px;
 vertical-align:bottom;

 border-radius:3px;
 /*background:#8c0209;*/
 background:#754a15;
 padding:3px 5px;
 color:white;
 margin-right:3px;
 display:inline-block;
 box-sizing: content-box;
}
.mtdt-expand ul {
  list-style:none;
  padding-left:0;
}
 .mtdt-related-type{
   cursor:pointer;
   opacity:0.9
}
 .mtdt-related-type.disabled,
a.disabled ,
span.disabled,
.mtdt-expand span.disabled {
  pointer-events:none;
  opacity:0.5;
}
 .mtdt-related-type:hover{
  opacity:1;
}
 .mtdt-expand{
  margin: 20px 10px 30px 10px;
  text-align:left;
}
.mtdt-related-metadata .mtdt-links.mtdt-expand{
  display:block;
}
.mtdt-links a,
.mtdt-links span {
  padding: 1px 3px;
  cursor:pointer;
  color: #444;
  display: inline-block;
  width: 100%;
}
.wrapper-content .mtdt-app .mtdt-links a:hover,
.mtdt-links a:hover,
.wrapper-content .mtdt-app .mtdt-links span:hover,
.mtdt-links span:hover {
  background: darkred;
  color:white;
}
.mtdt-layers li:hover {
  color: darkred;
}
.element-metadata-flex .mtdt-related-type + .mtdt-expand{
    display:none;
    position:absolute;
    bottom: -3px;
    right:0;
    z-index:100;
    height:auto;
    min-width:200px;
    max-width:320px;
    background:white;
    padding:5px;
    border-radius:3px;
    border:1px dotted grey;
    box-shadow: 2px 2px 2px 1px rgba(0, 0, 0, 0.5);
    width:auto;
    text-align:left;
    max-height: 230px;
    overflow-y:scroll;
}
.element-metadata-flex .mtdt-expand:hover {
  display: block;
}
.element-metadata-flex  .mtdt-related-type:hover + .mtdt-expand{
  display:block;
}
 .mtdt-related-type span{
 font-size:0.8em;
 margin-left:3px;
}
 .mtdt-related .mtdt-expand label{
  font-weight: 500;
}
 
  .mtdt-related .mtdt-expand ul {
  padding:0;
  list-style: none;
  margin:  5px 3px 5px 9px;

}
.mtdt-related-metadata .mtdt-expand ul {
  display:inline;
}
.element-metadata-flex .mtdt-expand ul li {
     word-break: break-word;
  }
 .mtdt-related-metadata .mtdt-expand ul li {
 word-break: break-word;
  padding: 2px;
  margin:  0;
  cursor:pointer;
 
}
 .mtdt-related-metadata .mtdt-expand ul li.disabled {
   pointer-events: none;
   opacity:0.5
   }
.mtdt-related-metadata .mtdt-expand ul:not(.mtdt-layers)  li:before{
content: "\2192";
padding: 0 5px;
display: table-cell;
font-size: 1.1em;
}

.element-metadata-flex .mtdt-expand ul:not(.mtdt-layers)  li:before {
  content: "-";
  vertical-align:top;
  padding: 0 5px;
display: table-cell;
}
.mtdt-related-metadata .mtdt-expand ul:not(.mtdt-layers)  li a,
.mtdt-related-metadata .mtdt-expand ul:not(.mtdt-layers)  li span,
.mtdt-related-metadata .mtdt-expand ul:not(.mtdt-layers)  li div{

display: table-cell;
max-width:92%;
}
.element-metadata-flex .mtdt-expand ul:not(.mtdt-layers)  li > a,
.element-metadata-flex .mtdt-expand ul:not(.mtdt-layers)  li > span{
   display: table-cell;
   max-width:300px;
}
 .mtdt-related ul.mtdt-layers{
  list-style-type: none;
  margin-left:0px;
  text-align:left;
}
 ul.mtdt-layers li{
  cursor: pointer;
  text-align:left;
}
 .mtdt-related ul.mtdt-layers li {
  vertical-align:text-top;
  min-width:51%;
  max-width:100%;
  
}
.mtdt-related ul.mtdt-layers li div{
   display: inline-block;
   max-width:85%;
   vertical-align:top;
   word-break: break-word;
   text-align:justify;
}
.element-metadata-flex ul.mtdt-layers li i.fa {
   margin-right: 3px;
 }
.element-metadata-flex ul.mtdt-layers li div{

    text-overflow: clip;
    margin:0;
    padding:0;
    width: calc(100% - 35px);
    overflow: hidden;
    word-break: break-word;
    vertical-align: top;
    line-height:0.9;
    max-height:32px;
    padding:2px 0;
}
.element-metadata-flex .mtdt-expand h4 {
   margin: 5px 0px;
 }
</style>