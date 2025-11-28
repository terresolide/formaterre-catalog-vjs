<script setup>
import {reactive} from 'vue'
import {useConfig} from '@/stores/config.js'

import AuthenticationBox from '@/components/AuthenticationBox.vue'
import UserProfile from '@/components/UserProfile.vue'

const config = useConfig()

</script>
<template>
 <div class="user-info" >
   <!-- <a><font-awesome-icon icon="fa-solid fa-basket-shopping"/> {{$t('basket')}}</a> | -->
    <authentication-box v-model="config.profile"/>
    <user-profile v-model="config.profile" />
   
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