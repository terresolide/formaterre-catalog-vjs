<script setup>
import {onMounted, computed, reactive} from 'vue'
import {useConfig} from '@/stores/config.js'
import {useUser} from '@/stores/user.js'
import {useClient} from '@/stores/client.js'
import RoleClient from '@/components/RoleClient.vue'
const config = useConfig()
const user = useUser()
const client = useClient()
const data = reactive({
    message: null,
    asking: false,
    checkedRoles: []
})

const uncompletedUser = computed(() => {return !user.organisation.id})

function accessRequest() {
    console.log(data.checkedRoles)
    // remove role "view" if there is role "view download"
    // var location = this.$custURL(window.location.href)
    var checkedRoles = data.checkedRoles.filter(role => data.checkedRoles.indexOf(role + 'D') < 0)
    var postdata = {
        userId: user.id,
        email: user.email,
        app: config.state.app,
        domain: 'http://localhost:3000/#/',
        realm: import.meta.env.SSO_REALM,
        message: data.message ? data.message : '',
        role: checkedRoles,
        lang: config.state.lang,
        organizationId: user.organization.id
    }
    var fdata = new URLSearchParams(postdata)
    var url = config.state.tools + '/requests/ask'
    fetch(url,{
        method: 'POST',
        body: fdata.toString(),
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    }).then(resp => resp.json())
    .then(json => {
        if (json.success && json.roles) {
            json.roles.forEach(function (role) {
                client.setRoleWaiting(role)
            })
        }
    })
}
onMounted(() => {
    client.getRoles()
})
</script>
<template>
   <p  v-html="$t('access_to_formater')" style="font-size:1em;font-style:italic;line-height:1.3;margin:5px 0;"></p>
    <div class="role-line role-line-header"  >
         <div></div>
         <div></div>
         <div >{{$t('preview')}}</div>
         <div >{{$t('download')}}</div>
         <div>{{$t('charter')}}</div>
    </div>
    <div class="role-line full" >
        <div>
           {{$t('public_data')}}
        </div>
        <div></div>
        <div class="fmt-center">
            <span style="color:green;">
                <font-awesome-icon icon="fa-solid fa-check" /> 
            </span>
        </div>
        <div class="fmt-center">
            <span style="color:green;">
                <font-awesome-icon icon="fa-solid fa-check" /> 
            </span>
        </div>
        <div ></div>
    </div> 
 
     <!-- GLOBAL ROLES -->
     <div v-if="client.roles.global" style="border-top: 1px dotted black;padding:0px;" >
        <role-client :client="client.roles.global" name="global" :charters="client.charters" v-model="data.checkedRoles"  />
     </div>
     <!--  CLIENT ROLES -->
     <template v-for="(cl,clientName) in client.roles">
        <div  v-if="clientName !== 'global'" style="border-top: 1px dotted black;padding:0px;">
           <role-client :client="cl" :name="clientName" :charters="client.charters" v-model="data.checkedRoles"  />
        </div>
     </template>
     <div style="margin:10px 0;">
    
       <div style="position:relative;">
         <div v-if="!data.asking" style="position:absolute;left:50%;top:10%;font-size:30px;">
           <font-awesome-icon icon="fa-solid fa-spinner" spin  /> 
         </div>
         <textarea style="width:100%" v-model="data.message" :placeholder="$t('add_message')"></textarea>
       </div>
       <div style="text-align:right;margin:10px 0;">
        <button  class="fmt-button" :class="{disabled: uncompleteUser || data.checkedRoles.length === 0 || data.asking}" :style="{background: config.state.primary}" @click="accessRequest">{{$t('access_request')}}</button>
       </div>
    </div>
       <p  v-html="$t('wait_validation')" style="font-size:0.9em;color:green;line-height:1;"></p>
       <p  style="color:darkred;">Erreur : {{data.errorAsk}}</p>
     
</template>
<style >
div.role-line {
    display: grid;
    grid-template-columns: minmax(200px,230px) 50px minmax(50px, 120px) minmax(50px, 130px) minmax(50px, 150px);
    grid-gap: 5px;
    text-align:center;
}
div.role-line-header {
    font-weight:700;
    background:#e3e3e3;
    padding: 6px 0;
}
div.role-line-header div {
    word-break:break-all;
}
div.client-content div.role-line:nth-child(2n + 1) {
  background: #f3f3f3;
}

</style>