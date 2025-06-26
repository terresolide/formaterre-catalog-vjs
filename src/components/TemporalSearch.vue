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
  const data = reactive({
      start: null,
      end: null
  })
  function startChange(input) {
     data.start = dateToString(input)
     dateChange('start')
  }
  function endChange(input) {
     data.end = dateToString(input)
     dateChange('end')
  }
  function dateChange(key) {
      if (data.start && data.end && data.start >= data.end) {
         // error
         return 
     }
     var query = Object.assign({}, route.query)
     if (data[key]) {
         query[key] = data[key]
     } else {
         delete query[key]
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
  onMounted(() => {
      var query = route.query
      if (query.start) {
          data.start = query.start
          frome.value = new Date(query.start)
      }
      if (query.end) {
          data.end = query.end
          to.value = new Date(query.end)
      }
  })
</script>
<template>
 <div style="margin-left:10px;">
    <div>
        <label>{{$t('from')}} </label>
        <Datepicker v-model="frome" :locale="locale" :disable-time="true" inputFormat="dd/MM/yyyy"
        :clearable="true" :typeable="true" :upper-limit="now" @update:modelValue="startChange"/>
    </div>
    <div>
        <label>{{$t('to')}} </label>
        <Datepicker v-model="to" :locale="locale"  inputFormat="dd/MM/yyyy"
        :clearable="true" :typeable="true" :upper-limit="now" @update:modelValue="endChange"/>
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