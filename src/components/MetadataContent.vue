<script setup>
import {inject} from 'vue'
import {useConfig} from '@/stores/config.js'
import {RouterLink} from 'vue-router'
import CarrousselImages from '@/components/CarrousselImages.vue'
import RelatedLinks from '@/components/RelatedLinks.vue'
import TemporalExtent from '@/components/TemporalExtent.vue'
import ContactBox from '@/components/ContactBox.vue'
import KeywordList from '@/components/KeywordList.vue'
import StacParameters from '@/components/StacParameters.vue'

const moment = inject('moment')
const {metadata, access, ssoId} = defineProps({
    metadata: Object,
    access: Object,
    ssoId: String
})
const config = useConfig()
</script>
<template>
    <div class="metadata-container">
        <div class="main-column">
            <div class="description" v-if="metadata.description" v-html="metadata.description" />
            <dl>
               <dt >{{$t('identifier')}}</dt>
               <dd>{{metadata.identifier}}</dd>
            </dl>
            <dl>
               <dt >{{$t('status')}}</dt>
               <dd>{{metadata.status}}</dd>
            </dl>
            <dl>
                <dt >{{$t('resource_date')}}</dt>
                <dd v-for="extent in metadata.temporalExtents" >
                  <temporal-extent :extent="extent"></temporal-extent>
                </dd>
                <template v-for="key in ['creation','revision', 'publication', 'processing']" >
                   <dd v-if="metadata[key + 'Date']">{{moment(metadata[key + 'Date']).format('ll')}} ({{key}})</dd>
                </template>
            </dl>
            <dl v-if="metadata.fromStac">
               <dt >{{$t('parameters')}}</dt>
               <dd><stac-parameters :metadata="metadata" /> </dd>
            </dl>
            <dl :class="{parent:!metadata.contacts && metadata.parent && metadata.parent.contacts}">
              <template v-if="metadata.contacts">
                <dt >Contact(s) </dt>
                <template v-for="list, key in metadata.contacts.resource">
                   <dd>
                      <div class="contact-container">
                        <template v-for="item in list">
                           <contact-box :contact="item" />
                        </template>
                      </div>
                    </dd>
                </template>
              </template>
              <template v-else-if="metadata.parent && metadata.parent.contacts.resource">
                 <dt >Contact(s) *</dt>
                 <template v-for="list, key in metadata.parent.contacts.resource">
                   <dd>
                      <div class="contact-container">
                        <template v-for="item in list">
                           <contact-box :contact="item" />
                        </template>
                      </div>
                    </dd>
                </template>
              </template>
            </dl>
            <dl :class="{parent: !metadata.lineage && metadata.parent && metadata.parent.lineage}">
                <dt >{{$t('lineage')}}
                  <template v-if="!metadata.lineage && metadata.parent && metadata.parent.lineage">*</template>
                </dt>
                <dd>
                <template v-if="metadata.lineage">
                    <template v-for="item in metadata.lineage">
                      <dd v-html="item"></dd>
                    </template>
                </template>
                <template v-else-if="metadata.parent && metadata.parent.lineage">
                  <template v-for="item in metadata.parent.lineage">
                      <dd v-html="item"></dd>
                    </template>
                </template>
                </dd>
            </dl>
            <dl :class="{parent: !metadata.legalConstraints && metadata.parent && metadata.parent.legalConstraints}">
                <dt >{{$t('constraints')}}
                   <template v-if="!metadata.legalConstraints && metadata.parent && metadata.parent.legalConstraints">*</template>
                </dt>
                <template v-if="metadata.legalConstraints">
                    <template v-for="item in metadata.legalConstraints">
                      <dd v-html="item"></dd>
                    </template>
                </template>
                <template v-else-if="metadata.parent && metadata.parent.legalConstraints">
                    <template v-for="item in metadata.parent.legalConstraints">
                      <dd v-html="item"></dd>
                    </template>
                </template>
                <template v-if="metadata.constraints">
                    <template v-for="item in metadata.constraints">
                      <dd v-html="item"></dd>
                    </template>
                </template>
                <template v-else-if="metadata.parent && metadata.parent.constraints">
                    <template v-for="item in metadata.parent.constraints">
                      <dd v-html="item"></dd>
                    </template>
                </template>
            </dl> 
            <dl>
                <dt >{{$t('geographic_information')}}</dt>
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
                   
                   <template v-if="metadata.crs">
                   {{$t('ref_system')}}: 
                       <template v-if="metadata.crs.length === 1">
                       {{metadata.crs[0]}}
                       </template>
                       <template v-else-if="metadata.crs.length > 0">
                           <ul>
                             <li v-for="item in metadata.crs">{{item}}</li>
                           </ul>
                        </template>
                    </template>
                    <template v-else-if="metadata.parent && metadata.parent.crs">
                        <span class="parent">{{$t('ref_system')}} *:
                            <template v-if="metadata.parent.crs.length === 1">
                               {{metadata.parent.crs[0]}}
                            </template>
                            <template v-else-if="metadata.parent.crs.length > 0">
                                <ul>
                                    <li v-for="item in metadata.parent.crs">{{item}}</li>
                                </ul>
                            </template>
                        </span>
                    </template>
                </dd>
            </dl>
            <dl>
                <dt>Format(s)</dt>
                <template v-for="item in metadata.format">
                  <dd>{{item}}</dd>
                </template>
             
            </dl>
            <template v-if="metadata.parent">
                <dl>
                    <dt></dt>
                    <dd>
                    <em>* parent information</em>
                    </dd>
                </dl>
            </template>
            <div class="metadata-section">
              <hr>
            <h2 >{{$t('about_metadata')}}</h2>
                <dl>
                    <dt>{{$t('identifier')}}</dt>
                    <dd> {{metadata.uuid}}</dd>
                </dl>
                <template v-if="metadata.parentIdentifier">
                    <dl>
                       <dt>Parent</dt>
                       <dd><router-link :to="{name:'metadata', params:{id: metadata.parentIdentifier}}">{{metadata.parentIdentifier}}</router-link></dd>
                    </dl>
                </template>
                <dl>
                    <dt>{{$t('update')}}</dt>
                    <dd>{{moment(metadata.dateStamp).format('ll')}}</dd>
                </dl>
               <dl>
                <template v-if="metadata.contacts">
                    <dt>Contact(s)</dt>
                    
                    <template v-for="list, key in metadata.contacts.metadata">
                       <dd>
                          <div class="contact-container">
                            <template v-for="item in list">
                               <contact-box :contact="item" />
                            </template>
                          </div>
                        </dd>
                    </template>
                </template>
                <template v-else-if="metadata.parent && metadata.parent.contacts">
                    <dt class="parent">Contact(s) *</dt>
                    
                    <template v-for="list, key in metadata.parent.contacts.metadata">
                       <dd class="parent">
                          <div class="contact-container">
                            <template v-for="item in list">
                               <contact-box :contact="item" />
                            </template>
                          </div>
                        </dd>
                    </template>
                </template>
            </dl>
            </div>
        </div>
        <div class="right-side">
            <div style="margin-bottom:20px;">
               <carroussel-images :images="metadata.images" />
            </div>
        
            <div>
                <related-links :links="metadata.links" :uuid="metadata.uuid" :group="metadata.group" :sso-id="ssoId" :access="access" mode="page"/> 
            
            </div>
            <div>
                <div class="mtdt-related-type" :title="$t('keywords')" style="{backgroundColor: config.state.primary}">
                    <font-awesome-icon icon="fa-solid fa-key" />
                </div>
                <div class="mtdt-expand">
                <template v-if="metadata.keyword && metadata.keyword.length > 0">
                    <template v-for="list in metadata.keyword">
                        <keyword-list :keywords="list" />
                    </template>
                </template>
                <template v-else-if="metadata.parent && metadata.parent.keyword">
                    <template v-for="list in metadata.parent.keyword">
                        <keyword-list :keywords="list" :parent="true"/>
                    </template>
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
.metadata-container .parent {
    font-style:italic;
    opacity:0.8;
}
.metadata-container h2{
    color: var(--color-text-primary);
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
    background: var(--color-background-mute);
}
.description {
    background:var(--color-background-mute);
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
  color:var(--color-text-primary);
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
      background: var(--color-background-mute);

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
        grid-template-columns: 70% 30%;
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