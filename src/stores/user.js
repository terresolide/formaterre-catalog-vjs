import { defineStore } from 'pinia'
export const useUser = defineStore('user', {
    state: () => ({
        id: null,
        name: null,
        organization: null,
        email: null,
        roles: {},
        token:null,
        refreshToken: null
        
    }),
    actions: {
        set (user) {
            console.log(user)
            this.id = user.jti
            this.name = user.name
            this.roles = user.client_roles
            this.email = user.email
            if (user.fmt_organization) {
                this.organization = {
                    id: user.fmt_organization_id,
                    type: user.fmt_organization_type,
                    name: user.fmt_organization
                }
            }
            
        },
        setOrganization (org) {
            this.organization.id = org.id
            this.organization.name = org.name
            this.organization.type = org.type
        },
        reset () {
            this.name = null
            this.roles = {}
            this.email = null
        }
    }
})