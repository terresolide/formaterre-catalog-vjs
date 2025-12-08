<script setup>
  import {computed, reactive, onMounted, ref, watch} from 'vue'
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
      },
      dayMin: {
          type: String,
          default: null
      },
      dayMax: {
          type: String,
          default: null
      }
  })
  
  const frome = ref(null)
  const to = ref(null)
  const route = useRoute()
  const router = useRouter()
  
  const upperLimit = computed(() => {
      if (props.dayMax) {
          return new Date(props.dayMax)
      }
      return new Date()
  })
  const lowerLimit = computed(() => {
      if (props.dayMin) {
          return new Date(props.dayMin)
      }
      return null
  })
  const now = new Date()
  const locale = computed(() => {
      if (props.lang === 'fr') {
          return fr
      }
      return null
  })
  const data = reactive({
      start: null,
      end: null,
      error: null
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
         data.error = true
         return 
     }
     data.error = false
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
  function initFromQuery(query) {
        if (query.start) {
            data.start = query.start
            frome.value = new Date(query.start)
        } else {
            frome.value = null
        }
        if (query.end) {
            data.end = query.end
            to.value = new Date(query.end)
        } else {
            to.value = null
        }
  }
  watch(() => route.query,
        (query) => {initFromQuery(query)})
  onMounted(() => {initFromQuery(route.query) })
</script>
<template>
 <div class="temporal-container">
    <div>
        <label :style="{backgroundColor:color}">{{$t('from')}} </label>
        <span class="datepicker-container" :class="{error: data.error}" :style="{backgroundColor:color}" >
            <Datepicker v-model="frome" :locale="locale" :lower-limit="lowerLimit" :upper-limit="upperLimit"
            :disable-time="true" inputFormat="dd/MM/yyyy"
            :clearable="true" :typeable="true" @update:modelValue="startChange"/>
        </span>
    </div>
    <div>
        <label :style="{backgroundColor:color}">{{$t('to')}} </label>
        <span class="datepicker-container" :class="{error: data.error}"  :style="{backgroundColor:color}">
            <Datepicker v-model="to" :locale="locale" :lower-limit="lowerLimit" :upper-limit="upperLimit"
            :disable-time="true" inputFormat="dd/MM/yyyy"
            :clearable="true" :typeable="true"  @update:modelValue="endChange"/>
        </span>
    </div>
    <div v-if="data.error" class="error">{{ $t('inconsistent_date')}}</div>
  </div>

</template>
<style>
.v3dp__datepicker {
    display:inline-block;
}
.v3dp__datepicker input[type="text"] {
    border: none;
  background-color: transparent;
  padding: 5px 10px;
  outline: none;
}
</style>
<style scoped>
.formater-search-box .box .temporal-container {
    color: var(--vt-c-text-light-1);
}
label {
    display:inline-block;
    width:45px;
    padding:2px 0 2px 3px;
    margin-right:2px;
}

label:first-letter {
    text-transform:uppercase;
}
.temporal-container {
    margin-left:10px;
   
}
.temporal-container > div{
    margin-top:5px;
}
span.datepicker-container {
    display:inline-block;
     min-width:202px;
}
span.datepicker-container.error {
    border: 1px solid darkred;
}
.error {
    color: darkred;
    text-align: left;
    }
</style>