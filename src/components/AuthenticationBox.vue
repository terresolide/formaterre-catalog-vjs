<script setup>
import {onMounted} from 'vue'
onMounted(() => {
    console.log(import.meta.env)
})
</script>
<template> 
    <a><font-awesome-icon icon="fa-solid fa-user" /> {{ $t('login') }}</a>
</template>
<style>
</style>