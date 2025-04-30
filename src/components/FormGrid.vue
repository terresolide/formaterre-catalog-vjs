<script setup>
  import { reactive, watch, onMounted } from 'vue'; 
  import { useRoute } from "vue-router"
 
  function getRecords (query) {
    elasticsearch.getRecords(query)
    .then(json => {
      data.aggregations = json.aggregations
      if (json.hits && json.hits.hits) {
        data.list = json.hits.hits
        data.pagination.count = json.hits.hits.length
        data.pagination.total = json.hits.total.value
        data.pagination.relation = json.hits.total.relation
      }
    })
  }
</script>

<template>
  <sidebar>
   ICI LE FORMULAIRE DE RECHERCHE

  </sidebar>
</template>
