<script setup>
import {reactive} from 'vue'


import AuthenticationBox from '@/components/AuthenticationBox.vue'
import UserProfile from '@/components/UserProfile.vue'

const data = reactive({
    profile: false
})
</script>
<template>
 <div class="user-info" >
    <a><font-awesome-icon icon="fa-solid fa-basket-shopping"/> {{$t('basket')}}</a> |
    <authentication-box v-model="data.profile"/>
    <user-profile v-model="data.profile" />
   
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