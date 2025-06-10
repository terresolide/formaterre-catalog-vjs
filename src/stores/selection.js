import { defineStore } from 'pinia'

export const useSelection = defineStore('selection', {
  state: () => ({
    uuid: null,
    layers: [],
  }),
  actions: {
    hasLayer(layer) {
      return this.layers.findIndex((l) => l.id === layer.id) >= 0
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
        return false
      } else {
        this.layers.push(layer)
        return true
      }
    },
  },
})
