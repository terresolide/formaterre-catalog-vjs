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
    checkedRoles: []
})
const asking = false
const uncompletedUser = computed(() => false)
function selectRole (obj) {
    console.log(obj)
}
onMounted(() => {
    client.getRoles()
})
</script>
<template>
    <div class="role-line" style="font-weight:700;background:#e3e3e3;" >
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
        <role-client :client="client.roles.global" name="global" :checked-roles="data.checkedRoles" @roleChange="selectRole" />
     </div>
     <!--  CLIENT ROLES -->
     <template v-for="(client,clientName) in client.roles">
        <div  v-if="clientName !== 'global'" style="border-top: 1px dotted black;padding:0px;">
           <role-client :client="client" :name="clientName" :checked-roles="data.checkedRoles" @roleChange="selectRole" />
        </div>
     </template>
     <div>
       <p  v-html="$t('access_to_formater')" style="font-size:0.9em;font-style:italic;line-height:1;"></p>
       <div style="position:relative;">
         <div v-if="asking" style="position:absolute;left:50%;top:10%;font-size:30px;">
           <span class="fa fa-spinner animated"></span>
         </div>
         <textarea style="width:100%" v-model="data.message" :placeholder="$t('add_message')"></textarea>
       </div>
       <span  class="fmt-button" :class="{disabled: uncompleteUser || data.checkedRoles.length === 0 || asking}" :style="{background: config.state.primary}" @click="accessRequest">{{$t('access_request')}}</span>
       </div>
       <p  v-html="$t('wait_validation')" style="font-size:0.9em;color:green;line-height:1;"></p>
       <p  style="color:darkred;">Erreur : {{data.errorAsk}}</p>
     
</template>
<style >
div.role-line {
  display: grid;
  grid-template-columns: minmax(200px,250px) 50px minmax(50px, 120px) minmax(50px, 120px) minmax(50px, 150px);
  grid-gap: 5px;
  text-align:center;
}


div.client-content div.role-line:nth-child(2n + 1) {
  background: #f3f3f3;
}

</style>