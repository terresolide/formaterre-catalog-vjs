<script setup>
import {inject} from 'vue'
import {useConfig} from '@/stores/config.js'
import CarrousselImages from '@/components/CarrousselImages.vue'
import RelatedLinks from '@/components/RelatedLinks.vue'
import TemporalExtent from '@/components/TemporalExtent.vue'
import ContactBox from '@/components/ContactBox.vue'
import KeywordList from '@/components/KeywordList.vue'
import StacParameters from '@/components/StacParameters.vue'

const moment = inject('moment')
const {metadata, access} = defineProps({
    metadata: Object,
    access: Object
})
const config = useConfig()
</script>
<template>
    <div class="metadata-container">
        <div class="main-column">

            <div class="description" v-if="metadata.description" v-html="metadata.description" />
            <dl>
               <dt :style="{color: config.state.primary}">{{$t('identifier')}}</dt>
               <dd>{{metadata.identifier}}</dd>
            </dl>
            <dl>
               <dt :style="{color: config.state.primary}">{{$t('status')}}</dt>
               <dd>{{metadata.status}}</dd>
            </dl>
            <dl>
                <dt :style="{color: config.state.primary}">{{$t('resource_date')}}</dt>
                <dd v-for="extent in metadata.temporalExtents" >
                  <temporal-extent :extent="extent"></temporal-extent>
                </dd>
                <template v-for="key in ['creation','revision', 'publication', 'processing']" >
                   <dd v-if="metadata[key + 'Date']">{{moment(metadata[key + 'Date']).format('ll')}} ({{key}})</dd>
                </template>
            </dl>
            <dl v-if="metadata.fromStac">
               <dt :style="{color: config.state.primary}">{{$t('parameters')}}</dt>
               <dd><stac-parameters :metadata="metadata" /> </dd>
            </dl>
            <dl>
                <dt :style="{color: config.state.primary}">Contact(s)</dt>
                <template v-for="list, key in metadata.contacts.resource">
                   <dd>
                      <div class="contact-container">
                        <template v-for="item in list">
                           <contact-box :contact="item" />
                        </template>
                      </div>
                    </dd>
                </template>
            </dl>
            <dl>
                <dt :style="{color: config.state.primary}">{{$t('lineage')}}</dt>
                <dd>
                <template v-for="item in metadata.lineage">
                  <dd v-html="item"></dd>
                </template>
                </dd>
            </dl>
            <dl>
                <dt :style="{color: config.state.primary}">{{$t('constraints')}}</dt>
                <template v-for="item in metadata.legalConstraints">
                  <dd v-html="item"></dd>
                </template>
                <template v-for="item in metadata.constraints">
                  <dd v-html="item"></dd>
                </template>
            </dl> 
            <dl>
                <dt :style="{color: config.state.primary}">{{$t('geographic_information')}}</dt>
                <dd>
                  {{$t('resource_type')}}: {{metadata.representation}}
                <br>
                <template v-if="metadata.resolution">
                      {{$t('resolution')}}: 
                      <template v-if="metadata.resolution.length === 1">
                       {{metadata.resolution[0]}}
                       </template>
                       <template v-else-if="metadata.resolution.length > 0">
                           <ul>
                             <li v-for="item in metadata.resolution">{{item}}</li>
                           </ul>
                        </template>
                </template>
                <br>
                   {{$t('ref_system')}}: 
                   <template v-if="metadata.crs.length === 1">
                   {{metadata.crs[0]}}
                   </template>
                   <template v-else-if="metadata.crs.length > 0">
                       <ul>
                         <li v-for="item in metadata.crs">{{item}}</li>
                       </ul>
                    </template>
                </dd>
            </dl>
            <dl>
                <dt :style="{color: config.state.primary}">Format(s)</dt>
                <template v-for="item in metadata.format">
                  <dd>{{item}}</dd>
                </template>
             
            </dl>
             
            <div class="metadata-section">
              <hr>
            <h2 :style="{color: config.state.primary}">{{$t('about_metadata')}}</h2>
                <dl>
                    <dt :style="{color: config.state.primary}">{{$t('identifier')}}</dt>
                    <dd> {{metadata.uuid}}</dd>
                </dl>
                <dl>
                    <dt :style="{color: config.state.primary}">{{$t('update')}}</dt>
                    <dd>{{moment(metadata.dateStamp).format('ll')}}</dd>
                </dl>
               <dl>
                <dt :style="{color: config.state.primary}">Contact(s)</dt>
                <template v-for="list, key in metadata.contacts.metadata">
                   <dd>
                      <div class="contact-container">
                        <template v-for="item in list">
                           <contact-box :contact="item" />
                        </template>
                      </div>
                    </dd>
                </template>
            </dl>
            </div>
        </div>
        <div class="right-side">
            <div style="margin-bottom:20px;">
               <carroussel-images :images="metadata.images" />
            </div>
        
            <div>
                <related-links :links="metadata.links" :uuid="metadata.uuid" :access="access" mode="page"/> 
            
            </div>
            <div>
                <div class="mtdt-related-type" :title="$t('keywords')" style="{backgroundColor: config.state.primary}">
                    <font-awesome-icon icon="fa-solid fa-key" />
                </div>
                <div class="mtdt-expand">
                <template v-for="list in metadata.keyword">
                    <keyword-list :keywords="list" />
                </template>
                </div>
            </div>
         
        </div>
    </div>
