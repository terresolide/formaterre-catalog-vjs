<script setup>
import { defineProps } from 'vue';
const props = defineProps({
    catalog: Object
})
console.log(props.catalog)
</script>
<template>
    <div>{{ props.catalog }}</div>
</template>