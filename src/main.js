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
        faCircleInfo, faChevronCircleLeft, faChevronCircleRight,faClipboard,faClock,faClose,faCog, faCogs,faDatabase,faDownload,faEarthAmericas,
        faFile, faFileLines, faFolderOpen,  faGaugeSimpleHigh, 
        faGraduationCap,faGrip, faKey, faLink, faLocationDot, faMagnifyingGlass,faMap,faObjectGroup, faPencil,
        faPenToSquare,faPrint,faRightFromBracket,faRightToBracket,faRocket,faSatelliteDish, faSearch, faSpinner,faTerminal, 
        faTriangleExclamation, faUser, faUserGroup, faUsers,
faAdjust, faArchive, faArchway, faAtlas, faAtom, faBacteria, faBacterium, faBahai,
faBalanceScaleLeft, faBalanceScaleRight, faBarsProgress, faBatteryHalf, faBatteryQuarter, faBicycle,
faBiking, faBinoculars, faBoltLightning, faBomb, faBookmark, faBoxOpen, faBoxesAlt, faBridge,
faBridgeWater, faBugs, faBullseye, faBurn, faCab, faCalendarDays, faCamera, faCameraRetro,
faCapsules, faCertificate, faChartBar, faChartDiagram, faCircleRadiation, faCity, faClipboardList,
faCloudMoonRain, faCloudShowersHeavy, faCloudShowersWater, faCloudSun, faCloudSunRain, faCode,
faCompactDisc, faCompass, faCookie, faCube, faCubes, faCubesStacked, faDiagramProject,
faDraftingCompass, faDungeon, faEarthAfrica, faEarthAsia, faEarthEurope, faEarthOceania,
faExplosion, faEyeDropper, faFan, faFaucetDrip, faFeatherAlt, faFlask, faFolder, faGauge,
faGaugeHigh, faGaugeSimple, faHardDrive, faHeadphones, faHeadphonesSimple, faHeadset, faHelicopter,
faHillRockslide, faHome, faHomeLg, faHotel, faHourglassEnd, faHouse, faHouseTsunami, faHurricane,
faIcicles, faImage, faIndustry, faLandMineOn, faLandmark, faLandmarkFlag, faLayerGroup, faLeaf,
faLegal, faLineChart, faLocation, faLocationArrow, faMagnet, faMapMarked, faMapMarker, faMicrophone,
faMicroscope, faMotorcycle, faMountain, faMountainSun, faMouse, faNavicon, faPaperPlane,
faPaperclip, faPenAlt, faPenRuler, faPeopleGroup, faPeopleLine, faPeopleRoof, faPerson, faPhoneAlt,
faPhotoFilm, faPieChart, faPlane, faPlaneUp, faPlug, faPodcast, faRadiation, faRadio, faRainbow,
faRibbon, faRoad, faRoute, faRulerHorizontal, faRunning, faSatellite, faScaleBalanced, faSchool,
faServer, faShapes, faShareNodes, faShop, faSignsPost, faSitemap, faSliders, faSmog, faSnowflake,
faSpaceShuttle, faSplotch, faStar, faStopwatch, faStroopwafel, faSubway, faSunPlantWilt, faTable,
faTachometerFast, faTag, faTape, faTemperatureQuarter, faThermometerHalf, faThumbtack,
faTicketSimple, faTools, faTornado, faTowerBroadcast, faTowerCell, faTram, faTrashCan, faTruckFront,
faTv, faUmbrella, faUniversity, faUserTag, faVial, faVideo, faVirus, faViruses, faVolcano,
faVolumeOff, faWeight, faWifi, faWind, faWrench} from '@fortawesome/free-solid-svg-icons'
import { setupI18n, loadLocaleMessages } from './i18n'
import moment from 'moment'
import fr from "moment/dist/locale/fr"
import {
   faSquare,
   faSquareCheck
} from '@fortawesome/free-regular-svg-icons'
library.add(faAsterisk,faBasketShopping, faCalendar,faCaretDown,faCaretLeft,faCaretRight,faCaretUp,faCheck,faCircleDot,
            faCircleInfo,faChevronCircleLeft, faChevronCircleRight,faClipboard,faClock,faClose,faCog, faCogs,faDatabase,faDownload,faEarthAmericas, 
            faFile, faFileLines, faFolderOpen, faGaugeSimpleHigh, 
            faGraduationCap, faGrip, faKey, faLink,faLocationDot, faMagnifyingGlass,faMap,faObjectGroup,faPencil,
            faPenToSquare,faPrint,faRightFromBracket, faRightToBracket,faRocket, faSatelliteDish, faSearch, faSpinner, faSquare, faSquareCheck, 
            faTerminal, faTriangleExclamation, faUser, faUserGroup,faUsers,
          faAdjust, faArchive, faArchway, faAtlas, faAtom, faBacteria, faBacterium, faBahai,
faBalanceScaleLeft, faBalanceScaleRight, faBarsProgress, faBatteryHalf, faBatteryQuarter, faBicycle,
faBiking, faBinoculars, faBoltLightning, faBomb, faBookmark, faBoxOpen, faBoxesAlt, faBridge,
faBridgeWater, faBugs, faBullseye, faBurn, faCab, faCalendarDays, faCamera, faCameraRetro,
faCapsules, faCertificate, faChartBar, faChartDiagram, faCircleRadiation, faCity, faClipboardList,
faCloudMoonRain, faCloudShowersHeavy, faCloudShowersWater, faCloudSun, faCloudSunRain, faCode,
faCompactDisc, faCompass, faCookie, faCube, faCubes, faCubesStacked, faDiagramProject,
faDraftingCompass, faDungeon, faEarthAfrica, faEarthAsia, faEarthEurope, faEarthOceania,
faExplosion, faEyeDropper, faFan, faFaucetDrip, faFeatherAlt, faFlask, faFolder, faGauge,
faGaugeHigh, faGaugeSimple, faHardDrive, faHeadphones, faHeadphonesSimple, faHeadset, faHelicopter,
faHillRockslide, faHome, faHomeLg, faHotel, faHourglassEnd, faHouse, faHouseTsunami, faHurricane,
faIcicles, faImage, faIndustry, faLandMineOn, faLandmark, faLandmarkFlag, faLayerGroup, faLeaf,
faLegal, faLineChart, faLocation, faLocationArrow, faMagnet, faMapMarked, faMapMarker, faMicrophone,
faMicroscope, faMotorcycle, faMountain, faMountainSun, faMouse, faNavicon, faPaperPlane,
faPaperclip, faPenAlt, faPenRuler, faPeopleGroup, faPeopleLine, faPeopleRoof, faPerson, faPhoneAlt,
faPhotoFilm, faPieChart, faPlane, faPlaneUp, faPlug, faPodcast, faRadiation, faRadio, faRainbow,
faRibbon, faRoad, faRoute, faRulerHorizontal, faRunning, faSatellite, faScaleBalanced, faSchool,
faServer, faShapes, faShareNodes, faShop, faSignsPost, faSitemap, faSliders, faSmog, faSnowflake,
faSpaceShuttle, faSplotch, faStar, faStopwatch, faStroopwafel, faSubway, faSunPlantWilt, faTable,
faTachometerFast, faTag, faTape, faTemperatureQuarter, faThermometerHalf, faThumbtack,
faTicketSimple, faTools, faTornado, faTowerBroadcast, faTowerCell, faTram, faTrashCan, faTruckFront,
faTv, faUmbrella, faUniversity, faUserTag, faVial, faVideo, faVirus, faViruses, faVolcano,
faVolumeOff, faWeight, faWifi, faWind, faWrench)

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
