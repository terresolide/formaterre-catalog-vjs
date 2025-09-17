<script setup>
import {useConfig} from '@/stores/config.js'
import {useClient} from '@/stores/client.js'
const config = useConfig()
const client = useClient()
</script>
<template>
    <template v-if="client.charters && client.charters.list && client.charters.list.length > 0">
        <fieldset :style="{borderColor: config.state.primary}">
            <legend :style="{color: config.state.primary}">Chartes d'utilisation</legend>
            <template v-for="item in client.charters.list">
                <div class="charter-row">
                    <div>{{item.title[config.state.lang]}}</div>
                    <div>
                        <template v-if="client.charters.signed.indexOf(item.id) >=0">
                            <font-awesome-icon icon="fa-solid fa-check" style="color:green;"/>
                        </template>
                        <template v-else>
                            <font-awesome-icon icon="fa-solid fa-pencil" /> 
                        </template>
                    </div>
                </div>
            </template>
         </fieldset>
    </template>
</template>
<style scoped>
div.charter-row {
    display: grid;
    grid-template-columns: 1fr 40px;
    grid-gap: 5px;
    text-align:left;
}
div.charter-row > div:first-child {
    cursor:pointer;
}
div.charter-row > div:first-child:before {
    content: "\2192 ";
    padding-right:2px;
}
div.charter-row > div:first-child:hover {
    color:black;
}
</style>
