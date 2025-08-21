<script setup>
import {reactive} from 'vue'
const {images} = defineProps({
    images: Array
})
const data = reactive({
    selected: 0
})
</script>
<template>
     <span class="mtdt-quicklooks" v-if="images">
    <span class="fa fa-chevron-circle-left" v-if="selected > 0" @click="data.selected -= 1">
        
    </span>
    <i class="fa fa-chevron-circle-right" v-if="images.length>0 && data.selected < images.length - 1" @click="selected += 1"></i>
    <div class="wrapper">
    <div v-for="(image, index) in images" :key="index" :class="{'selected': data.selected === index}">

      <img :src="image[1]" :alt="image[2].substring(0, 50)" />
      <div style="max-height:34px; max-width:230px;padding:3px;margin:0;line-height:1;word-wrap:break-word;">{{image[2].substring(0,100)}}</div>
    </div>
    </div>
 </span>
</template>
<style scoped>
.mtdt-quicklooks{
  position: relative;
   float:left;
   max-width: 200px;
  /* max-height:260px;*/
   background: #ddd;
   margin: 0px 15px 10px 0;
}
.mtdt-quicklooks div.wrapper{
   text-align:center;
   max-width: 200px;
   max-height:296px;
   line-height:180px;
   margin:auto;
   padding:0;
   width: 340px;
}
.mtdt-quicklooks div.wrapper > div{
  display:none;
}
.mtdt-quicklooks div.wrapper .selected{
  display:inline-block;
  text-align:center;
  vertical-align: middle;
  margin:auto;
}
.mtdt-quicklooks img{
  width:100%;
  max-width:180px;
  max-height:260px;
  display:block;
  margin:auto;
  vertical-align:middle;
}
.mtdt-catalogue .mtdt-quicklooks .fa-chevron-circle-right,
.mtdt-catalogue .mtdt-quicklooks .fa-chevron-circle-left{
  position: absolute;
  font-size:40px;
  top: 110px;
  z-index:1;
  opacity:0;
  cursor: pointer;
}
 .mtdt-quicklooks:hover .fa {
   opacity:0.3
 }
.mtdt-quicklooks .fa-chevron-circle-right:hover,
.mtdt-quicklooks .fa-chevron-circle-left:hover{
  opacity: 0.7;
}
 .mtdt-metadata .mtdt-quicklooks .fa-chevron-circle-right{
  right:1px;
  margin-right:0;
}
.mtdt-metadata .mtdt-quicklooks .fa-chevron-circle-left{
  left:1px;
  margin-left:0;
}
@media screen and (min-width:1100px) {
  .mtdt-quicklooks{
   max-width: 250px;
  }
  .mtdt-quicklooks div.wrapper{
     max-width: 250px;
      line-height:240px;
  }
  .mtdt-quicklooks img{
    max-width:230px;
  }
}
@media screen and (min-width:1500px) {
  .mtdt-quicklooks{
   max-width: 340px;
    }
    .mtdt-quicklooks div.wrapper{
       max-width: 340px;
        line-height:300px;
    }
    
    
    .mtdt-quicklooks img{
      max-width:320px;
    }
}
</style>