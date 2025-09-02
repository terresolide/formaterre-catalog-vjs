<script setup>
// import { computed } from 'vue';
import MetadataBox from '@/components/MetadataBox.vue'
import MetadataSingle from '@/components/MetadataSingle.vue'

// import { useSelection } from '@/stores/selection'

// const CommandLine = defineAsyncComponent(() => import('@/components/CommandLine.vue'))
const props = defineProps({
    list: Array,
    inside: {
        type: Boolean,
        default: false
    }
}) 
// const selection = useSelection()
</script>
<template>

     <div class="wrapper-group-2" :class="{inside: props.inside}">
       <template v-if="props.list.length > 0">
           <div class="container-flex"> 
                <template v-for="item in props.list"  :key="item.uuid">
                     <metadata-box :metadata="item"></metadata-box> 
                </template>
            </div>
        </template>
        <template v-else >
        {{$t('no_record')}}
          Aucune fiche ne correspond à la recherche
        </template>
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
div.wrapper-group-2.inside {
      max-height:calc(100vh - 210px);
    }
  div.wrapper-group-2 div.container-flex {
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
   max-width:100%;
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