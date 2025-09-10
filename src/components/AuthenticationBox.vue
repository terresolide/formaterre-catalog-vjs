<script setup>
import {reactive, onMounted} from 'vue'
import {useConfig} from '@/stores/config.js'
import {AuthService} from 'formater-auth-service-js'
import {useUser} from '@/stores/user.js'
import {useClient} from '@/stores/client.js'

const profile = defineModel()
const data = reactive({
    sso: null,
    deployed: false,
    organizationTypes: null
})
const config = useConfig()
const user = useUser()
const client = useClient()
function login () {
    data.sso.login()
}
function logout () {
    // on ne se déconnecte pas du sso mais uniquement l'application
    data.sso.logout(true)
}
function getClients () {
    // get auth services?? for access right
    
    client.getAll()
}
function getSSOInformation() {
    return fetch(config.state.tools + '/api/client/' + config.state.app)
}
function initSSO (clientId) {
    var env = import.meta.env
     data.sso = new AuthService(env.SSO_NAME, {
       clientId: clientId,
       method: 'public_verifier',
       keycloakUrl: env.SSO_URL + '/realms/' + env.SSO_REALM,
       redirectUri: config.state.ssoLogin
    })
    data.sso.add()
    data.sso.on('authenticated', function (usr, serv) {
        user.set(usr)
        getClients()
    })
    data.sso.on('logout', function () {
        user.reset()
        data.deployed = false
        profile = false
    })
    data.sso.on('error', function (error) {
        console.log(error)
    })
}

onMounted(() => {
    if (config.state.clientId) {
        initSSO(config.state.clientId)
        return
    }
    getSSOInformation()
    .then(resp => resp.json())
    .then(json => {
        if (json && json.client) {
            initSSO(json.client.clientId)
        }
    })
})
</script>
<template> 
  <template v-if="user.email">
    <span class="user" @click="data.deployed = !data.deployed">{{user.email}} <font-awesome-icon :icon="data.deployed ? 'fa-solid fa-caret-up': 'fa-solid fa-caret-down'"/></span>
    <div class="user-menu" :class="{deployed: data.deployed}">
       <div @click="profile = !profile" :class="{actived: profile}">
            <font-awesome-icon icon="fa-solid fa-user" /> 
            {{$t('your_profile')}}
        </div>
       <div @click="logout()"><font-awesome-icon icon="fa-solid fa-right-from-bracket" /> {{$t('logout')}}</div>
    </div>
  </template>
  <template v-else>
    <a class="user" @click="login"><font-awesome-icon icon="fa-solid fa-user" /> {{ $t('login') }}</a>
  </template>

</template>
<style scoped>
span.user {
    cursor: pointer;
}
div.user-menu {
    position:absolute;
    display:none;
    right:0;
    text-align:left;
    z-index:10;
}
div.user-menu.deployed {
    display:block;
}
div.user-menu div{
   line-height:2;
   padding: 3px 9px;
   background: #eee;
   cursor:pointer;
   border:1px dotted grey;
   border-top:0px;
}
div.user-menu div:hover {
    color:var(--vt-c-black-mute);
    background: #ddd;
}
div.user-menu div.actived {
    background: #f3f3F3;
}

</style>