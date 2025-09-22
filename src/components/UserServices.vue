<script setup>
import {useConfig} from '@/stores/config.js'
import {useClient} from '@/stores/client.js'
const config = useConfig()
const client = useClient()
</script>
<template>
    <template v-if="client.list && client.list.length > 0">
        <fieldset :style="{borderColor: config.state.primary}">
            <legend :style="{color: config.state.primary}">Services</legend>
            <template v-for="item in client.list">
               <div v-if="item.type !== 'hidden'"> {{item.domain}}
               <span v-if="item.sso">{{item.sso.getEmail()}}</span>
               <button @click="item.sso.login()">se connecter</button>
               </div>
            </template>
         </fieldset>
    </template>
</template>