</template>
<style scoped>
.metadata-container {
    max-height:calc(100vh - 210px);
    overflow-x: scroll;
}
.metadata-section > div {
    text-align:left;
}
.metadata-section hr {
    width:90px;
    margin: 20px auto;
}
.right-side {

    margin-top: 4px;
    padding: 5px 10px;
    text-align:center;
    background: #eee;
}
.description {
    background: #eee;
    margin: 5px 0;
    padding:5px 10px;
    border: 1px solid grey;
    border-radius: 2px;
}
dl {
  display: grid;
  grid-template-columns: 120px auto;
}

dt {
  grid-column: 1;
}

dd {
  grid-column: 2;
  margin-bottom: 6px;
  line-height: 1.2;
}
div.contact-container {
  display: -webkit-box;
  display: -ms-flexbox;
    display: flex;
  -webkit-box-orient: horizontal;
  -webkit-box-direction: normal;
  -ms-flex-flow: row wrap;
  flex-flow: row wrap;
  /*-webkit-box-pack: justify;
  -ms-flex-pack: justify;
  justify-content: space-between;*/
    margin:auto;
   /* max-width:1200px;*/
   /* margin-left: calc(50% - 45vw);
  margin-right: calc(50% - 45vw);*/
  
  -webkit-box-pack: space-evenly;
  -ms-flex-pack: space-evenly;
  justify-content: space-evenly;
   max-width:1200px;
  }
  

 .contact-flex {
      position:relative;
      display:block;
      width: auto;
      -webkit-box-flex: 1;
      -ms-flex: 1 1 200px;
      flex: 1 1 200px;
      
       padding: 5px;
      margin: 0 4px;
     /* -webkit-box-shadow: 0 0px 3px rgba(0,0,0,0.5);
      box-shadow: 0 0px 3px rgba(0,0,0,0.5);*/
      position: relative;
      background: #f9f9f9;

  }
  field.contact-flex > div:first-child {
      position:relative;
      overflow: hidden;
      /*padding: 20px;
      /*margin: 0 10px 20px;
      box-shadow: 0 0px 3px rgba(0,0,0,0.5);*/
  }
@media (min-width: 1200px) {
    .metadata-container {
        display:grid;
        grid-template-columns: 3fr 1fr;
        grid-gap:10px;
    }
    .main-column {
        grid-column: 1/1;
    }
    .right-side {
        grid-column: 2/2;
    }
    dl {
        grid-template-columns: 200px auto;
    }
    
}
div.mtdt-expand {
    text-align:center;
    
}
</style>