<script setup>
import {useConfig} from '@/stores/config.js'
import {useUser} from '@/stores/user.js'
const config = useConfig()
const user = useUser()
</script>
<template>
    <div ><label :style="{color: config.state.primary}" >Name</label> {{user.name}}</div>
    <div><label :style="{color: config.state.primary}">Email</label> {{user.email}}</div>
    <hr />
    <div>
        <label :style="{color: config.state.primary}" >Organisation</label>
        <div><label>Name</label> {{user.organization.name}}</div>
        <div><label>Type</label> {{user.organization.type}}</div>
    </div>
</template>
<style scoped>
hr {
    width: 60%;
    margin: 10px auto;
    border-top:1px solid grey;
    height:1px;
}
</style>