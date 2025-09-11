<script setup>
import {computed, onMounted, ref} from 'vue'
import {useConfig} from '@/stores/config.js'
import {useUser} from '@/stores/user.js'
const config = useConfig()
const user = useUser()
const data = ref({
    organizationTypes: [],
    organizations: [],
    organization: null,
    organizationType: null,
    organizationId: null
})
const updated = computed(() => {
    if (data.value.organization && !user.organization) {
        return true
    }
    if (user.organization && user.organization.id !== data.value.organizationId) {
        return true
    }
    return false
})
function reset () {
    data.value.organization = user.organization ? user.organization.name : null
    data.value.organizationType = user.organization ? user.organization.type : null
    data.value.organizationId = user.organization ? user.organization.id : null
}
function  getOrganizationTypes ( ) {
   
    fetch(config.state.tools + '/api/types?lang=' + config.state.lang)
    .then(resp => resp.json())
    .then(json => {
        if (json.types) {
            data.value.organizationTypes = json.types
        }
    })
}
function update () {
    let post = {
        email: user.email,
        uid: user.id,
        id: data.value.organizationId,
        name: data.value.organization,
        type: data.value.organizationType
    }
    var fdata = new URLSearchParams(post)
    fetch(config.state.tools + '/api/user', {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        method: 'POST',
        body: fdata.toString()
    }).then(resp => resp.json())
    .then(json => {
        if (json.success) {
            user.setOrganization(json)
        }
    })
}
function getOrganizations (domain) {
      var url = config.state.tools + '/api/organizations?nb=500&orderBy=' + encodeURIComponent('o_name ASC');
      if (data.value.organization) {
        url += '&q=' + data.value.organization
      }
      if (domain) {
        url += '&domain=' + domain
      }
      fetch(url)
      .then(resp => resp.json())
      .then(json => {
        if (json.organizations) {
          data.value.organizations = json.organizations
          if (domain && data.value.organizations.length === 1) {
            data.value.organization = data.value.organizations[0].o_name
            data.value.organizationId = data.value.organizations[0].o_uid
            data.value.organizationType = data.value.organizations[0].o_fk_type_id
          }
        }
      })
}
function organizationUpdated (event) {
    data.value.organizationId = null
    data.value.organizationType = null
    
    if (data.value.organization.length <= 1) {
        data.value.organizations = []
    }
    if (event.inputType && event.inputType.indexOf('delete') >=0)
    {
        return
    }
    if (data.value.organization.length === 2) {
        getOrganizations()
        return
    }
    if (data.value.organization.length < 5) {
        return
    }
      // valid organism
    // data.showOrganismMessage = false
    var regex = new RegExp(/^[A-z0-9À-ž\s\-'@()]{5,300}$/)
    if (regex.test(data.value.organization)) {
        var organism = data.value.organization.trim().toLowerCase()
        var find = data.value.organizations.find(org => organism.indexOf(org.o_name.toLowerCase()) >= 0 )
        if (find) {
            data.value.organizationId = find.o_uid
            data.value.organizationType = find.o_fk_type_id
        } else {
            data.value.organizationId = null
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
    <div class="row"><label :style="{color: config.state.primary}" >{{$t('name')}}</label> {{user.name}}</div>
    <div class="row"><label :style="{color: config.state.primary}">Email</label> {{user.email}}</div>
    <hr />
    <div>
        <label :style="{color: config.state.primary}" >{{$t('organization')}}</label>
        <div class="subrow">   
            <label>{{$t('name')}}</label> 
             <input style="line-height:normal;min-width:calc(100% - 65px);" v-model="data.organization" list="organizations" required 
             @mousedown="$event.stopPropagation()" @input="organizationUpdated($event)" > *
            <!-- <em v-if="data.organizationMessage" style="color:darkred;">{{$t('at_least_3')}}</em> -->
             <datalist id="organizations">
                <option v-for="org in data.organizations" :data-value="org.o_uid" >{{org.o_name}}<span v-if="org.o_short"> ({{org.o_short}})</span></option>
             </datalist>
        </div>
        <div class="subrow">   
            <label>Type</label>
            <select v-model="data.organizationType" :disabled="data.organizationId">
               <template v-for="item in data.organizationTypes">
                  <option :value="item.t_id"> {{item.t_name}}</option>
                </template>
            </select>
        </div>
        <div style="text-align:right;margin-top:10px;"> 
            <button :style="{backgroundColor:config.state.primary}" @click="reset" :disabled="!updated">{{$t('reset')}}</button>
            <button :style="{backgroundColor:config.state.primary}" @click="update" :disabled="!updated">{{$t('save')}}</button>
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
.row {
    margin-top:5px;
}
.subrow {
    margin-top:5px;
    margin-left:5px;
}
</style>