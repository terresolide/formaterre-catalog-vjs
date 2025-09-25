import {useConfig} from '@/stores/config.js'
import {useUser} from '@/stores/user.js'
import { defineStore } from 'pinia'
import {AuthService} from 'formater-auth-service-js'
export const useClient = defineStore('client', {
    state: () => ({
        list:[],
        roles: {},
        charters: {list:[], signed:[]},
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
            // search external sso for roles
            for(var name in this.roles) {
                if (this.roles[name].externalClient) {
                    this.roles[name].client = this.list.find(cl => cl.clientId === this.roles[name].externalClient)
                }
            }
            this.charters = json.charters
            this.loaded = true
            if (json.organization) {
                user.setOrganization(json.organization)
            }
            this.initSSO()
            return this.roles
        },
        initSSO () {
            var self = this
            this.list.forEach(function (client, index) {
                if (client.type !== 'internal' && client.type !== 'hidden') {
                    self.list[index].sso = new AuthService(client.clientId, {
                        clientId: client.clientId,
                        method: client.method,
                        type: client.type,
                        authUrl: client.authUrl,
                        tokenUrl: client.refreshUrl,
                        refreshUrl: client.refreshUrl,
                        logoutUrl: client.logoutUrl,
                        redirectUri: client.redirectUri
                    })
                   
                    self.list[index].sso.add()
                    self.list[index].sso.on('authenticated', function (usr, serv) {
                        console.log(usr)
                        // comparaison email et rôles si sso externe et lien clients internes....
                        self.list[index].warning = true
                    })
                }
            })
        },
        reset () {
            this.list = []
            this.roles = {}
            this.charters = {list:[], signed: []}
            this.loaded = false
            this.current = null
        },
        setSign (id) {
            this.charters.signed.push(parseInt(id))
        },
        setRoleStatus (role, status) {
            var partrole = role.split('.')
            var index = this.roles[partrole[0]].roles.findIndex(r => r.name === partrole[1])
            this.roles[partrole[0]].roles[index].status = status
        }
    }
})
