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
        hasRole (role, clients) {
            if (role === 'free') {
                return 1
            }
            // peut-être faut-il déterminer le client??? pour le moment non!
            if (clients) {
                for (var key in clients) {
                   var roles = this.roles[key].roles.join(',')
                    if (roles.includes(role)) {
                        return 1
                    }
                }
            } else {
                for (var key in this.roles) {
                    var roles = this.roles[key].roles.join(',')
                    if (roles.includes(role)) {
                        return 1
                    }
                }
            }
            return -1
        },
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
