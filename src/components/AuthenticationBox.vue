<script setup>
import {reactive, onMounted} from 'vue'
import {useConfig} from '@/stores/config.js'
import {AuthService} from 'formater-auth-service-js'
import {useUser} from '@/stores/user.js'
import {useClient} from '@/stores/client.js'

const data = reactive({
    sso: null,
    deployed: false,
    profile: false
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
        getClients()
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
       <div @click="data.profile = !data.profile" :class="{actived: data.profile}">
            <font-awesome-icon icon="fa-solid fa-user" /> 
            {{$t('your_profile')}}
        </div>
       <div @click="logout()"><font-awesome-icon icon="fa-solid fa-right-from-bracket" /> {{$t('logout')}}</div>
    </div>
  </template>
  <template v-else>
    <a class="user" @click="login"><font-awesome-icon icon="fa-solid fa-user" /> {{ $t('login') }}</a>
  </template>
  <template v-if="user.email && data.profile">
    <div class="profile">
    <h2 :style="{backgroundColor: config.state.emphasis}">
        <div class="close" @click="data.profile=false">&times;</div>
        <font-awesome-icon icon="fa-solid fa-user" />  {{$t('your_profile')}}
        
    </h2>
    <div class="column-left">info user</div>
    <div class="column-right">droits d'accès</div>
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
    padding:0px 10px 10px 10px;
    transform: translate(-50%, -50%);
    box-shadow: 0 0px 3px rgba(0,0,0,0.5);
    z-index:11;
}
div.profile h2 {
    position:relative;
    margin: 0 -10px 10px -10px;
    padding: 10px;
    color: white;
}
div.close {
    position:absolute;
    line-height:1;
    top:2px;
    right:3px;
    padding: 0px 2px;
    cursor:pointer;
    border: 1px dotted transparent;

}
div.close:hover {
    border-color:white;
}
@media screen and (width >= 900px) {
    div.column-left {
        width: 300px;
        float:left;
        border:1px solid grey;
    }
    div.column-right {
        margin-left: 310px;
        width: calc(100% - 310px);
        border:1px solid grey;
    }
}
</style>