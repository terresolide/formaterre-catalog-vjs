/**
 * contact is an array 
 * 0: role,
 * 1: resource or metadata
 * 2: organisation name
 * 3: individual name
 * 4: email address
 * 5: ?
 * 6: 
 * 7: postal address format with | separator
 * 8: organisation link identifier ror
 * 9: individu link identifier orcid
 */
 <script setup>
import {computed} from 'vue'
const {contact} = defineProps({
    contact: Array
})
const address = computed(() => {
    if (!contact[7]) {
        return []
    }
    return contact[7].split('|')
})
</script>
<template>
    <fieldset v-if="contact"  class="contact-flex">
      <div id="line"></div>
      <legend>{{$t(contact[0])}}</legend>
      <div class="contact-info" style="font-size:0.9rem;">
       <div v-if="contact[2]">
             <div >
                <span v-if="contact[8]">
                  <a :href="contact[8]" target="_blank">{{ contact[2]}}</a>
                </span>
                <span v-else>{{ contact[2]}}</span>
             </div> 
          <div v-for="item in address">
            {{item}}
          </div>
      </div>
        <div  v-if="contact[3] || contact[4]">
              <div v-if="contact[3]" >
                <span v-if="contact[9]">
                  <a :href="contact[9].substring(0,4) === 'http' ? contact[9] : 'https://orcid.org/' + contact[9]" target="_blank">{{contact[3]}}</a>
                </span>
                <span v-else>{{contact[3]}}</span>
              </div>
              <div v-if="contact[4]">{{contact[4]}}</div>
              </div>
        </div>
   </fieldset>
</template>
<style scoped>

fieldset {
  border:1px solid lightgrey;
  background: #f9f9f9;
  padding:2px 3px;
  height:100%;
}
legend {
  color: #333;
  font-weight:600;
  font-size:1rem;
  width:auto;
  border:none;
  margin: 0 2px 5px 2px;;
}
</style>