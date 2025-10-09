<script setup>
// import { computed} from 'vue';
import {useUser} from '@/stores/user.js'
import {useConfig} from '@/stores/config.js'
import {useSelection} from '@/stores/selection'
import {useClient} from '@/stores/client'
import streamSaver  from 'streamsaver'
  
const {links,  access, mode, ssoId} = defineProps({
    links: Array,
    access: Object,
    mode: {
        type: String,
        default: 'box'
    },
    ssoId: {
        type: String,
        default:null
    }
})

const emit = defineEmits(['click'])
const user = useUser()
const selection = useSelection()
const client = useClient()
const config = useConfig()

function commandLine(index) {
    if (access.download === 0) {
        emit('click')
        return
    }

    selection.setDownload(links[index], ssoId)
}

function download (index) {
    if (access.download === 0) {
        emit('click')
        return
    }
    if (ssoId) {
        var sso = client.getSsoFromId(ssoId)
        var link = links[index]
        getTokenInHeader(link, sso.sso.getToken())
    } else {
        var a = document.createElement('a')
        a.setAttribute('href', links[index].url)
        a.setAttribute('target', '_blanck');
        document.body.append(a)
        a.click()
    }
}
function getTokenInHeader (link, token) {
    if (!config.state.streamSaver) {
            config.state.streamSaver = streamSaver
         }
     var url = link.url 
         console.log(url)
         var name = link.name

        // UTILISATION D'UN STREAM WRITER
         var  headers = {}
        // url = 'https://geodes-portal.cnes.fr/api/download/URN:FEATURE:DATA:gdh:03684236-bf97-339c-b789-60ff7541893c:V1/files/3fee0d25f8d65705a0af7205342daf14'
        // url = 'https://catalog.formater/test.zip'
         if (token) {
           // url += '?_bearer=' + this.token
           headers['Authorization'] = 'Bearer ' + token
           // headers = {}
         }
         var filename = name || url.substring(url.lastIndexOf('/') + 1) + '.zip'
        // const fileStream = streamSaver.createWriteStream(name)
        const ac = new AbortController()
        const signal = ac.signal
        selection.writableStreams.push(ac)
        fetch(url, {headers: headers, signal: signal}).then(res => {
          if (!res.ok ) {
            console.log(res.status)
            switch (res.status) {
             
              case 403:
              // this.message = this.$i18n.t('download_forbidden')
              
              break
              case 404:
              // this.message = 'NOT FOUND'
              
              break
              default:
                if (res.body.ErrorMessage) {
                 // this.message = res.body.ErrorMessage
                } else {
                // this.message = 'An error has occured'
                }
            }
            return res
          }
          // get filename
          var headerDisposition = res.headers.get('Content-Disposition')
          if (headerDisposition) {
            var match = headerDisposition.match(/filename[^;\n=]*=(\\?\"|'){0,1}([^\\?\"']*)(\\?\"|'){0,1}/i)
            if (match) {
              filename = match[2]
            }
          }
          var options = {}
          var size = res.headers.get('Content-Length')
          if (size) {
            options.size = size
          }
          console.log(res.headers)
          const fileStream = config.state.streamSaver.createWriteStream(filename, options)
          const readableStream = res.body
          
          // more optimized
          if (window.WritableStream && readableStream.pipeTo) {
            return readableStream.pipeTo(fileStream, {signal: signal})
              .then(() => {
                // _this.$set(_this.download[index], 'disabled', false)
                selection.writableStreams.pop()}, 
              () => {
                // _this.$set(_this.download[index], 'disabled', false)
                selection.writableStreams.pop()
              })
          }
          window.writer = fileStream.getWriter()

          const reader = res.body.getReader()
          const pump = () => reader.read()
            .then(res => res.done
              ? writer.close()
              : writer.write(res.value).then(pump))
          pump()
        })
}
</script>
<template>   
     <template v-if="links.length === 1 && mode === 'box'">
        <div class="mtdt-related-type" :title="links[0].name" :class="{disabled: access.download < 0, notAuthenticated: access.download === 0}"
        @click="download(0)">
            <font-awesome-icon icon="fa-solid fa-download" />
        </div>
     </template>
     <template v-else>
         <div class="mtdt-related-type" :title="$t('download_link')" :class="{disabled: access.download < 0, notAuthenticated: access.download === 0}">
            <font-awesome-icon icon="fa-solid fa-download"  />
            <font-awesome-icon v-if="mode === 'box'"
              style="margin-left: 2px"
              icon="fa-solid fa-caret-down"
            />
        </div>
     </template>

  <div v-if="links.length > 1 || mode === 'page'" class="mtdt-expand mtdt-links">
    <ul>
      <template v-for="(link, index) in links">
        <li @click="download(index)" style="cursor:pointer;" :class="{disabled: access.download < 0, notAuthenticated: access.download === 0}">
          <a :href="link.url" target="_blank" download :title="link.description">{{ link.name }}</a>
        </li>
      </template>
    </ul>
  </div>
  <!-- téléchargement en ligne de commande si un seul lien-->
  <template v-if="links.length === 1 && mode === 'box'" >
      <div class="mtdt-related-type" :title="$t('command_line')" :class="{disabled: access.download < 0, notAuthenticated: access.download === 0}" @click="commandLine(0)">
        <font-awesome-icon icon="fa-solid fa-terminal" />
      </div>
  </template>
  <template v-else>
       <div class="mtdt-related-type" :class="{disabled: access.download < 0, notAuthenticated: access.download === 0}" :title="$t('command_line')" >
        <font-awesome-icon icon="fa-solid fa-terminal" />
      </div>
       <div v-if="links.length > 1 || mode === 'page'" class="mtdt-expand mtdt-links">
    <ul>
      <template v-for="(link, index) in links">
        <li @click="commandLine(index)" style="cursor:pointer;">
          <a   :title="link.description">{{ link.name }}</a>
        </li>
      </template>
    </ul>
  </div>
  </template>
</template>