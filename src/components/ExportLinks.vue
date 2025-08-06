<script setup>
const exportLinks = defineProps({
    exportLinks: {
        type: Object,
        default: null
    }
})

</script>
<template >
 <span class="mtdt-export-links" v-if="exportLinks.xml || exportLinks.pdf || exportLinks.json">
  <div  class="mtdt-tab-export">
    <i class="fa fa-chevron-down"></i>
      <span style="">{{$t('export')}}</span>
  </div>
  <div class="mtdt-expand">
     <div v-if="exportLinks.json"><a :href="exportLinks.json" target="_blank">{{$t('exportJSON')}}</a></div>
     <div v-if="exportLinks.xml"><a :href="exportLinks.xml" target="_blank">{{$t('exportXML')}}</a></div>
     <div v-if="exportLinks.pdf"><a :href="exportLinks.pdf" target="_blank">{{$t('exportPDF')}}</a></div>
  </div>
 </span>
</template>

<style scoped>
.mtdt-export-links{
  float:right;
  margin-right:10px;
}
.mtdt-tab-export{
  min-width: 80px;
  text-align:center;
}
.mtdt-export-links div.mtdt-expand{
  display: none;
  text-align: center;
  position:absolute;
  min-width:102px;
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
   color: black;
   text-decoration:none;
}
.mtdt-export-links div.mtdt-expand div:hover{
   background: #ccc;
}
.mtdt-tab-export:hover + div.mtdt-expand,
.mtdt-export-links .mtdt-expand:hover{
  display: block;
}
</style>