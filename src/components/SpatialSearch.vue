<script setup>
import {computed, onMounted, reactive, ref, watch} from 'vue'
import {useRoute, useRouter} from 'vue-router'
const {lang,color,defaultBox} = defineProps({
    lang: {
        type:String,
        default: 'en'
    },
    primary: {
        type:String,
        default: '#dd9946'
    },
    color: {
        type:String,
        default: '#dd9946'
    },
    defaultBbox: {
        type: String,
        default: null
    }
})

const route = useRoute()
const router = useRouter()
const form = ref()

const data = reactive({
    bbox: {west:'', east: '', south: '', north: ''}
})
const isDisable = computed(() => {return false})


function createBbox() {
      if (parseFloat(data.bbox.west) > parseFloat(data.bbox.east)) {
          //set invalid
          return false
      }
      return [data.bbox.west, data.bbox.south, data.bbox.east, data.bbox.north].join(',')
    
}
function handleChange (e){
    
    var valid = validForm()
    if (!valid) {
        return
    }
    var bbox = createBbox()
    if (bbox) {
        var query = Object.assign({}, route.query)
        query.bbox = bbox
        router.push({name: route.name, params: route.params, query: query})
    }
   
    return;
}
function handleDraw () {
}
function handleReset () {
    var query = Object.assign({}, route.query)
    delete  query.bbox 
    router.push({name: route.name, params: route.params, query: query})
}
function validForm () {
    var inputs = form.value.querySelectorAll('input')
    var valid = true
    inputs.forEach(function (input) {
      valid *= (input.validity.valid)
    })
    if (data.bbox.south === "" || data.bbox.north === "" || data.bbox.east === "" || data.bbox.west === "") {
      valid = false
    }
    return valid;
}
function validInput (e) {
  if (e.which === 13) {        
    // @todo rendre + sexy le passage à l'autre input
    var index = parseInt(e.target.dataset.index)+ 1
    var next = form.value.querySelector('input[data-index="' + index + '"]')
    if (next) {
      next.focus()
    }
  }
}
function extractBbox (query) {
     if (query.bbox) {
           var points = query.bbox.split(',')
          // box.west + ',' + box.south + ',' + box.east + ',' + box.north
           data.bbox = {west: points[0], south: points[1], east: points[2], north: points[3]}
    } else {
        data.bbox = {west: '', south: '', east: '', north: ''}
    }
}
watch(
    () => route.query,
    (query) => {
       extractBbox(query)
})
onMounted(() => {
    extractBbox(route.query)
})
</script>
<template>
<span class="formater-spatial-search" :class="{disable: isDisable}">
  <div class="box-toolbar" style="background: none;">
      <!--   <button class="spatial-edit-button" :title="$t('draw')" @click="handleDraw"><i class="fa fa-pencil-square-o"></i></button>
     --> <button class="spatial-reset-button" :title="$t('reset')" :style="{background:primary}" @click="handleReset"><font-awesome-icon icon="fa-solid fa-close" /></button>
     </div>
     
     <form name="formater-spatial-search" ref="form" class="formater-spatial-search-content">
   
          <div class="formater-input-group cardinal-center" :style="{backgroundColor: color}">
               <span class="right">N</span>
               <input  type="text" name="north"  v-model="data.bbox.north"  :title="$t('titleLatitude')" pattern="[+\-]?(90|[0-8]?[0-9])(\.[0-9]+)?" @keydown="validInput" @change="handleChange" data-index="1" />
          </div>
    
          <div class="formater-input-group cardinal-left" :style="{backgroundColor: color}">
               <span class="right">{{lang === 'en' ? 'W' : 'O'}}</span>
               <input  type="text" name="west" v-model="data.bbox.west"   :title="$t('titleLongitude')" pattern="[+\-]?(180|([0-1]?[0-7][0-9](\.[0-9]+)?)|([0-9]{1,2}(\.[0-9]+)?))" 
               @keydown="validInput" @change="handleChange" data-index="2" />
          </div>
          <div class="formater-input-group cardinal-right" :style="{backgroundColor: color}">
               
               <input  type="text" name="east"  v-model="data.bbox.east"   :title="$t('titleLongitude')" pattern="[+\-]?(180|([0-1]?[0-7][0-9](\.[0-9]+)?)|([0-9]{1,2}(\.[0-9]+)?))" 
                @keydown="validInput" @change="handleChange" data-index="3" />
               <span class="left">E</span>
          </div>
          
          <div class="formater-input-group cardinal-center" :style="{backgroundColor: color}">
               <span class="right">S</span>
               <input  type="text" name="south"  v-model="data.bbox.south"   :title="$t('titleLatitude')" pattern="[+\-]?(90|[0-8]?[0-9])(\.[0-9]+)?"  @keydown="validInput" @change="handleChange" data-index="4" />
          </div>
        
     </form>

</span>
</template>

<style scoped>
.formater-search-box .box .formater-spatial-search{
    color: var(--vt-c-text-light-1);
}
.formater-spatial-search.disable{
  pointer-events: none;
  opacity: 0.8;
}
.formater-spatial-search .formater-input-group {
    border: none;
    display:inline-block;
     /* Default color from aeris */
    background-color: rgba(172,220,238,0.3); 
}

.formater-spatial-search .formater-input-group input {
     border: none;
     background-color: transparent;
     padding: 0 5px;
     outline: none;
}

input:invalid {
    color:red;
}
     
.formater-spatial-search .formater-input-group span:first-letter {
   text-transform: uppercase;
}
.formater-spatial-search .formater-input-group{
    display: flex;
    flex-flow: row nowrap;
    align-items: center;
    margin: 5px 0;
    width: 48%;
    height: 25px;
    line-height: 25px;
    overflow: hidden;
}
 .mtdt-form .formater-spatial-search .formater-input-group {
    width:48%;
    height:25px;
    margin: 5px auto;
}
 .mtdt-form .formater-spatial-search .formater-input-group input{
  min-width: 80px;
  max-width: 90px;
  text-align:center;
  padding: 0 3px;
  margin: 0 3px;
}
.formater-spatial-search .formater-input-group.cardinal-left{
   float:left;
}
.formater-spatial-search .formater-input-group.cardinal-right{
   float:right;
}
.formater-spatial-search .formater-input-group.cardinal-left input{
   text-align:left;
 }
.formater-spatial-search .formater-input-group.cardinal-right input{
   text-align:right;
   max-width: 70%;
   
 }
.formater-spatial-search .formater-input-group.cardinal-center{
   margin:auto;
   clear:both;
}
.formater-spatial-search .formater-input-group .right {
  min-width: 25px;
  border-right: 1px solid #fff;
  box-sizing: border-box;
  display: block;
  height: 100%;
  text-align: center;
}
.formater-spatial-search .formater-input-group .left {
  min-width: 25px;
  border-left: 1px solid #fff;
  box-sizing: border-box;
  display: block;
  height: 100%;
  text-align: center;
}
.formater-spatial-search .box-toolbar {
  text-align: right;
  display:block;
  margin: 0 0 10px 0;
}
.formater-spatial-search .box-toolbar button{
  margin-left: 3px;
  min-width: 38px;
  padding: 1px 6px;
}
</style>
