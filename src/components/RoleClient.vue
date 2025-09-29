<script setup>
import {computed, onMounted, reactive} from 'vue'
import {useConfig} from '@/stores/config.js'
import {useUser} from '@/stores/user.js'
import {useSelection} from '@/stores/selection.js'
import TooltipBox from '@/components/TooltipBox.vue'
const {name, client, charters} = defineProps({
    name: String,
    client: {
        type: Object,
        default: null
    },
    charters: {
        type: Object,
        default: () => {return {list:[],signed:[]}}
    }
})
const data = reactive({
    selectAll: false
})
const checkedRoles = defineModel()
const config = useConfig()
const user = useUser()
const selection = useSelection()
const uncompletedUser = computed(() => {return !(user.organization && user.organization.id)})
function tr (obj,name) {
    var lang = config.state.lang
    if (obj[lang]) {
        return obj[lang]
    }
    if (name) {
        return name
    }
    return obj
}
function description (role) {
    if (role.description && role.description[config.state.lang]) {
      return role.description[config.state.lang]
    } else if (role.description) {
      return role.description[Object.keys(role.description)[0]]
    }
    return null
}
function getCharterName (id) {
    let charter = charters.list.find(ch => ch.id === id)
    if (!charter) {
        return 'NOT FOUND'
    }
    if (charter.title && charter.title[config.state.lang]) {
       return charter.title[config.state.lang]
    } else {
        return 'Charter N°' + id
    }
}
function toggleClient (event) {
   var target = event.target
    while (!target.classList.contains('role-line')) {
        target = target.parentNode
    }
    target.classList.toggle('deployed')
}
function selectCharter (id) {
    selection.setCharter(id)
}
function showRole (name) {
    return true
}
function login (evt, client) {
    evt.preventDefault()
    evt.stopPropagation()
    client.sso.login()
}
onMounted(() => {
    console.log(name)
    console.log(user.roles[name])
    console.log(client.roles)
})
</script>
<template>
 <!-- entête client -->
 <div v-if="0 && client && client.roles.length > 0" >
    <div class="role-line deployed" >
      <div  class="title-client" style="cursor:pointer;text-align:left;"  >
         <span style="font-weight:800;">{{tr(client.title)}}</span> 
      </div>
    </div>
  </div>
 <div v-else-if="(client.groups && Object.keys(client.groups).length > 0) || (client.roles && client.roles.length > 0)" class="role-line deployed">

    <div  class="title-client"   @click="toggleClient($event)">
        <span style="font-weight:800;">{{tr(client.title)}}</span> 
        <template v-if="client.client"> 
            <template v-if="client.client.sso">
                ({{client.client.name}}<template v-if="client.client.sso.getEmail() && client.client.sso.getEmail() !== user.email">
                      &nbsp;<tooltip-box icon="fa-solid fa-triangle-exclamation" :description="$t('warning_user_client', {sso: client.client.name, email: client.client.sso.getEmail(), user: user.email})" style="color:darkred;font-size:1.2rem;"/>
                </template>)
               <!-- <template v-if="client.client.sso.getEmail()">
                    <span class="button" @click="client.client.sso.logout()"><font-awesome-icon icon="fa-solid fa-right-from-bracket" /> </span>
                </template>
                <template v-else >
                    <span class="button" @click="login($event, client.client)"><font-awesome-icon icon="fa-solid fa-right-to-bracket" /> </span>
                </template> --->
               
            </template>
            <template v-else>
                ({{client.client.name}})
            </template>
        </template>
       
     </div>
     <div class="fmt-center" style="clear:both;">
        <tooltip-box :description="description(client)" />
     </div>
     <div class="fmt-center" >
      
     </div>
     <div class="fmt-center" >
      
     </div>
     
 </div>
 <!-- liste des roles -->   
 <div class="client-content">
    <!-- ligne select all  
    <template v-if="(client.groups && Object.keys(client.groups).length > 2) || (client.roles && client.roles.length > 2)">

     <div class="role-line">
         <div>
            <span style="font-size:1.2rem;">{{$t('select_all')}}</span>
        </div>
        <div class="fmt-center" style="clear:both;">
            
        </div>
        <div class="fmt-center" >
          <span  >
        
            <input  type="checkbox"
             v-model="data.selectAll" :title="$t('select_all')" @change="toggleAll($event)" :value="name + '.0'"/>
         </span>
        </div>
        <div class="fmt-center" >
          <span >
           <input type="checkbox"
             v-model="data.selecteAll" :title="$t('select_all')" @change="toggleAll($event)" :value="name + '.1'"/>
          </span>
        </div>
    </div>
    </template> -->
    <template v-for="(role,key in client.roles">
        <div  class="role-line"   v-show='showRole(role.name)'>
            <div>{{tr(role.title, role.name)}}</div>
            <div class="fmt-center">
            <tooltip-box :description="description(role)" />
            </div>
            <div v-for="key in ['view', 'download']" class="fmt-center">
                <span v-if="user.roles[name] && user.roles[name].roles && user.roles[name].roles.indexOf(role.name) >= 0" style="color:green;" >
                      <font-awesome-icon icon="fa-solid fa-check" /> 
                </span>
              
                <span v-else-if="role.status">
                    <span v-if="role.status === 'ACCEPTED'" >
                      <font-awesome-icon icon="fa-solid fa-check" style="color:green;" /> 
                    </span>
                    <span v-else-if="role.status === 'WAITING'" :title="$t('WAITING')">
                      <font-awesome-icon icon="fa-solid fa-clock" /> 
                    </span>
                    <span v-else-if="role.status && role.status === 'REJECTED'"  :title="$t('REJECTED')" >
                      <span  style="color:darkred;">&times;</span>
                    </span>
                 <!--   <span v-if="role.status === 'CONDITION'" :title="$t('CONDITION')" @click="selectCharter(role.charterId)">
                        <font-awesome-icon icon="fa-solid fa-pencil" /> 
                    </span> -->
                </span>
                <span v-else-if="(Object.keys(role.parameters).length === 0 || !role.parameters.charter)">
                    <template v-if="role.charterId && charters.signed.indexOf(role.charterId) < 0">
                        <input type="checkbox" disabled />
                    </template>
                    <template v-else>
                        <input  type="checkbox" v-model="checkedRoles" :value="name + '.' + role.name" :disabled="uncompletedUser"/>
                    </template>
                </span>
                <span v-else-if="role.charterId" :title="$t('CONDITION')" class="pencil-link" :class="{disable:uncompletedUser}" @click="selectCharter(role.charterId)">
                    <font-awesome-icon icon="fa-solid fa-pencil" /> 
                </span>
            </div>
            <div class="fmt-center">
                <template v-if="role.charterId">
                    <span class="charter-link" :class="{disable: uncompletedUser}" @click="selectCharter(role.charterId)">
                      <div >{{getCharterName(role.charterId)}}</div>
                       <template v-if="charters && charters.signed && charters.signed.indexOf(role.charterId) >= 0">
                           <div :title="$t('signed')">
                                <font-awesome-icon icon="fa-solid fa-check" style="color:green;"/>
                           </div>
                        </template>
                        <template v-else>
                            <div>
                                <font-awesome-icon icon="fa-solid fa-pencil" /> 
                            </div>
                        </template>
                    </span>
                </template>
                <template v-else>---</template> 
            </div>
   
        </div>
    </template>
    </div>
</template>
<style scoped>

div.title-client {
    cursor:pointer;
    text-align:left;
    padding: 6px 0;
}
div.title-client::before {
    content: ' + ';
}
div.deployed div.title-client::before {
    content: ' - ';
}
div.client-content {
    display:none;
}
div.deployed + div.client-content {
    display:block;
}

div.client-content div.role-line:nth-child(2n + 1) {
    background: #f3f3f3;
}

div.client-content div.role-line > div:first-child {
    text-align:right;
}
span.charter-link {
    display: grid;
    grid-template-columns: 1fr 25px;
    grid-gap: 2px;
    text-align:left;
    cursor:pointer;
}
span.pencil-link {
    cursor:pointer;
    padding:2px 5px;
}
span.pencil-link.disable,
span.charter-link.disable {
    pointer-events:none;
}
span.charter-link:hover,
span.pencil-link:hover {
    background:rgba(139,0,0,0.3);
}
span.charter-link > div {
    vertical-align:middle;
}
span.charter-link > div:first-child:before {
    content: "\2192 ";
    padding-right:2px;
}
span.charter-link:hover > div:first-child {
    color:black;

}
</style>
