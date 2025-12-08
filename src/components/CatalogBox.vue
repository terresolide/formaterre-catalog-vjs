<script setup>
import { RouterLink} from 'vue-router'
import {useConfig} from '@/stores/config';
const {catalog} = defineProps({
    catalog: Object
})
let config = useConfig()
</script>
<template>
    <div class="element-flex">
        <router-link class="service-link" :to="{name: 'catalog-grid', params: {catalog: catalog.name.toLowerCase()}}">
            <figure >
	         <img v-if="catalog.logo" :src="catalog.logo" />
             <div >{{catalog.label}}</div>
	       </figure>
           <h3 style="margin:5px 0;">{{catalog.label}}</h3>
           <div v-html="catalog.description"></div>
        </router-link>
        <template v-if="catalog.email || catalog.website">
            <div class="catalog-footer" >
                <div>Contact: {{catalog.email}}</div>
                <div>Website: <a href="catalog.website" target="_blank">Website</a></div>
            </div>
        </template>
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
div.catalog-footer {
     position:absolute;
     padding:3px 10px;
     text-align:
     left;bottom:0;
     line-height:1.1;
     width:100%;
     left:0;
     background:var(--color-background-soft);
}
</style>