import { defineStore } from 'pinia'

export const useSelection = defineStore('selection', {
  state: () => ({
    uuid: null,
    layers: [],
    download: null,
    charter: null,
    sso: null
  }),
  actions: {
    hasLayer(layer) {
      return this.layers.findIndex((l) => l.id === layer.id) >= 0
    },
    select (uuid) {
        this.uuid = uuid
    },
    setCharter (id) {
        this.charter = id
    },
    setSSO (sso) {
        this.sso = sso
    },
    toggle(uuid) {
      if (uuid === this.uuid) {
        this.uuid = null
      } else {
        this.uuid = uuid
      }
    },
    toggleLayer(layer) {
      var index = this.layers.findIndex((l) => l.id === layer.id)
      if (index >= 0) {
        // remove layer
        this.layers.splice(index, 1)
        this.uuid = null
        return false
      } else {
        this.layers.push(layer)
        this.uuid = layer.uuid
        return true
      }
    },
    setDownload(obj, token) {
        obj.token = token
        this.download = obj
    }
  },
})
