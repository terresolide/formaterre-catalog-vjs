import { defineStore } from 'pinia'
import {useConfig} from './config'

export const useCatalog = defineStore('catalog', {
  state: () => ({
    list: [],
    groups: null,
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
                this.getGroups()
            })
        }
    },
    setCatalog (name, reset) {      
        if (!name) {
           this.current = null
        } else {
           this.current = this.getCatalog(name)
        }
        return this.current
    },
    getCatalog (name) {
        if (!name) {
           return null
        }
        return this.list.find(c => c.name.toLowerCase() === name.toLowerCase())
    },
    getCatalogById (id) {
        if (!id) {
           return null
        }
        return this.list.find(c => parseInt(c.id) === parseInt(id))
    },
    getCurrent () {
      return this.current
    },
    getGroups () {
        var self = this
        if (!this.groups) {
            this.groups = {}
            this.list.forEach(function (o) {
                self.groups[o.id] = o
            })
        }
        return this.groups
    },
    getName () {
        if (this.current) {
            return this.current.name.toLowerCase()
        } else {
            return null
        }
    },
    setReset (reset) {
        this.reset = reset
    }
  }
})