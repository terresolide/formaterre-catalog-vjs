<script setup>
  import { useRoute} from "vue-router"
  import CharterPage from '@/components/CharterPage.vue' 
  const route = useRoute()
  
</script>

<template>
  <main>
  <template v-if="route.params.id">
    <charter-page :id="parseInt(route.params.id)" />
    </template>
  </main>
</template>

<style scoped>
main {
    max-width: 1200px;
    min-height: 100vh;
    margin: auto;
}

</style>
