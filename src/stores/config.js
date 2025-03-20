import { defineStore } from 'pinia'

export const useConfig = defineStore('config', () => {
  let configuration = {
      api: 'https://machin'
  }
  function init(conf) {
    configuration = Object.assign(configuration, conf)
  }

  return {configuration, init}
})
