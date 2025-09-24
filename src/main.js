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
import { library } from '@fortawesome/fontawesome-svg-core'

/* import font awesome icon component */
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
/* import specific icons */
import {faAsterisk,faBasketShopping, faCalendar,faCaretDown,faCaretLeft,faCaretRight,faCaretUp,faCheck, faCircleDot,
        faCircleInfo, faChevronCircleLeft, faChevronCircleRight,faClipboard,faClock,faClose,faDatabase,faDownload,faEarthAmericas,
        faFile, faFileLines, faFolderOpen,  faGaugeSimpleHigh, 
        faGraduationCap,faGrip, faKey, faLink, faLocationDot, faMagnifyingGlass,faMap,faPencil,
        faPenToSquare,faPrint,faRightFromBracket,faRightToBracket,faRocket,faSatelliteDish, faSearch, faSpinner,faTerminal, 
        faTriangleExclamation, faUser, faUsers} from '@fortawesome/free-solid-svg-icons'
import { setupI18n, loadLocaleMessages } from './i18n'
import moment from 'moment'
import fr from "moment/dist/locale/fr"
import {
   faSquare,
   faSquareCheck
} from '@fortawesome/free-regular-svg-icons'
library.add(faAsterisk,faBasketShopping, faCalendar,faCaretDown,faCaretLeft,faCaretRight,faCaretUp,faCheck,faCircleDot,
            faCircleInfo,faChevronCircleLeft, faChevronCircleRight,faClipboard,faClock,faClose,faDatabase,faDownload,faEarthAmericas, 
            faFile, faFileLines, faFolderOpen, faGaugeSimpleHigh,
            faGraduationCap, faGrip, faKey, faLink,faLocationDot, faMagnifyingGlass,faMap,faPencil,
            faPenToSquare,faPrint,faRightFromBracket, faRightToBracket,faRocket, faSatelliteDish, faSearch, faSpinner, faSquare, faSquareCheck, 
            faTerminal, faTriangleExclamation, faUser, faUsers)

let cfg = {}

if (typeof catalog != 'undefined') {
  cfg = JSON.parse(catalog.innerHTML)
} 

let locale = navigator.language.substr(0, 2)
if (!cfg.lang) {
  cfg.lang = locale === 'fr' ? 'fr' : 'en'
} 


moment.locale(cfg.lang)

console.log(cfg.lang)
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