<script setup>
import {reactive, onMounted} from 'vue'
import {useConfig} from '@/stores/config.js'
import {AuthService} from 'formater-auth-service-js'
import {useUser} from '@/stores/user.js'
import {useService} from '@/stores/service.js'

const data = reactive({
    sso: null,
    deployed: false,
    profile: false
})
const config = useConfig()
const user = useUser()
const service = useService()
function login () {
    data.sso.login()
}
function logout () {
    // on ne se déconnecte pas du sso mais uniquement l'application
    data.sso.logout(true)
}
function getServices () {
    // get auth services?? for access right
    service.get()
}
onMounted(() => {
    var env = import.meta.env
    data.sso = new AuthService(env.SSO_NAME, {
       clientId: config.state.clientId,
       method: 'public_verifier',
       keycloakUrl: env.SSO_URL + '/realms/' + env.SSO_REALM,
       redirectUri: config.state.ssoLogin
    })
    data.sso.add()
    data.sso.on('authenticated', function (usr, serv) {
        user.set(usr)
        getServices()
    })
    data.sso.on('logout', function () {
        user.reset()
        data.deployed = false
        data.profile = false
    })
    data.sso.on('error', function (error) {
        console.log(error)
    })
    
})
</script>
<template> 
  <template v-if="user.email">
    <span class="user" @click="data.deployed = !data.deployed">{{user.email}} <font-awesome-icon :icon="data.deployed ? 'fa-solid fa-caret-up': 'fa-solid fa-caret-down'"/></span>
    <div class="user-menu" :class="{deployed: data.deployed}">
       <div @click="data.profile = !data.profile" :class="{actived: data.profile}"><font-awesome-icon icon="fa-solid fa-user" /> {{$t('your_profile')}}</div>
       <div @click="logout()"><font-awesome-icon icon="fa-solid fa-right-from-bracket" /> {{$t('logout')}}</div>
    </div>
  </template>
  <template v-else>
    <a @click="login"><font-awesome-icon icon="fa-solid fa-user" /> {{ $t('login') }}</a>
  </template>
  <template v-if="user.email && data.profile">
    <div class="profile">
    bla bla
    </div>
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
    z-index:11;
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
div.profile {
    position:fixed;
    max-width: 1200px;
    background: white;
    border: 1px solid grey;
    max-height:calc(100vh - 30px);
    width:calc(100% - 80px);
    min-width:600px;
    min-height:600px;
    top: 50%;
    left: 50%;
    text-align: left;
    padding:10px;
    transform: translate(-50%, -50%);
    box-shadow: 0 0px 3px rgba(0,0,0,0.5);
    z-index:10;
}
</style>