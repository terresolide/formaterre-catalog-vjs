<script setup>
import {computed} from 'vue'
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
                   <div><a :href="item.accountUrl" target="_blank">{{item.name}}</a></div>
                   <div>
                     <template v-if="item.sso && item.sso.getEmail() && item.sso.getEmail() !== user.email">
                        <tooltip-box icon="fa-solid fa-triangle-exclamation" :description="$t('warning_user_client', {sso: item.name, email: item.sso.getEmail(), user: user.email})" style="color:var(--text-link);font-size:1.2rem;"/>
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
    div.warning {
       position:absolute;
       top: 50px;
       left: 10px;
       padding: 20px 10px;
       background: #fefefe;
       border:3px solid darkred;
       z-index:1;    
    }
    div.service-row a {
        color:var(--color-text);
    }
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
    div.service-row > div:first-child {
    cursor:pointer;
}
    div.service-row.disable {
        pointer-events:none;
    }
    div.service-row > div:first-child:before {
        content: "\2192 ";
        padding-right:2px;
    }
    div.service-row > div:first-child:hover {
      
    }
    .warning {
        color:var(--text-link);
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