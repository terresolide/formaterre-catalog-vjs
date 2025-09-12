<script setup>
import {onMounted} from 'vue'
import {useConfig} from '@/stores/config.js'
import {useUser} from '@/stores/user.js'
import TooltipBox from '@/components/TooltipBox.vue'
const {name, client} = defineProps({
    name: String,
    client: {
        type: Object,
        default: null
    }
})
const checkedRoles = []
const config = useConfig()
const user = useUser()
function tr (obj) {
    var lang = config.state.lang
    if (obj[lang]) {
        return obj[lang]
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

function toggleClient (evt) {
}
function showRole (name) {
}
onMounted(() => {
    console.log(name)
    console.log(user.roles[name])
    console.log(client.roles)
})
</script>
<template>
 <!-- entête client -->
 <div v-if="0 && client && client.roles.length > 0">
    <div class="role-line deployed" >
      <div  class="title-client" style="cursor:pointer;text-align:left;"  >
         <span style="font-weight:800;">{{tr(client.title)}}</span> 
      </div>
    </div>
  </div>
 <div v-else-if="(client.groups && Object.keys(client.groups).length > 0) || (client.roles && client.roles.length > 0)" class="role-line">

    <div  class="title-client"   @click="toggleClient($event)">
        <span style="font-weight:800;">{{tr(client.title)}}</span> 
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
 <div :class="client-content">
    <!-- ligne select all --> 
    <template v-if="(client.groups && Object.keys(client.groups).length > 2) || (client.roles && client.roles.length > 2)">
 
     <div class="role-line" v-if="showRole(null) && client.groups && Object.keys(client.groups).length > 1">
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
    </template>
             <div  class="role-line"  v-for="(role, index) in client.roles" v-show='showRole(role.name)'>
                    <div>{{tr(role)}}</div>
                    <div class="fmt-center">
                    <tooltip-box :description="description(role)" />
                    </div>
                    <div v-for="key in ['view', 'download']" class="fmt-center">
                      <span v-if="role.access" :title="$t('ACCEPTED')"><i class="fa fa-check" style="color:green;"></i></span>
                  <!--  <i v-if="role.parameters.view" class="fa" :class="{'fa-close': !role.access, 'fa-check': role.access} "></i>
                  --> 
                  <span v-else-if="role.status">
                          <span v-if="role.status === 'WAITING'">
                            <i class="fa fa-clock-o" ></i>
                          </span>
                          <span v-else-if="role.status && role.status === 'REJECTED'">
                            <i class="fa fa-close" style="color:darkred;"></i>
                          </span>
                          <span v-if="role.status === 'CONDITION'" :title="$t('CONDITION')">
                            <!--   <router-link :to="{name:'Charter', params: {id: role.charterId}}">
                                   <i class="fa fa-pencil" ></i>
                               </router-link> -->
                          </span>
                 </span>
                 <span v-else-if="(Object.keys(role.parameters).length === 0 || !role.parameters.charter)">
                          <input  type="checkbox" :value="name + '.' + role.name" 
                      :checked="checkedRoles.indexOf(name + '.' + role.name) >= 0" @click="changeRole($event)" />
                     </span>
                     <span v-else-if="role.charterId" :title="$t('CONDITION')" >
                 <!--         <router-link :to="{name:'Charter', params: {id: role.charterId}}">
                               <i class="fa fa-pencil" ></i>
                       </router-link> -->
                     </span>
                    </div>
                    <div class="fmt-center">
                      <span v-if="role.charterId">
                      <!-- <router-link v-if="role.charterId" :to="{name: 'Charter', params: {id: role.charterId}}">
                      <span v-if="$store.getters['charters/isSigned'](role.charterId)">
                        {{$t('signed')}}
                       </span>
                            <span  v-else :title="$t('CONDITION')">
                             <i class="fa fa-pencil"></i>
                            </span>
                   </router-link> -->
                  </span>
                  <span v-else><em>{{$t('no_charter')}}</em></span>
                </div>
          </div>
       <div class="role-line" v-if="client.groups" v-show="showGroup(key)" v-for="group, key in client.groups">
          <div>{{title(group[0], key)}}</div>
          <div class="fmt-center">
             <formater-tooltip :description="description(group[0])"></formater-tooltip>
          </div>
          <div v-for="role, index in group" class="fmt-center">
             <span v-if="role.access" :title="$t('ACCEPTED')"><i class="fa fa-check" style="color:green;"></i></span>
             <span v-else-if="role.status">
               <span v-if="role.status === 'WAITING'" :title="$t('WAITING')">
                 <i class="fa fa-clock-o"></i>
               </span>
                <span v-if="role.status === 'REJECTED'" :title="$t('REJECTED')">
                 <i class="fa fa-close" style="color:darkred;"></i>
               </span>
                 <span v-if="role.status === 'CONDITION'" :title="$t('CONDITION')">
              <!-- <router-link :to="{name:'Charter', params: {id: role.charterId}}">
                 <i class="fa fa-pencil" ></i>
               </router-link> -->
             </span>
             </span>
           <span v-else="!role.status">
              <input v-if="index === 1 || checkedRoles.indexOf(name + '.' + group[1].name) < 0" type="checkbox" :value="name + '.' + role.name" 
              :checked="checkedRoles.indexOf(name + '.' + role.name) >= 0" @click="changeRole($event)" />
              <input v-if="index === 0 && checkedRoles.indexOf(name + '.' + group[1].name) >=0"  type="checkbox"  :checked="true" disabled value="no" />

           </span>
             
          </div>
          <div>
             <span v-if="group[0].charterId">
                <!-- <router-link :to="{name:'Charter', params: {id: group[0].charterId}}">
                    <span v-if="$store.getters['charters/isSigned'](group[0].charterId)">
                       {{$t('signed')}}
                    </span>
                    <span :title="$t('CONDITION')" v-else>
                     <i class="fa fa-pencil"></i>
                    </span>
                </router-link> -->
           </span>
           <span v-else><em>{{$t('no_charter')}}</em></span>
        </div>
     </div>
     </div>

</template>
<style scoped>
 div.title-client {
    cursor:pointer;
    text-align:left;
 }
 div.title-client::before {
  content: ' + ';
}
div.deployed div.title-client::before {
  content: ' - ';
}
div.client-content {
 display:block;
}
div.deployed + div.client-content {
  display:block;
}

div.client-content div.role-line:nth-child(2n + 1) {
  background: #f3f3f3;
}

</style>