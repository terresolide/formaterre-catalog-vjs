<script setup>
import {computed, reactive, ref} from 'vue'
import {useConfig} from '@/stores/config.js'
import {useSelection} from '@/stores/selection.js'
import {useClient} from '@/stores/client.js'
import VuePdfEmbed from 'vue-pdf-embed'

const {include} = defineProps({
    include: {
        type: Boolean,
        default: true
    }
})
const pdfRef = ref()
const data = reactive({
  isLoading: true,
  page: null,
  pageCount: null
})
const config = useConfig()
const client = useClient()
const selection = useSelection()
const charter = computed(() => {
   return client.charters.list.find(ch => ch.id === selection.charter)
})
const url = computed(() => {
    console.log(charter.value.file)
    if (!charter || !charter.value.file) {
        
        return null
    }
    return config.state.tools + '/pdf/' + charter.value.file[config.state.lang]
})
function close() {
    if (include) {
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
  pdfRef.value.download(charter.title[config.state.lang])
}
function print() {
  pdfRef.value.print(90, charter.title[config.state.lang], true)
}
</script>
<template>
   <template v-if="selection.charter">

   <div class="charter" :class="{include: include}">
        <h2 :style="{backgroundColor: config.state.primary}">
            <div class="close" @click="close">&times;</div>
                <template  v-if="url">
                   {{charter.title[config.state.lang]}}
                </template>
                 <template v-else>
               CHARTER NOT FOUND
            </template>            
        </h2>
        <template v-if="url">
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
        </template>
           
}
   </div>
   </template>
</template>
<style scoped>
div.charter.include {
    position:fixed;
    max-width: 1300px;
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
div.charter h2 {
    position:relative;
    margin: 0 -10px 10px -10px;
    padding: 10px;
    color: white;
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