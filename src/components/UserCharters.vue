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
                <div>{{item.title[config.state.lang]}}</div>
            </template>
         </fieldset>
    </template>
</template>
