import {useConfig} from '@/stores/config.js'
import {useUser} from '@/stores/user'
// import {useRoute} from 'vue-router'
export function recordDownload (ev, route) {
    const config = useConfig()
    if (!config.state.tools) {
        return
    }
    const user = useUser()
     var post = Object.assign(ev, {
        email: user.email || '',
        domain: window.location.host,
        app: config.state.app,
        orgtype: user.organization ? user.organization.type : null,
        fullpath: window.location.hash + window.location.search,
        path: window.location.hash
    })
    fetch(config.state.tools + '/downloads/click',
        {
            headers: {'Accept': 'application/json', 'Content-type': 'application/json'},
            method: 'POST',
            body: JSON.stringify(post)
        }
    )
    
}
