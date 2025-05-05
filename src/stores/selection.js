import { defineStore } from 'pinia'

export const useSelection = defineStore('selection', {
    state: () => ({
        uuid: null
    }),
    actions: {
        toggle(uuid) {
            if (uuid === this.uuid) {
                this.uuid = null
            } else {
                this.uuid = uuid
            }
        }
    }
})
