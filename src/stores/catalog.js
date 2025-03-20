import { defineStore } from 'pinia'
import {useConfig} from './config'

export const useCatalog = defineStore('catalog', {
  state: () => ({
    list: [],
    initialized: false
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
    }
  }
})