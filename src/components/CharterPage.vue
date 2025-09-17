<script setup>
import {computed} from 'vue'
import {useConfig} from '@/stores/config.js'
import {useSelection} from '@/stores/selection.js'
import {useClient} from '@/stores/client.js'
const {include} = defineProps({
    include: {
        type: Boolean,
        default: true
    }
})
const config = useConfig()
const client = useClient()
const selection = useSelection()
const charter = computed(() => {
   return client.charters.list.find(ch => ch.id === selection.charter)
})
function close() {
    if (include) {
        selection.setCharter(null)
    } else {
        // back
    }
}
</script>
<template>
   <template v-if="selection.charter">
   <div class="charter" :class="{include: include}">
        <h2 :style="{backgroundColor: config.state.primary}">
            <div class="close" @click="close">&times;</div>
            <template v-if="charter">
               {{charter.title[config.state.lang]}}
            </template>
            <template v-else>
               CHARTER NOT FOUND
            </template>            
        </h2>
     {{charter}}
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
</style>