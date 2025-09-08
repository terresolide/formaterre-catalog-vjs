<script setup>
import AuthenticationBox from '@/components/AuthenticationBox.vue'
</script>
<template>
 <div class="user-info" >
    <a><font-awesome-icon icon="fa-solid fa-basket-shopping"/> {{$t('basket')}}</a>
    <authentication-box />
  </div>
</template>
<style scoped>
a {
    cursor:pointer;
}
.user-info {
    position:relative;
    text-align:right;
}
</style>