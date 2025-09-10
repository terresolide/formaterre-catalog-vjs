<script setup>
import {useConfig} from '@/stores/config.js'
import UserAttributs from '@/components/UserAttributs.vue'
import UserAccessRights from '@/components/UserAccessRights.vue'
const profile = defineModel()
const config = useConfig()
</script>
<template>
 <template v-if="profile">
    <div class="profile">
    <h2 :style="{backgroundColor: config.state.primary}">
        <div class="close" @click="profile=false">&times;</div>
        <font-awesome-icon icon="fa-solid fa-user" />  {{$t('your_profile')}}
        
    </h2>
    <div class="column-left">
        
        <fieldset :style="{borderColor: config.state.primary}">
            <legend :style="{color: config.state.primary}">User information</legend>
            <user-attributs />
            
        </fieldset>
    </div>
    <div class="column-right">
        <fieldset :style="{borderColor: config.state.primary}">
            <legend :style="{color: config.state.primary}">Access rights</legend>
            <user-access-rights />
        </fieldset>
    </div>
    </div>
  </template>
</template>
<style scoped>
div.profile {
    position:fixed;
    max-width: 1200px;
    background: white;
    border: 1px solid grey;
    max-height:calc(100vh - 30px);
    width:calc(100% - 80px);
    min-width:600px;
    min-height:600px;
    top: 50%;
    left: 50%;
    line-height:1.2;
    text-align: left;
    padding:0px 10px 10px 10px;
    transform: translate(-50%, -50%);
    box-shadow: 0 0px 3px rgba(0,0,0,0.5);
    z-index:11;
}
div.profile h2 {
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
fieldset {
    border: 0.5px solid grey;
}
legend {
    font-weight:700;
}
@media screen and (width >= 900px) {
    div.column-left {
        width: 360px;
        float:left;
    }
    div.column-right {
        margin-left: 370px;
        width: calc(100% - 370px);
    }
}
</style>