<script setup>
import CarrousselImages from '@/components/CarrousselImages.vue'
import RelatedLinks from '@/components/RelatedLinks.vue'
const {metadata} = defineProps({
    metadata: Object
})
</script>
<template>
    <div class="metadata-container">
        <div class="main-column">
            <div>status</div>
            
            <div v-html="metadata.description" />
        </div>
        <div class="right-side">
            <div style="margin-bottom:20px;">
               <carroussel-images :images="metadata.images" />
            </div>
        
            <div>
              <related-links :links="metadata.links" :uuid="metadata.uuid" mode="page"/> 
            </div>
        </div>
    </div>
</template>
<style scoped>
.right-side {

    margin-top: 10px;
    text-align:center;
    background: #eee;
}
@media (min-width: 1200px) {
    .metadata-container {
        display:grid;
        grid-template-columns: 3fr 1fr;
        grid-gap:10px;
    }
    .main-column {
        grid-column: 1/1;
    }
    .right-side {
        grid-column: 2/2;
    }
    
}

</style>