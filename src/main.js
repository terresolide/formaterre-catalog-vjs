// for authentication
function extractInfoFromURL (url) {
     var split = url.split(/\&|\?|#/)
     var params = {}
     var authParams = {}
     split.forEach(function(tab) {
       var value = tab.split('=')
       if (value.length > 1) {
         if (['code', 'state', 'session_state', 'error'].indexOf(value[0]) >= 0) {
           authParams[value[0]] = value[1]
         } else {
           params[value[0]] = value[1]
         }
       }
     })
     return {base: split[0], params: params, authParams: authParams}
}
if (document.location.href.indexOf('/login') > 0 || document.location.href.indexOf('/logout') > 0 ) {
    var location = extractInfoFromURL(window.location.href)
    if (window.opener) {
     // case window
     window.opener.postMessage(
       {
         code:location.authParams['code'],
         state: location.authParams['state'],
         url: window.location.href
       },
       document.location.origin
     )
     window.close()
     // return
    } 
}
import './assets/main.css'

import { createApp } from 'vue'
import { createPinia, defineStore } from 'pinia'
import { FontAwesomeIcon } from '@/fontawesome'
import { setupI18n, loadLocaleMessages } from './i18n'
import moment from 'moment'
import fr from "moment/dist/locale/fr"


let cfg = {}

if (typeof catalog != 'undefined') {
  cfg = JSON.parse(catalog.innerHTML)
} 

let locale = navigator.language.substr(0, 2)
if (!cfg.lang) {
  cfg.lang = locale === 'fr' ? 'fr' : 'en'
} 


moment.locale(cfg.lang)
const i18n = setupI18n({locale: cfg.lang})
loadLocaleMessages(i18n, cfg.lang)
import App from './App.vue'
import router from './router'
import {useConfig} from '@/stores/config'
const app = createApp(App)
app.component('font-awesome-icon', FontAwesomeIcon)
app.use(createPinia())
app.use(router)
app.use(i18n)
app.provide('moment', moment)

const config = useConfig()
config.init(cfg)
app.mount('#app')
