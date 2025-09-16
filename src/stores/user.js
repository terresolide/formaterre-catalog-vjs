import { defineStore } from 'pinia'
export const useUser = defineStore('user', {
    state: () => ({
        id: null,
        name: null,
        organization: null,
        email: null,
        roles: {},
        sso: null
        
    }),
    actions: {
        set (user) {
            this.id = user.sub
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
            console.log(org)
            this.organization = {
                id:org.id,
                name:org.name,
                type: org.type
            }
        },
        reset () {
            this.name = null
            this.roles = {}
            this.email = null
            this.organization = null
        }
    }
})
