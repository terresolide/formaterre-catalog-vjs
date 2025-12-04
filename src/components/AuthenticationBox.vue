<script setup>
// https://sso.aeris-data.fr/auth/realms/aeris/protocol/openid-connect/auth?client_id=iagos-vjs&redirect_uri=https://iagos.aeris-data.fr/&response_type=code&scope=openid&kc_idp_hint=envri-id-staging
import {computed, reactive, onMounted} from 'vue'
import {useConfig} from '@/stores/config.js'
import {AuthService} from 'formater-auth-service-js'
import {useUser} from '@/stores/user.js'
import {useClient} from '@/stores/client.js'
import {useCatalog} from '@/stores/catalog.js'
import TooltipBox from '@/components/TooltipBox.vue'


const profile = defineModel()
const data = reactive({
    sso: null
})
const config = useConfig()
const user = useUser()
const client = useClient()
const catalog = useCatalog()

let logo = computed(() => {
    if (!client.current || !client.current.sso) {
        return null
    }
    var group = catalog.getGroupByName(client.current.name)
    if (group) {
        return group.logo
    }
    return null
})

function login () {
    user.sso.login()
}
function logout () {
    // on ne se déconnecte pas du sso mais uniquement l'application
    user.sso.logout(true)
}
function getSSOInformation() {
    return fetch(config.state.tools + '/api/client/' + config.state.app)
}
function initSSO (clientId) {
    var env = import.meta.env
    AuthService.setSize(1050, 800)
    user.sso = new AuthService(env.SSO_NAME, {
       clientId: clientId,
       method: 'public_verifier',
       keycloakUrl: env.SSO_URL + '/realms/' + env.SSO_REALM,
       redirectUri: config.state.ssoLogin
    })
    user.sso.add()
    user.sso.on('authenticated', function (usr, serv) {
        user.set(usr)
        client.getRoles()
    })
    user.sso.on('logout', function () {
        user.reset()
        data.deployed = false
        profile.value = false
        client.reset()
    })
    user.sso.on('error', function (error) {
        console.log(error)
    })
}

onMounted(() => {
    if (config.state.clientId) {
        initSSO(config.state.clientId)
        return
    } else {
        getSSOInformation()
        .then(resp => resp.json())
        .then(json => {
            if (json && json.client) {
                initSSO(json.client.clientId)
            }
        })
    }
})
</script>
<template> 
    <template v-if="user.email">
        <template v-if="client.current">
            <div class="client-box">
                <template v-if="logo"> <img :src="logo" width="20" style="vertical-align:middle;"/></template>
                Service  {{client.current.name}} 
             
                <template v-if="client.current.sso && client.current.sso.getEmail() && client.current.sso.getEmail() !== user.email">
                   <tooltip-box icon="fa-solid fa-triangle-exclamation" :description="$t('warning_user_client', {sso: client.current.name, email: client.current.sso.getEmail(), user: user.email})" style="color:var(--text-link);font-size:1.2rem;"/>
                </template>
                <template v-if="client.current.sso && client.current.sso.getEmail()">
                    <span class="button" @click="client.current.sso.logout()">
                          <font-awesome-icon icon="fa-solid fa-right-from-bracket" /> 
                    </span>
                </template>
                <template v-else-if="client.current.sso">
                     <span class="button" @click="client.current.sso.login()">
                          <font-awesome-icon icon="fa-solid fa-right-to-bracket" /> 
                    </span>
                </template>
            </div>
        </template>
        <span class="user" >{{user.email}} <font-awesome-icon icon="fa-solid fa-caret-down"/></span>
        <div class="user user-menu" >
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
span.button {
    margin-left:5px;
    padding:0 2px;
    cursor:pointer;
    border:1px dotted transparent;
}
span.button:hover {
    border-color: var(--text-color);
}
div.client-box {
    display:inline-block;
    margin: 0 10px;
}
div.client-box:after {
    content: "|";
    padding-left:10px;
}
span.user {
    cursor: pointer;
}
span.user:hover + div.user-menu,
div.user-menu:hover {
    display:block;
}
div.user-menu {
    position:absolute;
    display:none;
    right:0;
    top:18px;
    text-align:left;
    z-index:115;
}

div.user-menu div{
   line-height:2;
   padding: 3px 9px;
   background: var(--color-background-mute);
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
