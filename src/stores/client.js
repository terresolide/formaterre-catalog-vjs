import {useConfig} from '@/stores/config.js'
import {useUser} from '@/stores/user.js'
import { defineStore } from 'pinia'
export const useClient = defineStore('client', {
    state: () => ({
        list:[],
        roles: {},
        charters: [],
        loaded: false,
        current: null
        
    }),
    actions: {
        async getRoles () {
            if (this.loaded) {
                return this.roles
            }
            const config = useConfig()
            const user = useUser()
            // const response = await fetch(config.state.tools + '/api/client/' + config.state.app)
            var post = {
                 userId:user.id,
                 email:user.email,
                 app:config.state.app,
                 realm: import.meta.env.SSO_REALM
            }
            var fdata = new URLSearchParams(post)
     
            const response = await fetch(config.state.tools + '/api/user?app=' + config.state.app, {
                headers: {
                    'Authorization': 'Bearer ' + user.sso.getToken()
                }
            })
            const json =  await response.json()
            this.list = json.clients
            this.roles = json.roles
            this.charters = json.charters
            this.loaded = true
            if (json.organization) {
                user.setOrganization(json.organization)
            }
            return this.roles
            
        },
        reset () {
            this.list = []
            this.roles = {}
            this.charters = []
            this.loaded = false
            this.current = null
        },
        setRoleWaiting (role) {
            var partrole = role.split('.')
            var index = this.roles[partrole[0]].roles.findIndex(r => r.name === partrole[1])
            this.roles[partrole[0]].roles[index].status = 'WAITING'
        }
    }
})
