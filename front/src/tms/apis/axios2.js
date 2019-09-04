import axios from 'axios'
/**
 * access_token无效
 */
class AccessTokenFault {
    constructor(msg) {
        this.msg = msg
    }
}
let myApiRequestInterceptor
// 给所有的请求都加上access_token
function useApiRequestInterceptor(access_token) {
    if (!myApiRequestInterceptor) {
        myApiRequestInterceptor = axios.interceptors.request.use(config => {
            if (config) {
                if (config.url.indexOf('/ue/api/') === 0) {
                    if (config.params === undefined) config.params = {}
                    config.params.access_token = access_token
                }
            }
            return config
        }, error => {
            // 对请求错误做些什么
            return Promise.reject(error)
        })
    }
}

// 处理所有的响应
let myResponseInterceptor

function useResponseInterceptor() {
    if (!myResponseInterceptor) {
        myResponseInterceptor = axios.interceptors.response.use(res => {
            if (res.data.code !== 0) {
                switch (res.data.code) {
                    case 20001:
                        // 如何进行重发？
                        return Promise.reject(new AccessTokenFault(res.data.msg))
                    default:
                        return Promise.reject(res.data.msg)
                }
            }
            return res
        }, error => {
            return Promise.reject(error)
        })
    }
}

// 统一处理所有的响应
if (!myResponseInterceptor)
    useResponseInterceptor()

// 最后一次设置access_token时的siteId
let lastSiteId
/**
 * 给请求自动添加access_token参数
 * 
 * @param {String} siteid 
 */
function setupAccessToken(siteid) {
    if (!siteid)
        return Promise.reject('axios2:参数错误')

    lastSiteId = siteid

    return new Promise((resolve, reject) => {
        let cached = sessionStorage.getItem('access_token')
        if (cached) {
            let [access_token, expireAt] = cached.split(':')
            let now = parseInt(new Date / 1000)
            // 没有关闭页面，刷新或者重新进入页面
            if (access_token && expireAt > now) {
                if (myApiRequestInterceptor)
                    axios.interceptors.resquest.eject(myApiRequestInterceptor)
                useApiRequestInterceptor(access_token)

                resolve(axios)
                return
            }
        }

        axios.get(`/ue/auth/token?site=${siteid}`).then((res) => {
            let { access_token, expire_in } = res.data.result

            // 记录过期时间
            let expireAt = parseInt(new Date / 1000) + expire_in - 120
            // 保留获取的数据
            sessionStorage.setItem('access_token', `${access_token}:${expireAt}`)

            // 统一处理所有请求
            if (myApiRequestInterceptor)
                axios.interceptors.request.eject(myApiRequestInterceptor)
            useApiRequestInterceptor(access_token)

            resolve(axios)
        }).catch(err => {
            reject(`axios2:${err}`)
        })
    })
}

export { setupAccessToken }

export default axios