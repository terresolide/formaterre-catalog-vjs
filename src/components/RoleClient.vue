<script setup>
const {client} = defineProps({
    client: {
        type: Object,
        default: null
    }
})
</script>
<template>
 <span v-if="client">
 {{client}}
    <div class="role-line deployed" >
      <div  class="title-client" style="cursor:pointer;text-align:left;"  >
         <span style="font-weight:800;">{{client.title}}</span> 
      </div>
  </div>
<!--  <div v-else-if="(client.groups && Object.keys(client.groups).length > 1) || (client.roles && client.roles.length > 1)" class="role-line">

       <div  class="title-client" style="cursor:pointer;text-align:left;"  @click="toggleClient($event)">
         <span style="font-weight:800;">{{title(client)}}</span> 
        </div>
        <div class="fmt-center" style="clear:both;">
            <formater-tooltip :description="description(client)"></formater-tooltip>
        </div>
        <div class="fmt-center" >
         
        </div>
        <div class="fmt-center" >
         
        </div>
        <div class="fmt-center">
         <span v-if="client.token" class="copy-clipboard" :title="$t('copy_in_clipboard')">
               <span @click="copyClipboard($event, name)" class="fmt-button small fa fa-clipboard" :style="{background: $store.state.style.primary}">
                 {{$t('access_token')}}
               </span>
              <div class="clipboard-tooltip"  @click="removeTooltip($event)" v-html="$t('copied_to_clipboard', {client: name})"></div>
           </span> 
        </div>
     </div>

       <div :class="{'client-content': (client.groups && Object.keys(client.groups).length > 1) || (client.roles && client.roles.length > 1) }">
             <div class="role-line" v-if="showRole(null) && client.groups && Object.keys(client.groups).length > 1">
                
             </div>
             <div  class="role-line"  v-for="(role, index) in client.roles" v-show='showRole(role.name)'>
                    <div>{{title(role)}}</div>
                    <div class="fmt-center">
                    <formater-tooltip :description="description(role)"></formater-tooltip>
                    </div>
                    <div v-for="key in ['view', 'download']" class="fmt-center">
                      <span v-if="role.access" :title="$t('ACCEPTED')"><i class="fa fa-check" style="color:green;"></i></span>
              
                  <span v-else-if="role.status">
                          <span v-if="role.status === 'WAITING'">
                            <i class="fa fa-clock-o" ></i>
                          </span>
                          <span v-else-if="role.status && role.status === 'REJECTED'">
                            <i class="fa fa-close" style="color:darkred;"></i>
                          </span>
                          <span v-if="role.status === 'CONDITION'" :title="$t('CONDITION')">
                               <router-link :to="{name:'Charter', params: {id: role.charterId}}">
                                   <i class="fa fa-pencil" ></i>
                               </router-link>
                          </span>
                 </span>
                 <span v-else-if="(Object.keys(role.parameters).length === 0 || !role.parameters.charter)">
                          <input  type="checkbox" :value="name + '.' + role.name" 
                      :checked="checkedRoles.indexOf(name + '.' + role.name) >= 0" @click="changeRole($event)" />
                     </span>
                     <span v-else-if="role.charterId" :title="$t('CONDITION')" >
                          <router-link :to="{name:'Charter', params: {id: role.charterId}}">
                               <i class="fa fa-pencil" ></i>
                       </router-link>
                     </span>
                    </div>
                    <div class="fmt-center">
                      <span v-if="role.charterId">
                       <router-link v-if="role.charterId" :to="{name: 'Charter', params: {id: role.charterId}}">
                      <span v-if="$store.getters['charters/isSigned'](role.charterId)">
                        {{$t('signed')}}
                       </span>
                            <span  v-else :title="$t('CONDITION')">
                             <i class="fa fa-pencil"></i>
                            </span>
                   </router-link>
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
               <router-link :to="{name:'Charter', params: {id: role.charterId}}">
                 <i class="fa fa-pencil" ></i>
               </router-link>
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
                 <router-link :to="{name:'Charter', params: {id: group[0].charterId}}">
                    <span v-if="$store.getters['charters/isSigned'](group[0].charterId)">
                       {{$t('signed')}}
                    </span>
                    <span :title="$t('CONDITION')" v-else>
                     <i class="fa fa-pencil"></i>
                    </span>
                </router-link>
           </span>
           <span v-else><em>{{$t('no_charter')}}</em></span>
        </div>
     </div>
   </div>-->
 </span>
</template>