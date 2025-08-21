<script setup>
const {metadata} = defineProps({
    metadata: Object
})
</script>
<template>
    <div class="metadata-container">
        <div>{{metadata}}</div>
        <div>image
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