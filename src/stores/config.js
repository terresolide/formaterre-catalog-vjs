import { defineStore } from 'pinia'

export const useConfig = defineStore('config', () => {
  let state = {
      geonetwork: 'https://catalogue-terresolide.ipgp.fr/geonetwork',
      primary:"#754a15",
      emphasis: "#dd9946",
      link: "#754a15",
      over: "#8c0209"

  }
  function init(conf) {
    state = Object.assign(state, conf)
  }

  return {state, init}
})
