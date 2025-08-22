<script setup>
import CarrousselImages from '@/components/CarrousselImages.vue'
import RelatedLinks from '@/components/RelatedLinks.vue'
const {metadata} = defineProps({
    metadata: Object
})
</script>
<template>
{{metadata.links}}
    <div class="metadata-container">
        <div>
            <div>status</div>
            {{metadata}}
            <div v-html="metadata.description" />
        </div>
        <div class="right-side">
            <div>
               <carroussel-images :images="metadata.images" />
            </div>
            <div>
              <related-links :links="metadata.links" :uuid="metadata.uuid" /> 
            </div>
        </div>
    </div>
</template>
<style scoped>
.right-side {
    margin-top: 10px;
    text-align:center;
}
@media (min-width: 1200px) {
    .metadata-container {
        display:grid;
        grid-template-columns: 3fr 1fr;
        grid-gap:10px;
    }
}

</style>