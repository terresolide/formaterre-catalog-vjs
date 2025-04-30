import { defineStore } from 'pinia'
import data from '@/assets/dataCenter.json'

export const useConfig = defineStore('config', () => {
  let state = {
      geonetwork: 'https://catalogue-terresolide.ipgp.fr/geonetwork',
      primary:"#754a15",
      emphasis: "#dd9946",
      link: "#754a15",
      over: "#8c0209",
      lang: 'en',
      locale: 'eng',
      formatDate: '',
      size:24,
      sortBy: 'popularity'
  }
  let dataCenters = data
  function init(conf) {
    state = Object.assign(state, conf)
    state.locale = state.lang === 'fr' ? 'fre' : 'eng'
    // load dataCenter
    
  }
  function getProvider (url) {
      if (dataCenters[url]) {
          return dataCenters[url]
      }
      return null
  }
  function tr (obj) {
    if (!obj) {
        return ''
    }
    if (obj['lang' + state.locale]) {
      return obj['lang' + state.locale]
    }
    return obj.default
  }
  return {state, init, tr, getProvider}
})
