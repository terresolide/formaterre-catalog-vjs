import {useConfig} from '@/stores/config.js'
export async function recordDownload (post) {
    const config = useConfig()
    var resp = await fetch(config.state.tools + '/downloads/click',
                {
                    headers: {'Accept': 'application/json', 'Content-type': 'application/json'},
                    method: 'POST',
                    body: JSON.stringify(post)
                }
    )
    
}
