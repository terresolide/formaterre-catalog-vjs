import { defineStore } from 'pinia'
export const useUser = defineStore('user', {
    state: () => ({
        name: null,
        organization: null,
        email: null,
        roles: {},
        token:null,
        refreshToken: null
        
    }),
    actions: {
        set (user) {
            this.name = user.name
            this.roles = user.client_roles
            this.email = user.email
            
        },
        reset () {
            this.name = null
            this.roles = {}
            this.email = null
        }
    }
})