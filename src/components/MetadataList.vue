<script setup>
import { computed } from 'vue';
import MetadataBox from '@/components/MetadataBox.vue'
const props = defineProps({
    list: Array
}) 
</script>
<template>
     <div class="wrapper-group-2">
       <div class="container-flex"> 
            <template v-for="item in props.list" >
                 <metadata-box :metadata="item"></metadata-box> 
            </template>
        </div>
    </div>
</template>
<style>
div.wrapper-group-2{
    text-align: center;
   /* height:calc(100% - 60px);
    line-height: calc(100% - 60px);*/
    max-height:calc(100vh - 80px);
    overflow-y:scroll;
  }
  div.container-flex {
  display: -webkit-box;
  display: -ms-flexbox;
    display: flex;
  -webkit-box-orient: horizontal;
  -webkit-box-direction: normal;
  -ms-flex-flow: row wrap;
  flex-flow: row wrap;
  /*-webkit-box-pack: justify;
  -ms-flex-pack: justify;
  justify-content: space-between;*/
    margin:auto;
   /* max-width:1200px;*/
   /* margin-left: calc(50% - 45vw);
  margin-right: calc(50% - 45vw);*/
  
  -webkit-box-pack: space-evenly;
  -ms-flex-pack: space-evenly;
  justify-content: space-evenly;
   max-width:1200px;
  }
  

  
 
  a.service-link > div {
    max-height:200px;
    overflow:hidden;
  }
  a img{
      -webkit-transition: 0.5s ease all;
      transition: 0.5s ease all;
      margin: 0;
  }
  a img:hover {
    transform: scale(1.03);
  }
  
  a.service-link {
    margin:5px;
    line-height: 1.1;
    text-align:justify;
    text-decoration:none;
    color: black;
  }
  a.service-link:not(.md-button):not(.md-bottom-bar-item):hover{
    opacity:1;
    text-decoration:none;
  }
  
  a.service-link div.service-description {
    text-align: left;
    text-shadow:none;
    color:black;
  }
  @media screen and (max-width: 767px) {
    h3,
    figure div {
       font-size:1.1rem;
    }
  }
  </style>