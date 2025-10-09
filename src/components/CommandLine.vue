<script setup >
import {computed, ref} from 'vue'
import { useSelection } from '@/stores/selection'
import { useClient} from '@/stores/client'

const selection = useSelection()
const client = useClient()
const button = ref()

const file = computed(() => {
    var filename = selection.download.url.substring(selection.download.url.lastIndexOf('/') + 1)
    var regex = new RegExp('/\.[^.]+$/')
    if (filename.match(/\.[^.]+$/)) {
        return filename
    } else if (selection.download.mimeType ) {
        console.log(selection.download.mimeType)
        switch(selection.download.mimeType.toLowerCase())  {
            case 'application/zip':
                return selection.download.title + '.zip'
                break
            default:
                return null
        }
      } 
})
// Normalement, il faut aller chercher le token, du bon sso,
const currentClient = computed(() => {
    if (client.current) {
        return client.current
    } else if (selection.download.ssoId) {
        return client.getSsoFromId(selection.download.ssoId)
    } else {
        null
    }
})
function close () {
    selection.setDownload(null)
}
function copy2clipboard (e) {

      var target = e.target
      if (currentClient && currentClient.value && currentClient.value.sso.getToken()) {
        var text = 'curl -k -L -H "Authorization: Bearer ' + currentClient.value.sso.getToken() + '" ' + selection.download.url  + ' -o ' + selection.download.name
      // } else if (token) {
      //  var text = 'curl ' + selection.download.url  + '?_bearer=' + token + ' -o ' + selection.download.name
      } else {
        var text = 'curl ' + selection.download.url  + ' -o ' + selection.download.name
      }
      navigator.clipboard.writeText(text).then(function() {
        /* clipboard successfully set */
        target.classList.add('tooltip-show')
        setTimeout(function () {
          target.classList.remove('tooltip-show')
        }, 6000)
      }, function() {
        alert('unauthorized_clipboard')
      });
      
}
function removeTooltip ()
{
  if (button) {
    button.value.classList.remove('tooltip-show')
  }
}
 
</script>
<template>
<div  class="fmt-console">
  <div @click="close" class="fmt-close" style="position:absolute;right:5px;top:3px;">
    <font-awesome-icon icon="fa-solid fa-remove" />
  </div>
  <h3>{{$t('command_line')}}</h3>
 <div >
    <div><b>Archive</b>: {{selection.download.name}}</div>
    <div><b>{{$t('command_to_execute')}}:</b></div>
      <div style="display:inline-block;font-family: monospace;max-height:200px;overflow:scroll;padding:3px;width:calc(100% - 100px);color:#5ddc5d;background:#333;">
      <template v-if="currentClient && currentClient.sso.getToken()">curl -k -L -H "Authorization:Bearer {{currentClient.sso.getToken()}}" {{selection.download.url}} -o {{selection.download.name}}</template>
     <!-- <template v-else-if="token">curl {{selection.download.url}}?_bearer={{token}} -o {{selection.download.name}}</template>
      -->
      <template v-else >curl {{selection.download.url}}  -o {{file}}</template>
      </div>
      <div style="display:inline-block;vertical-align:top;max-width:95px;margin-left:5px;">
      <button ref="button" @click="copy2clipboard($event)" :title="$t('copy_clipboard')">
         <font-awesome-icon icon="fa-solid fa-clipboard" /> {{$t('copy')}}
      </button>
     <div class="clipboard-tooltip" @click="removeTooltip">{{$t('copied_clipboard')}}</div>
    </div>
  </div> 
</div>
</template>

<style scoped>
.fmt-console {
   position: fixed;
   top: 50%;
   left: 50%;
   z-index:3;
   background: white;
   width:90%;
   max-width: 900px;
   padding:10px;
   word-break: break-all;
   transform: translate(-50%, -50%);
   border-radius: 3px;
   box-shadow: 2px 3px 3px 3px rgba(0, 0, 0, 0.5);
}


</style>