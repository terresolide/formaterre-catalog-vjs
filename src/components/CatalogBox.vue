<script setup>
import { RouterLink} from 'vue-router'
import {useConfig} from '@/stores/config';
const props = defineProps({
    catalog: Object
})
let config = useConfig()
</script>
<template>
    <div class="element-flex">
        <router-link class="service-link" :to="{name: 'catalog-grid', params: {catalog: props.catalog.name.toLowerCase()}}">
            <figure >
	         <img v-if="props.catalog.logo" :src="config.state.api + '/images/harvesting/' + props.catalog.logo" />
             <div >{{props.catalog.name}}</div>
	       </figure>
           <h3 style="color:black;margin:5px 0;">{{props.catalog.name}}</h3>
           {{ props.catalog }}
        </router-link>
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