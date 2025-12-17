<script setup>
import {computed} from 'vue'
import {useRoute, useRouter} from 'vue-router'
const route = useRoute()
const router = useRouter()
const keywords = computed(() => {
    var query = route.query
    var kwds = []
    for (var key in query) {
        if (key.startsWith('th_')) {
            var keyword = query[key].split(',')
            keyword.unshift(key)
            kwds.push(keyword)
        }
 
    }
    return kwds
})
function remove(key) {
    var query = Object.assign({}, route.query)
    delete query[key]
    router.push({name: route.name, params: route.params, query: query})
}
</script>
<template>
<div style="margin:20px;"><span v-for="item in keywords" class="keyword-link" >
<span class="keyword-close" @click="remove(item[0])">&times;</span>
{{item[2]}}</span> </div>
</template>
<style scoped>
.keyword-link {
    position:relative;
    text-align: center;
    min-width: 20px;
    vertical-align: bottom;
    border-radius: 3px;
    background: var(--color-text);
    padding: 3px 25px 3px 5px;
    color: var(--color-background);
    margin: 3px;
    display: inline-block;
   
    box-sizing: content-box;
}
.keyword-link span.keyword-close {
    position:absolute;
    padding:1px 2px;
    margin-top:-3px;
    top:3px;
    right:1px;
    line-height:1;
    border: 1px dotted transparent;
    opacity:0.8;
    cursor:pointer;
}
.keyword-link span.keyword-close:hover {
    border-color: var(--color-text);
    opacity:1;
}
</style>