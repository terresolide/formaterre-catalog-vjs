import { defineStore } from 'pinia'
export const useService = defineStore('service', {
    state: () => ({
        list:[],
        current: null
        
    }),
    actions: {
        async get () {
           const response = fetch()
            
        },
        reset () {
            
        }
    }
})