import { defineStore } from 'pinia'
import {useConfig} from './config'

export const useCatalog = defineStore('catalog', {
  state: () => ({
    list: [],
    thesaurus: null,
    tilename: '',
    catalogs: null,
    groups: null,
    organismThesaurus: null,
    organisms: null,
    initialized: false,
    current: null
  }),
  actions: {
    async init () {
        if (!this.initialized) {
            const config = useConfig()
            var url = config.state.geonetwork + '/srv/api/groups?withReservedGroup=false'
            if (config.state.tools) {
                if (config.state.app) {
                    url = config.state.tools + '/api/tiles/' + config.state.app
                } else {
                    url = config.state.tools + '/api/groups'
                }
            }
            fetch(url, {headers: {'accept':'application/json', 'accept-language': config.state.lang}})
            .then(resp => resp.json())
            .then(json => {
                this.initialized = true
                if (json.tileThesaurus) {
                    this.list = json.tiles
                    this.tilename = json.tilename
                    this.thesaurus = json.tileThesaurus
                } else {
                    this.list = json
                    this.thesaurus = 'groupOwner'
                }
                if (json.datacenterThesaurus) {
                    this.organismThesaurus = json.datacenterThesaurus
                    var self = this
                    this.organisms = {}
                    json.datacenters.forEach(function (o) {
                         self.organisms[o.id] = o
                    })
                }
                if (this.tileThesaurus === 'groupOwner') {
                    this.groups = {}
                    var self = this
                    this.list.forEach(function (o) {
                         self.groups[o.id] = o
                    })
                } else {
                    this.getGroups()
                }
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
         const config = useConfig()
        var url = config.state.geonetwork + '/srv/api/groups?withReservedGroup=false'
        fetch(url, {headers: {'accept':'application/json'}})
        .then(resp => resp.json())
        .then(json => {
            console.log(json)
            this.groups = {}
            var self = this
             json.forEach(function (o) {
                 o.logo = config.state.geonetwork + '/images/harvesting/' + o.logo
                 self.groups[o.id] = o
            })
        })
        
    },
    getCatalogs () {
        var self = this
        if (!this.catalogs) {
            this.catalogs = {}
            this.list.forEach(function (o) {
                self.catalogs[o.id] = o
            })
        }
        return this.catalogs
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