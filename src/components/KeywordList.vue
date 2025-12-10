<script setup>
import {useRouter} from 'vue-router'
const {keywords} = defineProps({
    keywords: Object
})
const router = useRouter()
function goTo (kwd) {
     var query = {}
     console.log(keywords.key)
     if (keywords.key) {
        console.log('ici')
         query[keywords.key]= kwd.link + ',' + kwd.name
         
     } else {
        query.any = kwd.name
     }
    router.push({name: 'grid', query: query })
}
</script>
<template>
 <div>
 <span v-for="kwd in keywords.keywords" class="keyword-link" @click="goTo(kwd)">{{kwd.name}}</span> 
 </div> 
</template>
<style scoped>
.keyword-link {
    text-align: center;
    min-width: 20px;
    vertical-align: bottom;
    border-radius: 3px;
    background: var(--color-text);
    padding: 3px 5px;
    color: var(--color-background);
    margin: 3px;
    display: inline-block;
    cursor:pointer;
    box-sizing: content-box;
    opacity:0.9;
}
.keyword-link:hover {
    opacity:1;
}
</style>