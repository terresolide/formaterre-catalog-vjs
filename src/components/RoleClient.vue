<script setup>
import {useConfig} from '@/stores/config.js'
import TooltipBox from '@/components/TooltipBox.vue'
const {name, client} = defineProps({
    name: String,
    client: {
        type: Object,
        default: null
    }
})
const config = useConfig()
function tr (obj) {
    var lang = config.state.lang
    if (obj[lang]) {
        return obj[lang]
    }
    return obj
}
function description (role) {
    console.log(role)
    if (role.description && role.description[config.state.lang]) {
      return role.description[config.state.lang]
    } else if (role.description) {
      return role.description[Object.keys(role.description)[0]]
    }
    return null
}
function toggleClient (evt) {
}
</script>
<template>
 <div v-if="0 && client && client.roles.length > 0">
    <div class="role-line deployed" >
      <div  class="title-client" style="cursor:pointer;text-align:left;"  >
         <span style="font-weight:800;">{{tr(client.title)}}</span> 
      </div>
    </div>
  </div>
 <div v-else-if="(client.groups && Object.keys(client.groups).length > 0) || (client.roles && client.roles.length > 0)" class="role-line">

       <div  class="title-client" style="cursor:pointer;text-align:left;"  @click="toggleClient($event)">
         <span style="font-weight:800;">{{tr(client.title)}}</span> 
        </div>
        <div class="fmt-center" style="clear:both;">
           <tooltip-box :description="description(client)" />
        </div>
        <div class="fmt-center" >
         
        </div>
        <div class="fmt-center" >
         
        </div>
        <div class="fmt-center">
         <span v-if="client.token" class="copy-clipboard" :title="$t('copy_in_clipboard')">
               <span @click="copyClipboard($event, name)" class="fmt-button small fa fa-clipboard" :style="{background: confi.state.primary}">
                 {{$t('access_token')}}
               </span>
              <div class="clipboard-tooltip"  @click="removeTooltip($event)" v-html="$t('copied_to_clipboard', {client: name})"></div>
           </span> 
        </div>
     </div>

</template>
<style scoped>
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
div.role-line {
  display: grid;
  grid-template-columns: minmax(100px,180px) 50px minmax(50px, 120px) minmax(50px, 120px) minmax(50px, 150px);
  grid-gap: 5px;
  text-align:center;
}

div.client-content div.role-line:nth-child(2n + 1) {
  background: #f3f3f3;
}
div.role-line > div:first-child {
  min-width: 100px;
  max-width: 180px;
  text-align: right;
}
</style>