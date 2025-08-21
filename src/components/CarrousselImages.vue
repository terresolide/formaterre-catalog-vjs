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
    <span class="circle left" v-if="data.selected > 0" @click="data.selected -= 1">
         <font-awesome-icon icon="fa-solid fa-circle-chevron-left" /> 
          
    </span>
    <span class="circle right" v-if="images.length > 0 && data.selected < images.length - 1" @click="data.selected += 1">
        <font-awesome-icon icon="fa-solid fa-circle-chevron-right" /> 
    </span>
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
  display:block;
   max-width: 100%;
  /* max-height:260px;*/
   background: #eee;
   margin: 0px 15px 10px 0;
}
.mtdt-quicklooks div.wrapper{
   text-align:center;
   max-width: 100%;
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
  max-width:100%;
  max-height:260px;
  display:block;
  margin:auto;
  vertical-align:middle;
}
.mtdt-quicklooks .circle {
  position: absolute;
  font-size:40px;
  top: 80px;
  z-index:1;
  opacity:0.3;
  cursor: pointer;
}
 .mtdt-quicklooks:hover .circle {
   opacity:0.3
 }
.mtdt-quicklooks .circle:hover {
  opacity: 0.7;
}
.mtdt-quicklooks .right{
  right:1px;
  margin-right:0;
}
.mtdt-metadata .mtdt-quicklooks .left{
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