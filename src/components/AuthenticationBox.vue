<script setup>
import {reactive, onMounted} from 'vue'
import {useConfig} from '@/stores/config.js'
import {AuthService} from 'formater-auth-service-js'
import {useUser} from '@/stores/user.js'

const data = reactive({
    sso: null
})
const config = useConfig()
const user = useUser()
function login () {
    data.sso.login()
}
onMounted(() => {
    console.log(config)
    var env = import.meta.env
    data.sso = new AuthService(env.SSO_NAME, {
       clientId: config.state.clientId,
       method: 'public_verifier',
       keycloakUrl: env.SSO_URL + '/realms/' + env.SSO_REALM,
       redirectUri: config.state.ssoLogin
    })
    data.sso.add()
    data.sso.on('authenticated', function (user, serv) {
        user.set(user)
    })
    data.sso.on('error', function (error) {
        console.log(error)
    })
    
})
</script>
<template> 
{{user.email}}
    <a @click="login"><font-awesome-icon icon="fa-solid fa-user" /> {{ $t('login') }}</a>
</template>
<style>
</style>