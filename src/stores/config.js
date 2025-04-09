import { defineStore } from 'pinia'

export const useConfig = defineStore('config', () => {
  let state = {
      geonetwork: 'https://catalogue-terresolide.ipgp.fr/geonetwork',
      primary:"#754a15",
      emphasis: "#dd9946",
      link: "#754a15",
      over: "#8c0209",
      lang: 'en',
      locale: 'eng',
      formatDate: ''

  }
  function init(conf) {
    state = Object.assign(state, conf)
    state.locale = state.lang === 'fr' ? 'fre' : 'eng'
    console.log(state.locale)
  }
  function tr (obj) {
    if (obj['lang' + state.locale]) {
      return obj['lang' + state.locale]
    }
    return obj.default
  }
  return {state, init, tr}
})
