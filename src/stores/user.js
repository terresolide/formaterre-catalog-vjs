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
            state.name = user.name
            state.roles = user.client_roles
            state.email = user.email
            
        }
    }
})