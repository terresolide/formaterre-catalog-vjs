<script setup>
import {computed, onMounted, reactive} from 'vue'
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
const updated = computed(() => {
    if (data.organization && !user.organization) {
        console.log('ici')
        return true
    }
    if (user.organization && user.organization.id !== data.organizationId) {
        console.log(user.organization)
        console.log(data)
        console.log('par là')
        return true
    }
    return false
})
function reset () {
    data.organization = user.organization ? user.organization.name : null
    data.organizationType = user.organization ? user.organization.type : null
    data.organizationId = user.organization ? user.organization.id : null
}
function  getOrganizationTypes ( ) {
   
    fetch(config.state.tools + '/api/types?lang=' + config.state.lang)
    .then(resp => resp.json())
    .then(json => {
        if (json.types) {
            data.organizationTypes = json.types
        }
    })
}
function getOrganizations (domain) {
      var url = config.state.tools + '/api/organizations?nb=500&orderBy=' + encodeURIComponent('o_name ASC');
      if (data.organization) {
        url += '&q=' + data.organization
      }
      if (domain) {
        url += '&domain=' + domain
      }
      fetch(url)
      .then(resp => resp.json())
      .then(json => {
        if (json.organizations) {
          data.organizations = json.organizations
          if (domain && data.organizations.length === 1) {
            data.organization = data.organizations[0].o_name
            data.organizationId = data.organizations[0].o_uid
            data.organizationType = data.organizations[0].o_fk_type_id
          }
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
        return
    }
    if (data.organization.length < 5) {
        return
    }
      // valid organism
    // data.showOrganismMessage = false
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
     // data.showOrganismMessage = true
    }     
    
}
onMounted(() => {
    getOrganizationTypes()
    reset()
})
</script>
<template>
    <div ><label :style="{color: config.state.primary}" >Name</label> {{user.name}}</div>
    <div><label :style="{color: config.state.primary}">Email</label> {{user.email}}</div>
    <hr />
    <div>
        <label :style="{color: config.state.primary}" >Organisation</label>
        <div>   
            <label>Name</label> 
             <input style="line-height:normal;min-width:calc(100% - 70px);" v-model="data.organization" list="organizations" required 
             @mousedown="$event.stopPropagation()" @input="organizationUpdated($event)" > *
            <!-- <em v-if="data.organizationMessage" style="color:darkred;">{{$t('at_least_3')}}</em> -->
             <datalist id="organizations">
                <option v-for="org in data.organizations" :data-value="org.o_uid" >{{org.o_name}}<span v-if="org.o_short"> ({{org.o_short}})</span></option>
             </datalist>
        </div>
        <div>   
            <label>Type</label>
            <select v-model="data.organizationType" :disabled="data.organizationId">
               <template v-for="item in data.organizationTypes">
                  <option :value="item.t_id"> {{item.t_name}}</option>
                </template>
            </select>
        </div>
        <div style="text-align:right;margin-top:10px;"> 
            <button @click="resetOrganization" :disabled="updated">Reset</button>
            <button @click="update" :disabled="updated">Update</button>
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
label {
    display:inline-block;
    min-width:50px;
}
</style>