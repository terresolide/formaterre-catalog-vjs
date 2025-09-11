<script setup>
import {useConfig} from '@/stores/config.js'
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
</script>
<template>
 <div v-if="client && client.roles.length > 0">
 {{name}}
    <div class="role-line deployed" >
      <div  class="title-client" style="cursor:pointer;text-align:left;"  >
         <span style="font-weight:800;">{{tr(client.title)}}</span> 
      </div>
    </div>
  </div>
 <div v-else-if="(client.groups && Object.keys(client.groups).length > 1) || (client.roles && client.roles.length > 1)" class="role-line">

       <div  class="title-client" style="cursor:pointer;text-align:left;"  @click="toggleClient($event)">
         <span style="font-weight:800;">{{tr(client.title)}}</span> 
        </div>
        <div class="fmt-center" style="clear:both;">
           <!-- <formater-tooltip :description="description(client)"></formater-tooltip>-->
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

</template>