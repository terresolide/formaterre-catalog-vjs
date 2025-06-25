import { defineStore } from 'pinia'

export const useSelection = defineStore('selection', {
  state: () => ({
    uuid: null,
    layers: [],
    download: null
  }),
  actions: {
    hasLayer(layer) {
      return this.layers.findIndex((l) => l.id === layer.id) >= 0
    },
    select (uuid) {
        this.uuid = uuid
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
    setDownload(obj) {
        this.download = obj
    }
  },
})
