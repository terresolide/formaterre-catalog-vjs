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
    errorAsk: null,
    success: false,
    checkedRoles: []
})

const uncompletedUser = computed(() => {return !(user.organization && user.organization.id)})

function accessRequest() {
    data.asking = true
    var location = URL.parse(window.location.href)
    // remove role "view" if there is role "view download"
    var checkedRoles = data.checkedRoles.filter(role => data.checkedRoles.indexOf(role + 'D') < 0)
    var postdata = {
        userId: user.id,
        email: user.email,
        app: config.state.app,
        domain: location.href,
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
        data.asking = false
        data.success = json.success
        if (json.success && json.roles) {
            json.roles.forEach(function (role) {
                client.setRoleStatus(role, 'WAITING')
            })
            data.checkedRoles = []
            data.message = null
        }
        if (json.error) {
            data.errorAsk = json.error
        }
    }).catch((error) => {
        data.asking = false
        data.errorAsk = 'SERVER ERROR'
    })
}
function resetMessage () {
    data.success =  false
    data.errorAsk = null
}
onMounted(() => {
    client.getRoles()
    resetMessage()
})
</script>
<template>
   <div   style="font-size:1em;font-style:italic;line-height:1.3;margin:20px 0;">
   {{$t('access_to_formater')}}
        <ul>
            <template v-if="uncompletedUser">
               <li style="font-weight:700;color:darkred;">{{$t('save_organization')}},</li>
            </template>
            <template v-if="client.charters && client.charters.list.length > client.charters.signed.length" >
                <li>{{$t('sign_charter')}},</li>
            </template>
            <li>{{$t('select_data')}},</li>
            <li>{{$t('do_access_request')}}</li> 
         </ul>
   </div>
    <div class="role-line role-line-header"  >
         <div></div>
         <div></div>
         <div >{{$t('preview')}}</div>
         <div >{{$t('download')}}</div>
         <div>{{$t('charter')}}</div>
    </div>
    <div class="role-line full" >
        <div style="text-align:right;">
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
        <div >---</div>
    </div> 
 
     <!-- GLOBAL ROLES -->
     <template v-if="client.roles.global">
        <role-client :client="client.roles.global" name="global" :charters="client.charters" v-model="data.checkedRoles" />
     </template>
     <!--  CLIENT ROLES -->
     <template v-for="(cl,clientName) in client.roles">
        <div  v-if="clientName !== 'global'" class="list-roles" >
           <role-client :client="cl" :name="clientName" :charters="client.charters" v-model="data.checkedRoles" />
        </div>
     </template>
     <div style="margin:10px 0;">
    
       <div style="position:relative;">
         <div v-if="data.asking" style="position:absolute;left:50%;top:10%;font-size:30px;color:black;">
           <font-awesome-icon icon="fa-solid fa-spinner" spin  /> 
         </div>
         <textarea style="width:100%" v-model="data.message" :placeholder="$t('add_message')"></textarea>
       </div>
       <div style="text-align:right;margin:10px 0;">
        <button  class="fmt-button" :class="{disabled: uncompletedUser || data.checkedRoles.length === 0 || data.asking}" :style="{background: config.state.primary}" @click="accessRequest">{{$t('access_request')}}</button>
       </div>
    </div>
       <p v-show="data.success" class="request-success" v-html="$t('wait_validation')" @click="resetMessage"></p>
       <p v-show="data.errorAsk" class="error" @click="resetMessage">Error: {{data.errorAsk}}</p>
     
</template>
<style >
div.role-line {
    display: grid;
    grid-template-columns: minmax(100px,230px) 50px minmax(50px, 120px) minmax(50px, 130px) minmax(50px, 180px);
    grid-gap: 5px;
    text-align:center;
}
div.role-line-header {
    font-weight:700;
    background:var(--color-background-mute);
    padding: 6px 0;
    border-bottom: 1px dotted black;
}
div.role-line-header div {
    word-break:break-all;
}
div.role-line.full {
    padding: 6px 0;
}
div.client-content div.role-line:nth-child(2n + 1) {
  background:var(--color-background-mute);
}

</style>
<style scoped>
.list-roles {
    border-top: 1px dotted black;
    padding-top:3px;
}
textarea {
    width:100%;
    height:80px;
}
p.request-success {
    font-size:0.9em;
    color:green;
    line-height:1;
    padding:5px;
    border:1px solid green;
    cursor: pointer;
}
.error {
    color:darkred;
     padding:5px;
    border:1px solid darkred;
    cursor: pointer;
}
</style>