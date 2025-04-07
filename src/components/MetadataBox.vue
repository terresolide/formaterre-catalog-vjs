<script setup>
import { RouterLink} from 'vue-router'
// import { defineProps } from 'vue';
import {useConfig} from '@/stores/config';
let config = useConfig()
const props = defineProps({
    metadata: Object
})


</script>
<template>
    <div class="element-metadata-flex" >
        <a class="service-link" >
        
           <h3 :style="{background: config.state.emphasis}">{{config.tr(props.metadata._source.resourceTitleObject)}}</h3>
             {{props.metadata._source.resourceTitleObject}}
        </a>
    </div>
</template>
<style scoped>
figure div {
  position:absolute;
  top:100px;
  color:white;
  font-weight:600;
  text-align:center;
  width:100%;
  pointer-events:none;
  font-size:2rem;
  text-shadow: 2px 2px 10px #000; /* horizontal-offset vertical-offset 'blur' colour */
 -moz-text-shadow: 0 0 3px #000;
 -webkit-text-shadow: 0 0 3px #000;
 -webkit-box-sizing: content-box;
 box-sizing: content-box;

  
}

</style>