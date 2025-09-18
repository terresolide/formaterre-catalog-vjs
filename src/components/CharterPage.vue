<script setup>
import {computed, reactive, ref} from 'vue'
import {useConfig} from '@/stores/config.js'
import {useSelection} from '@/stores/selection.js'
import {useClient} from '@/stores/client.js'
import {useUser} from '@/stores/user.js'

import VuePdfEmbed from 'vue-pdf-embed'

const {id} = defineProps({
    id: {
        type: Number,
        default: -1
    }
})
const pdfRef = ref()
const data = reactive({
  isLoading: true,
  page: null,
  pageCount: null,
  signed: false
})
const config = useConfig()
const client = useClient()
const selection = useSelection()
const user = useUser()
const charterId = computed(() => {
    if (id >= 0) {
        return id
    }
    return selection.charter
})


const charter = computed(() => {
   
    if (!client.loaded ) {
        return null
    }
   return client.charters.list.find(ch => ch.id === charterId.value)
})
const signed = computed(() => {
    data.signed = signed
    return client.charters.signed.indexOf(charterId.value) >= 0
})
const url = computed(() => {
    if (!charter || !charter.value || !charter.value.file) {
        
        return null
    }
    return config.state.tools + '/pdf/' + charter.value.file[config.state.lang]
})

const background = computed(() => {
    return new URL('@/assets/img/background-sign.png', import.meta.url).href
})
function close() {
    if (id < 0) {
        selection.setCharter(null)
    } else {
        // back
    }
}
function handleDocumentLoad(result) {
      data.pageCount = result.numPages
      data.page = 1
}
function  handleDocumentRender() {
      data.isLoading = false
}
function download () {
    if (charter.value) {
        pdfRef.value.download(charter.value.title[config.state.lang])
    }
}
function print() {
    if (charter.value) {
        pdfRef.value.print(90, charter.value.title[config.state.lang], true)
    }
}
function sign () {
}
</script>
<template>
   <template v-if="selection.charter || id >= 0">

   <div class="charter" :class="{include: id < 0}">
        <template v-if="id >=0">
            <template  v-if="url">
                <h2>{{charter.title[config.state.lang]}}</h2>
            </template>
        </template >
        <template v-else>
            <h2 :style="{backgroundColor: config.state.primary}">
                <div class="close" @click="close">&times;</div>
                    <template  v-if="url">
                       {{charter.title[config.state.lang]}}
                    </template>
                     <template v-else>
                   CHARTER NOT FOUND
                </template>            
            </h2>
        </template>
        <div class="charter-content">
            <template v-if="url">
               <template v-if="!signed">
                  <div>{{$t('to_sign')}}</div>
               </template>
               <template v-else>
                    <div  style="color:darkred;text-align:center;font-size:1.5rem;" v-html="$t('already_signed', {charter: charter.title[config.state.lang]})"></div>
                </template>
                <div style="border:1px solid black;max-width:900px;margin:auto;">
                 <div class="app-header">
                    <template v-if="data.isLoading">
                      Loading...
                    </template>
                
                    <template v-else>
                        <div> &nbsp;</div>
                        <div style="text-align:center;">
                          <button class="classic" :disabled="data.page <= 1" @click="data.page--">❮</button>
                        
                          {{ data.page }} / {{ data.pageCount }} &nbsp;
                        
                          <button class="classic" :disabled="data.page >= data.pageCount" @click="data.page++">❯</button>
                        
                        </div>
                        <div style="text-align:right;" >
                            <button class="classic" @click="download" style="padding:3px 10px;">
                              <font-awesome-icon icon="fa-download"></font-awesome-icon>
                            </button>
                            <button class="classic" @click="print" style="padding:3px 10px;">
                              <font-awesome-icon icon="fa-print"></font-awesome-icon>
                             </button>
                        </div>
                       
                </template>
                
                </div>
                <vue-pdf-embed ref="pdfRef" :source="url" :page="data.page" 
               @loaded="handleDocumentLoad" @rendered="handleDocumentRender" />
               </div>
               <!--- form signature -->
               <div class="form-charter">
                 
                    <input type="checkbox" v-model="data.signed" :disabled="!user || signed || data.searching" required /> 
                    <span style="margin-left:5px;" v-html="$t('accept_charter', {charter: charter.title[config.state.lang]})"></span> 
                    <div v-if="data.success" style="color:green;" v-html="$t('sign_saved', {charter: charter.title[config.state.lang]})"></div>
                    <!---<div v-if="success & newRoles.length > 0" style="color:green;" v-html="$t('new_roles', {newroles: newRoles.join(',')})"></div>-->
                    <div style="margin:20px;text-align:right;">
                         <input type="button" value="Enregistrer" :disabled="!user || data.signed || data.searching" @click="send"/>
                    </div>
                </div>
            </template>
            <template v-else-if="id >= 0">
               <div class="background-auth" :style="{backgroundImage:'url(' + background + ')'}">
                   <div>{{$t('must_authenticate')}}</div>
               </div>
            </template>
                
        </div> 
   </div>
   </template>
</template>

<style scoped>
div.background-auth {
    margin: 50px auto;
    padding: 200px 0;
    max-width:100%;
    text-align:center;
    background-size:cover;
    background-repeat: no-repeat;
    background-position:center;

}
div.background-auth > div {
     width: 300px;
     margin:auto;
     font-size:2rem;
     background: rgba(200,200,200,0.5);
}
div.charter.include {
    position:fixed;
    max-width: 1200px;
    background: white;
    border: 1px solid grey;
     min-width:600px;
    min-height:600px;
    max-height:calc(100vh - 30px);
    width:calc(100% - 80px);
   
    top: 5px;
    left: 50%;
    line-height:1.2;
    text-align: left;
    padding:0px 10px 10px 10px;
    transform: translate(-50%, 0);
    box-shadow: 0 0px 20px rgba(0,0,0,0.7);
    z-index:15;
    overflow:hidden;
}

div.form-charter {
    max-width:900px;
    margin: 20px auto;
}
div.charter h2 {
    position:relative;
    margin: 0 -10px 10px -10px;
    padding: 10px;
   
}
div.charter.include h2 {
     color: white;
}
div.charter-content {
    max-width: 1000px;
    margin:auto;
    max-height:calc(100vh - 90px);
    overflow-y: scroll;
}
div.close {
    position:absolute;
    line-height:1;
    top:2px;
    right:3px;
    padding: 0px 2px;
    cursor:pointer;
    border: 1px dotted transparent;

}

div.close:hover {
    border-color:white;
}
.vue-pdf-embed > div {
  margin-bottom: 8px;
  box-shadow: 0 2px 8px 4px rgba(0, 0, 0, 0.1);
}

.app-header {
  padding: 16px;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  box-shadow: 0 2px 8px 4px rgba(0, 0, 0, 0.1);
  background-color: #555;
  color: #ddd;
}
</style>