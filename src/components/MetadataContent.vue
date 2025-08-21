<script setup>
import CarrousselImages from '@/components/CarrousselImages.vue'
const {metadata} = defineProps({
    metadata: Object
})
</script>
<template>
    <div class="metadata-container">
        <div>
            <div>status</div>
            {{metadata}}
            <div v-html="metadata.description" />
        </div>
        <div>
           <carroussel-images :images="metadata.images" />
        <br>lien
        </div>
    </div>
</template>
<style scoped>
@media (min-width: 1200px) {
    .metadata-container {
        display:grid;
        grid-template-columns: 3fr 1fr;
        grid-gap:10px;
    }
}

</style>