import { defineStore } from 'pinia'
import {useConfig} from './config'

export const useCatalog = defineStore('catalog', {
  state: () => ({
    list: [],
    initialized: false,
    current: null
  }),
  actions: {
    async init () {
        if (!this.initialized) {
            const config = useConfig()
            fetch(config.state.geonetwork + '/srv/api/groups?withReservedGroup=false', {headers: {'accept':'application/json'}})
            .then(resp => resp.json())
            .then(json => {
                this.initialized = true
                this.list = json
            })
        }
    },
    setCatalog (name) {
        console.log(name)
        if (!name) {
           this.current = null
           return null
        }
        this.current = this.list.find(c => c.name.toLowerCase() === name.toLowerCase())
        return this.current
    },
    getCatalog () {
      return this.current
    }
  }
})