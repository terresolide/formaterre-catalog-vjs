<script setup>
const {exportLinks} = defineProps({
    exportLinks: {
        type: Object,
        default: null
    }
})

</script>
<template >
 <span class="mtdt-export-links" v-if="exportLinks.xml || exportLinks.pdf || exportLinks.json">
  <div  class="mtdt-tab-export">
     Export  
     <font-awesome-icon icon="fa-solid fa-caret-down" /> 

  </div>
  <div class="mtdt-expand">
     <div v-if="exportLinks.json"><a :href="exportLinks.json" target="_blank">Export JSON</a></div>
     <div v-if="exportLinks.xml"><a :href="exportLinks.xml" target="_blank">Export XML</a></div>
     <div v-if="exportLinks.pdf"><a :href="exportLinks.pdf" target="_blank">Export PDF</a></div>
  </div>
 </span>
</template>

<style scoped>
.mtdt-export-links{
  color: var(--color-text);
  float:right;
  margin-right:10px;
  position:relative;
  cursor: pointer;
}
.mtdt-tab-export{
  min-width: 80px;
  text-align:center;
  padding: 5px 10px;
  border: 1px dotted grey;
    border-top-width: 1px;
    border-top-style: dotted;
    border-top-color: grey;
  border-top: 0px;
  /* background: #eee;*/
  cursor: pointer;
}
.mtdt-export-links div.mtdt-expand{
  display: none;
  text-align: center;
  position:absolute;
  min-width:102px;
  margin:0;
  right:0px;
  top:35px;
  z-index: 10;
}
.mtdt-export-links div.mtdt-expand div{
   line-height:2;
   padding: 3px 0;
   background: #eee;
   border:1px dotted grey;
   border-top:0px;
}
.mtdt-export-links a{
   color:var(--color-text);
   text-decoration:none;
}
.mtdt-export-links div.mtdt-expand div:hover{
   background: #ccc;
}

.mtdt-export-links:hover div.mtdt-expand{
  display: block;
}
</style>