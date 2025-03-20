<script setup>
import { computed } from 'vue';
import {useCatalog} from '@/stores/catalog';
import CatalogBox from './CatalogBox.vue';
let catalog = useCatalog()
const list = computed(() => {return catalog.list})
</script>
<template>
   <template v-for="item in list" >
        <catalog-box :catalog="item"></catalog-box>
    </template>
</template>