<script setup>
import {onMounted, reactive} from 'vue'
import {useConfig} from '@/stores/config.js'
import {useUser} from '@/stores/user.js'
const config = useConfig()
const user = useUser()
const data = reactive({
    organizationTypes: [],
    organizations: [],
    organization: null,
    organizationType: null,
    organizationId: null
})
function  getOrganizationTypes ( ) {
   
    fetch(config.state.tools + '/api/types?lang=' + config.state.lang)
    .then(resp => resp.json())
    .then(json => {
        if (json.types) {
            data.organizationTypes = json.types
        }
    })
}
function organizationUpdated (event) {
      data.organizationId = null
      data.organizationType = null
      
      if (data.organization.length <= 1) {
        data.organizations = []
      }
      if (event.inputType && event.inputType.indexOf('delete') >=0)
      {
        return
      }
      if (data.organization.length === 2) {
         getOrganizations()
      }
      if (data.organization.length < 5) {
        return
      }
      
     // this.info.message = null
      
        // valid organism
      data.showOrganismMessage = false
      var regex = new RegExp(/^[A-z0-9À-ž\s\-'@()]{5,300}$/)
      if (regex.test(data.organization)) {
        var organism = data.organization.trim().toLowerCase()
        var find = data.organizations.find(org => organism.indexOf(org.o_name.toLowerCase()) >= 0 )
        if (find) {
          data.organizationId = find.o_uid
          data.organizationType = find.o_fk_type_id
        } else {
          data.organizationId = null
        }
      } else {
        data.showOrganismMessage = true
      }     
    
}
onMounted(() => {
    getOrganizationTypes()
    data.organization = user.organization ? user.organization.name : null
    data.organizationType = user.organization ? user.organization.type : null
    data.organizationId = user.organization ? user.organization.id : null
})
</script>
<template>
    <div ><label :style="{color: config.state.primary}" >Name</label> {{user.name}}</div>
    <div><label :style="{color: config.state.primary}">Email</label> {{user.email}}</div>
    <hr />
    <div>
        <label :style="{color: config.state.primary}" >Organisation</label>
        <div><label>Name</label> <input type="text" v-model="data.organization" /></div>
        <div>   
            <label>Type</label>
            <select v-model="data.organizationType">
               <template v-for="item in data.organizationTypes">
                  <option :value="item.t_id"> {{item.t_name}}</option>
                </template>
            </select>
        </div>
    </div>
</template>
<style scoped>
hr {
    width: 60%;
    margin: 10px auto;
    border-top:1px solid grey;
    height:1px;
}
</style>