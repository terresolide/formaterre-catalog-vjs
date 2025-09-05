<script setup>
import {reactive, onMounted} from 'vue'
import {AuthService} from 'formater-auth-service-js'

const data = reactive({
    sso: null
})
function login () {
    data.sso.login()
}
onMounted(() => {
    console.log(import.meta.env)
    var env = import.meta.env
    data.sso = new AuthService(env.SSO_NAME, {
           keycloakUrl: env.SSO_URL + '/realms/' + env.SSO_REALM,
           redirectUri: 'http://localhost:3000/#/login'
    })
    console.log(data.sso)
    
})
</script>
<template> 
    <a @click="login"><font-awesome-icon icon="fa-solid fa-user" /> {{ $t('login') }}</a>
</template>
<style>
</style>