<script setup>
  import { ref, reactive, watch, onMounted } from 'vue'; 
  import { useRoute } from "vue-router"
  import { useConfig } from "@/stores/config.js"
  import MapBox from '@/components/MapBox.vue'
  const config = useConfig()
  const props = defineProps({
    aggregations: Object,
    list: Array
  })
  const bbox= ref()
</script>

<template>
  <aside>
    {{bbox}}
   <div class="formater-input-group" style="margin: 10px; width: calc(100% - 20px); " :style="{backgroundColor: config.state.lightcolor}"><input id="any" name="any" :placeholder="$t('search')  + '...'">
    <font-awesome-icon icon="fa-solid fa-search"/></div>
   <map-box :list="props.list" v-model="bbox"></map-box>

  </aside>
</template>
<style scoped>
aside {
  max-width:330px;
  width:330px;
  float:left;
  border:1px solid grey;
  padding: 0px 0px 0px 0px;
  border: 1px solid #ccc;
  box-shadow: 1px 1px 1px 2px rgba(0, 0, 0, 0.1);
}
.formater-input-group input[name="any"] {
  line-height: 35px;
  height: 35px;
  width: calc(100% - 40px);
}
.formater-input-group input {
  border: none;
  background-color: transparent;
  padding: 0 10px;
  outline: none;
}
</style>

