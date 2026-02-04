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
    contact: Object
})

</script>
<template>
    <fieldset v-if="contact"  class="contact-flex">
      <div id="line"></div>
      <legend>{{$t(contact.role)}}</legend>
      <div class="contact-info" style="font-size:0.9rem;">
       <div v-if="contact.organisation">
             <div >
                <span v-if="contact.ror">
                  <a :href="contact.ror" target="_blank">{{ contact.organisation}}</a>
                </span>
                <span v-else>{{ contact.organisation}}</span>
             </div> 
          <div v-for="item in contact.address">
            {{item}}
          </div>
      </div>
        <div  v-if="contact.individual || contact.email">
              <div v-if="contact.individual" >
                <span v-if="contact.orcid">
                  <a :href="contact.orcid.substring(0,4) === 'http' ? contact.orcid : 'https://orcid.org/' + contact.orcid" target="_blank">{{contact.individual}}</a>
                </span>
                <span v-else>{{contact.individual}}</span>
              </div>
              <div v-if="contact.email">{{contact.email}}</div>
              </div>
        </div>
   </fieldset>
</template>
<style scoped>

fieldset {
  border:1px solid var(--color-border);
  background: var(--color-background-mute);
  padding:2px 3px;
  height:100%;
}
legend {
  color: var(--color-heading);
  font-weight:600;
  font-size:1rem;
  width:auto;
  border:none;
  margin: 0 2px 5px 2px;;
}
</style>