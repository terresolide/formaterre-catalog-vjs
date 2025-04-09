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
       this.current = this.getCatalog(name)
    },
    getCatalog (name) {
        if (!name) {
           return null
        }
        return this.list.find(c => c.name.toLowerCase() === name.toLowerCase())
    },
    getCatalogById (id) {
        console.log(id)
        if (!id) {
           return null
        }
        return this.list.find(c => parseInt(c.id) === parseInt(id))
    },
    getCurrent () {
      return this.current
    }
  }
})