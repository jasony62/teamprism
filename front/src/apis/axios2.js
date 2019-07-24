import axios from 'axios'

let myInterceptor

// 给所有的请求都加上access_token
function setRequestInterceptor(access_token) {
    if (!myInterceptor) {
        myInterceptor = axios.interceptors.request.use(config => {
            if (config) {
                if (config.params === undefined) config.params = {}
                config.params.access_token = access_token
            }
            return config
        })
    }
}
/**
 * 给请求自动添加access_token参数
 * 
 * @param {*} siteid 
 */
export default function(siteid) {
    return new Promise((resolve, reject) => {
        let cached = sessionStorage.getItem('access_token')
        if (cached) {
            let [access_token, expireAt] = cached.split(':')
            let now = parseInt(new Date / 1000)
            if (access_token && expireAt > now) {
                // 没有关闭页面，刷新或者重新进入页面
                setRequestInterceptor(access_token)
                resolve(axios)
                return
            }
        }
        if (!siteid) {
            // 从url中获取siteid
            let param = location.search.match(/[?|&]site=(\w+)&?/)
            if (param && param.length === 2) {
                siteid = param[1]
            }
        }

        if (siteid) {
            axios.get(`/ue/auth/token?site=${siteid}`).then((res) => {
                let { access_token, expire_in } = res.data
                // 记录过期时间
                let expireAt = parseInt(new Date / 1000) + expire_in - 120
                // 保留获取的数据
                sessionStorage.setItem('access_token', `${access_token}:${expireAt}`)
                // 给所有的请求都加上access_token
                if (myInterceptor)
                    axios.interceptors.request.eject(myInterceptor)
                setRequestInterceptor(access_token)

                resolve(axios)

                return
            })
        }

        reject('error')
    })
}