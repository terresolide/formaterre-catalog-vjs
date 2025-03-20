import { defineStore } from 'pinia'

export const useConfig = defineStore('config', () => {
  let state = {
      api: 'https://machin'
  }
  function init(conf) {
    state = Object.assign(state, conf)
  }

  return {state, init}
})
