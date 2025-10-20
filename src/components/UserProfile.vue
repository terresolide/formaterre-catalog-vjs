<script setup>
import {useConfig} from '@/stores/config.js'
import UserAttributs from '@/components/UserAttributs.vue'
import UserAccessRights from '@/components/UserAccessRights.vue'
import UserCharters from '@/components/UserCharters.vue'
import UserServices from '@/components/UserServices.vue'
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
        <div class="profile-content">
            <div class="column-left">
                <fieldset :style="{borderColor: config.state.primary}">
                    <legend :style="{color: config.state.primary}">Informations</legend>
                    <user-attributs />  
                </fieldset>
                
                <user-services />
                <user-charters />  
  
            </div>
            <div class="column-right">
                <fieldset :style="{borderColor: config.state.primary}">
                    <legend :style="{color: config.state.primary}">{{$t('access_rights')}}</legend>
                    <user-access-rights />
                </fieldset>
            </div>
        </div>
    </div>
  </template>
</template>
<style>
.profile fieldset {
    border: 0.5px solid grey;
    margin-bottom:10px;
    padding: 5px;
}
.profile legend {
    font-weight:700;
}
</style>
<style scoped>
div.profile {
    position:fixed;
    max-width: 1200px;
    background: white;
    border: 1px solid grey;
    max-height:calc(100vh - 30px);
    width:calc(100% - 80px);
    min-width:600px;
    top: 5px;
    left: 50%;
    line-height:1.2;
    text-align: left;
    padding:0px 10px 10px 10px;
    transform: translate(-50%, 0);
    box-shadow: 0 0px 20px rgba(0,0,0,0.7);
    z-index:101;
    overflow:hidden;
}

div.profile h2 {
    position:relative;
    margin: 0 -10px 10px -10px;
    padding: 10px;
    color: white;
}
div.profile-content {
    max-height:calc(100vh - 100px);
    overflow-y:auto;
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

div.column-right {
    margin-top:10px;
}
@media screen and (width >= 900px) {

    div.column-left {
        width: 370px;
        float:left;
    }
    div.column-right {
        margin-left: 380px;
        padding-right:10px;
        margin-top:0;
        width: calc(100% - 380px);
    }
}
</style>