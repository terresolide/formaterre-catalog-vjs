<script setup>
  import { reactive, watch, onMounted } from 'vue'; 
  import { useRoute } from "vue-router"
  import MapBox from '@/components/MapBox.vue'
  
</script>

<template>
  <aside>
   ICI LE FORMULAIRE DE RECHERCHE
   <map-box></map-box>

  </aside>
</template>
<style scoped>
aside {
  max-width:300px;
  float:left;
  border:1px solid grey;
  padding: 0px 0px 30px 0px;
  border: 1px solid #ccc;
  box-shadow: 1px 1px 1px 2px rgba(0, 0, 0, 0.1);
}
</style>

