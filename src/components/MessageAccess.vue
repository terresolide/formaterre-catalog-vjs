<script setup>
import { useClient } from '@/stores/client.js'
import {useUser} from '@/stores/user.js'
import {useConfig} from '@/stores/config.js'
const {access} = defineProps({
    access: Object
})
const client = useClient()
const user = useUser()
const config = useConfig()
</script>
<template>
  <div class="msg-auth">
    <template v-if="access.download === -1 && !user.email">
      <div >L'accès à ces ressources est restreint.<br />
       Authentifiez-vous auprès de FormaTerre pour connaître vos droits.<br />
         <button @click="user.sso.login()" style="vertical-align:middle;">{{$t('login')}}</button>
      </div>
    </template>
    <template v-if="client.current && client.current.sso && access.download <=0">
        <template v-if="access.download === 0">
        <div >
        <h3>Important!</h3>
Pour visualiser ou télécharger ces ressources, vous devez autoriser le service <b>{{client.current.name}}</b> à accéder à vos données personnelles (email, nom, rôles).
   <br />
        <button @click="client.current.sso.login()" style="vertical-align:middle;">Autoriser</button>
        </div>
        </template>
        <template v-else>
        <div>
        <b>Vos droits sont insuffisants!</b><br />
        Consultez votre profile pour connaître vos droits et éventuellement demander l'accès à ces ressources!
         <button @click="config.profile=true" style="vertical-align:middle;">Voir profile</button>
        </div>
        </template>
    </template>
 </div>
</template>
<style scoped>
div.msg-auth {
    text-align:center;
}
div.msg-auth > div {
    text-align:left;
     border: 1px solid var(--text-link);
     font-weight:500;
     color: var(--text-link);
     padding: 10px;
     display:inline-block;
     margin: 10px 0;
     background: var(--color-background-mute);
}
b {
    font-weight:700;
}
button:not(.classic) {
    background: darkred;
}
</style>
