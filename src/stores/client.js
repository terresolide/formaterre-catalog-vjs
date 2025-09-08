import {useConfig} from '@/stores/config.js'
import { defineStore } from 'pinia'
export const useClient = defineStore('client', {
    state: () => ({
        list:[],
        current: null
        
    }),
    actions: {
        async getAll () {
           const config = useConfig()
           const response = await fetch(config.state.tools + '/api/client/' + config.state.app)
            
        },
        reset () {
            
        }
    }
})