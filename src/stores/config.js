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
      formatDate: '',
      size:24,
      sortBy: 'popularity',
      profile: false
  }

  function init(conf) {
    state = Object.assign(state, conf)
    state.locale = state.lang === 'fr' ? 'fre' : 'eng'
    state.lightcolor = shadeColor(state.emphasis, 0.8)
  }
  function shadeColor(color, percent) {
    var f=parseInt(color.slice(1),16),t=percent<0?0:255,p=percent<0?percent*-1:percent,R=f>>16,G=f>>8&0x00FF,B=f&0x0000FF;
    // return "red";
    return "#"+(0x1000000+(Math.round((t-R)*p)+R)*0x10000+(Math.round((t-G)*p)+G)*0x100+(Math.round((t-B)*p)+B)).toString(16).slice(1);
  }
  
  function tr (obj) {
    if (!obj) {
        return ''
    }
    if (obj['lang' + state.locale] && obj['lang' + state.locale]!== 'undefined') {
      return obj['lang' + state.locale]
    }
    return obj.default
  }
  return {state, init, tr}
})
