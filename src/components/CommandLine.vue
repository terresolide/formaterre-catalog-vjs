<script setup >
import {computed, ref} from 'vue'
import { useSelection } from '@/stores/selection'

const selection = useSelection()

const isGeodes = false
const token = null
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
function close () {
    selection.setDownload(null)
}
function copy2clipboard (e) {

      var target = e.target
      if (isGeodes) {
        var text = 'curl -k -L -H "Authorization: Bearer ' + token + '" ' + selection.download.url  + ' -o ' + selection.download.name
      } else if (token) {
        var text = 'curl ' + selection.download.url  + '?_bearer=' + token + ' -o ' + selection.download.name
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
      <template v-if="isGeodes">curl -k -L -H "Authorization:Bearer {{token}}" {{selection.download.url}} -o {{file}}</template>
      <template v-else-if="token">curl {{selection.download.url}}?_bearer={{token}} -o {{file}}</template>
      <template v-else >curl {{selection.download.url}}  -o {{file}}</template>
      </div>
      <div style="display:inline-block;vertical-align:top;max-width:90px;margin-left:5px;">
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
.fmt-close {
  border:1px dotted white;
  padding: 3px;
  border-radius:3px;
  cursor: pointer;
}
.fmt-close:hover {
  border-color:black;
}

</style>