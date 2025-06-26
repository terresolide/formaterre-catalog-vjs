<script setup>
  import {computed, reactive, onMounted, ref} from 'vue'
  import {useRoute, useRouter} from 'vue-router'
  import Datepicker from 'vue3-datepicker'
  import { fr } from 'date-fns/locale'
  
  const props = defineProps({
      lang: {
          type: String,
          default: 'en'
      },
      color: {
          type: String,
          default: '#ffff00'
      }
  })
  
  const frome = ref(null)
  const to = ref(null)
  const route = useRoute()
  const router = useRouter()
  const now = new Date()
  const locale = computed(() => {
      if (props.lang === 'fr') {
          return fr
      }
      return null
  })
  function startChange(input) {
     data.start = dateToString(input)
     if (data.start && data.end && data.start >= data.end) {
         // error
         return 
     }
     var query = Object.assign({}, route.query)
     if (data.start) {
         query.start = data.start
     } else {
         delete query.start
     }
     router.push({name: route.name, params: route.params, query:query})
  }
  function dateToString ( date) {
      if (!date) {
          return null
      }
      const offset = date.getTimezoneOffset()
      date = new Date(date.getTime() - (offset*60*1000)); 
      return date.toISOString().split('T')[0]
  
  }
</script>
<template>
{{frome ? frome.toISOString() : '___'}}
{{to ? to.toISOString() : '____'}}
 <div style="margin-left:10px;">
    <div>
        <label>{{$t('from')}} </label>
        <Datepicker v-model="frome" :locale="locale" :disable-time="true" inputFormat="dd/MM/yyyy"
        :clearable="true" :typeable="true" :upper-limit="now" @update:modelValue="startChange"/>
    </div>
    <div>
        <label>{{$t('to')}} </label>
        <Datepicker v-model="to" :locale="locale"  
        :clearable="true" :typeable="true" :upper-limit="now"/>
    </div>
  </div>
</template>
<style>
.v3dp__datepicker {
    display:inline-block;
}
</style>
<style scoped>
label {
    display:inline-block;
    width:30px;
}
label:first-letter {
    text-transform:uppercase;
}
</style>