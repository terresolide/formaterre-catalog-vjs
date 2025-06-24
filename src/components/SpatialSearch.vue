<script setup>
import {ref, reactive, watch} from 'vue'
import {useRoute, useRouter} from 'vue-router'
const {lang,color,defaultBox} = defineProps({
    lang: {
        type:String,
        default: 'en'
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

const patternLatitude = "[-+]?(90|([1-8]?[0-9])([.][0-9]+)?)"
const patternLongitude = "[-+]?(180(\.0+)?|((1[0-7][0-9])|([1-9]?[0-9]))([.][0-9]+)?)"

const data = reactive({
    bbox: {west:'', east: '', south: '', north: ''}
})
const isDisable = computed(() => {return false})

function handleDraw () {
}
function handleReset () {
}
function validForm () {
    //  var inputs = this.$el.querySelectorAll('input')
    //  var valid = true
    //  inputs.forEach(function (input) {
    //    valid *= (input.validity.valid)
    //  })
    //  if (this.south === "" || this.north === "" || this.east === "" || this.west === "") {
    //    valid = false
    //  }
    //  return valid;
}
function validInput (e) {
 // if (e.which === 13) {        
 //   // @todo rendre + sexy le passage à l'autre input
 //   var index = parseInt(e.target.dataset.index)+ 1
 //   var next = this.$el.querySelector('input[data-index="' + index + '"]')
 //   if (next) {
 //     next.focus()
 //   }
 // }
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
</script>
<template>
<span class="formater-spatial-search" :class="{disable: isDisable}">
   <!--  <div class="box-toolbar" style="background: none;">
      <button class="spatial-edit-button" :title="$t('draw')" @click="handleDraw"><i class="fa fa-pencil-square-o"></i></button>
      <button class="spatial-reset-button" :title="$t('reset')" @click="handleResetLocal"><i class="fa fa-remove"></i></button>
     </div>
     -->
     <form name="formater-spatial-search" class="formater-spatial-search-content">
     {{bbox}}
   
          <div class="formater-input-group cardinal-center">
               <span class="right">N</span>
               <input  type="text" name="north" v-model="data.bbox.north" :pattern="patternLatitude"  :title="$t('titleLatitude')" @keydown="validInput" @change="handleChange" data-index="1" ></input>
          </div>
    
          <div class="formater-input-group cardinal-left">
               <span class="right">{{lang === 'en' ? 'W' : 'O'}}</span>
               <input  type="text" name="west" v-model="data.bbox.west" :pattern="patternLongitude"  :title="$t('titleLongitude')" @keydown="validInput" @change="handleChange" data-index="2" ></input>
          </div>
          <div class="formater-input-group cardinal-right">
               
               <input  type="text" name="east" v-model="data.bbox.east" :pattern="patternLongitude"  :title="$t('titleLongitude')" @keydown="validInput" @change="handleChange" data-index="3" >     </input>
               <span class="left">E</span>
          </div>
          
          <div class="formater-input-group cardinal-center">
               <span class="right">S</span>
               <input  type="text" name="south" v-model="data.bbox.south" :pattern="patternLatitude"  :title="$t('titleLatitude')" @keydown="validInput" @change="handleChange" data-index="4" ></input>
          </div>
        
     </form>

</span>
</template>

<style scoped>
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
