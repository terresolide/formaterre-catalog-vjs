import './assets/main.css'

import { createApp } from 'vue'
import { createPinia, defineStore } from 'pinia'
import { library } from '@fortawesome/fontawesome-svg-core'

/* import font awesome icon component */
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
/* import specific icons */
import {faAsterisk,faCalendar,faCaretDown,faCaretRight, faCircleDot,faClipboard,faClose,faDatabase,faDownload,faEarthAmericas, faFile, faFolderOpen,  faGaugeSimpleHigh, 
        faGraduationCap,faGrip, faLink,faLocationDot, faMagnifyingGlass,faMap, 
        faPenToSquare,faRocket,faSatelliteDish, faSearch, faTerminal, faUser, faUsers} from '@fortawesome/free-solid-svg-icons'
import { setupI18n, loadLocaleMessages } from './i18n'
import moment from 'moment'
import fr from "moment/dist/locale/fr"
import {
   faSquare,
   faSquareCheck
} from '@fortawesome/free-regular-svg-icons'
library.add(faAsterisk,faCalendar,faCaretDown,faCaretRight, faCircleDot,faClipboard,faClose,faDatabase,faDownload,faEarthAmericas, faFile, faFolderOpen, faGaugeSimpleHigh,
            faGraduationCap, faGrip, faLink,faLocationDot, faMagnifyingGlass,faMap,
            faPenToSquare,faRocket, faSatelliteDish, faSearch, faSquare, faSquareCheck, faTerminal, faUser, faUsers)

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