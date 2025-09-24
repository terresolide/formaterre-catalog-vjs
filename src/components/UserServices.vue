<script setup>
import {useConfig} from '@/stores/config.js'
import {useClient} from '@/stores/client.js'
import {useUser} from '@/stores/user.js'
import TooltipBox from '@/components/TooltipBox.vue'
const config = useConfig()
const client = useClient()
const user = useUser()
</script>
<template>
    <template v-if="client.list && client.list.length > 0">
        <fieldset :style="{borderColor: config.state.primary}">
            <legend :style="{color: config.state.primary}">Services</legend>
            <template v-for="item in client.list">
               <div class="service-row" v-if="item.sso"> 
                   <div>{{item.name}}</div>
                   <div>
                     <template v-if="item.sso && item.sso.getEmail() && item.sso.getEmail() !== user.email">
                        <tooltip-box icon="fa-solid fa-triangle-exclamation" description="connecter avec un utilisateur différent" style="color:darkred;font-size:1.2rem;"/>
                     </template>
                   </div>
                   <div>
                       <template v-if="item.sso && item.sso.getEmail()">
                           <span class="button" @click="item.sso.logout()">
                                 <font-awesome-icon icon="fa-solid fa-right-from-bracket" /> 
                           </span>
                       </template>
                       <template v-else-if="item.sso">
                        <span class="button" @click="item.sso.login()">
                             <font-awesome-icon icon="fa-solid fa-right-to-bracket" /> 
                       </span>
                       </template>
                    </div>
               </div>
            </template>
         </fieldset>
    </template>
</template>
<style scoped>
    div.service-row {
        display: grid;
        grid-template-columns: 1fr 40px 40px;
        grid-gap: 5px;
        text-align:left;
        align-items: end;
    }
    div.service-row > div:first-child {
        padding-bottom:2px;
    }
   
    .warning {
        color:darkred;
        font-size: 1.2rem;
    }
    span.button {
        display:inline-block;
        padding: 1px 5px;
        border: 1px dotted transparent;
        cursor:pointer;
    }
    span.button:hover {
        border-color:darkgrey;
    }
     span.button.warning:hover {
        border-color:darkred;
    }
  
</style>