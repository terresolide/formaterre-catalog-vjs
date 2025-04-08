<script setup>
import { computed } from 'vue';
import {useCatalog} from '@/stores/catalog';
import CatalogBox from './CatalogBox.vue';
let catalog = useCatalog()
const list = computed(() => {
  return catalog.list
})
</script>
<template>
    <div class="wrapper-group">
        <div class="container-flex">
            <template v-for="item in list" >
                <catalog-box :catalog="item"></catalog-box>
            </template>
        </div>
    </div>
</template>
<style>
div.wrapper-group{
    text-align: center;
    height:calc(100% - 60px);
    line-height: calc(100% - 60px);
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
  

  div.element-flex {
  position:relative;
  display:block;
  /* width: auto;
  -webkit-box-flex: 1;
  -ms-flex: 1 1 250px;
  flex: 1 1 250px;
  
  max-height:550px;*/
  width: auto;
  -webkit-box-flex: 1;
  -ms-flex: 1 1 330px;
  flex: 1 1 330px;
  
   padding: 20px;
  margin: 0 10px 20px;
  -webkit-box-shadow: 0 0px 3px rgba(0,0,0,0.5);
  box-shadow: 0 0px 3px rgba(0,0,0,0.5);
  position: relative;
  background: #fff;
  
  
  }
  div.element-flex > div:first-child {
      position:relative;
      overflow: hidden;
      /*padding: 20px;
      /*margin: 0 10px 20px;
      box-shadow: 0 0px 3px rgba(0,0,0,0.5);*/
  }
  div.element-flex  div.more-info {
   position:absolute;
   height: 30px;
  text-align: center;
  width: 100%;
  left: 0;
  bottom:0;
  background: #f9f9f9;
  padding: 3px 5px;
  vertical-align: middle;
  box-sizing: border-box;
  line-height: 30px;
  }
  div.element-flex  div.more-info a:hover {
    text-decoration:underline;
  }
  figure {
    width:100%;
    height:250px;
    margin:-15px 0 0 0;
    position:relative;
  }
  figure div {
    position:absolute;
    top:70px;
    color:white;
    font-weight:600;
    text-align:center;
    width:100%;
    pointer-events:none;
    font-size:1.4rem;
    text-shadow: 2px 2px 10px #000; /* horizontal-offset vertical-offset 'blur' colour */
   -moz-text-shadow: 0 0 3px #000;
   -webkit-text-shadow: 0 0 3px #000;
   -webkit-box-sizing: content-box;
   box-sizing: content-box;
    
  }
  div.forbidden {
    background:#F3F3F3;opacity:0.9;
  }
  
  div.forbidden a.service-link {
    cursor:not-allowed;
  }
  a.service-link > div {
    max-height:200px;
    overflow:hidden;
  }
  a img{
      object-fit: cover;
      -webkit-transition: 0.5s ease all;
      transition: 0.5s ease all;
      height: 100%;
      margin: 0;
      width: 100%;
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