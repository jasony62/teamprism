import axios from 'axios'

class AccessToken {
    constructor(siteId) {
        this.siteId = siteId
    }
    _store(item) {
        sessionStorage.setItem('access_token', item)
    }
    _fetch() {
        return sessionStorage.getItem('access_token')
    }
    _remove() {
        sessionStorage.removeItem('access_token')
    }
    getCached() {
        let item = this._fetch()
        if (item) {
            let [accessToken, expireAt] = item.split(':')
            if (expireAt * 1000 < new Date) {
                return false
            }
            return accessToken
        }
        return false
    }
    refresh() {
        let that = this
        let siteId = this.siteId
        return new Promise((resolve, reject) => {
            axios.get(`/ue/auth/token?site=${siteId}`).then((res) => {
                let { access_token: accessToken, expire_in } = res.data.result
                // 记录过期时间
                let expireAt = parseInt(new Date / 1000) + expire_in - 120
                // 保留获取的数据
                that._store(`${accessToken}:${expireAt}`)
                resolve(accessToken)
            }).catch(err => {
                reject(`axios2:${err}`)
            })
        })
    }
}
/**
 * 处理所有请求
 */
let myApiRequestInterceptor

function useApiRequestInterceptor() {
    if (!myApiRequestInterceptor) {
        myApiRequestInterceptor = axios.interceptors.request.use(config => {
            if (config) {
                if (config.url.indexOf('/ue/api/') === 0) {
                    if (config.params === undefined) config.params = {}
                    // 检查token是否已经过期，如果过期，重新获取token
                    let accessToken = myAccessToken.getCached()
                    if (accessToken) {
                        config.params.access_token = accessToken
                    } else {
                        return new Promise((resolve, reject) => {
                            myAccessToken.refresh().then(accessToken => {
                                config.params.access_token = accessToken
                                resolve(config)
                            }).catch(reject)
                        })
                    }
                }
            }
            return config
        }, error => {
            // 对请求错误做些什么
            return Promise.reject(error)
        })
    }
}

/**
 * 处理所有的响应
 */
let myResponseInterceptor

function useResponseInterceptor() {
    if (!myResponseInterceptor) {
        myResponseInterceptor = axios.interceptors.response.use(res => {
            if (res.data.code !== 0) {
                switch (res.data.code) {
                    case 20001:
                        // 清除缓存的token
                        myAccessToken._removeToken()
                        // 如何重发request？
                        return new Promise((resolve, reject) => {
                            myAccessToken.refresh().then(() => {
                                axios.request(res.config).then(res => {
                                    resolve(res)
                                }).catch(reject)
                            }).catch(reject)
                        })
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
if (!myResponseInterceptor) useResponseInterceptor()

// 最后一次设置access_token时的siteId
let myAccessToken
/**
 * 给请求自动添加access_token参数
 * 
 * @param {String} siteid 
 */
function setupAccessToken(siteid) {
    if (!siteid) return Promise.reject('axios2:参数错误')

    myAccessToken = new AccessToken(siteid)

    return new Promise((resolve, reject) => {
        let accessToken = myAccessToken.getCached()
        if (accessToken) {
            if (!myApiRequestInterceptor) useApiRequestInterceptor()
            resolve(axios)
        } else {
            myAccessToken.refresh().then(() => {
                if (!myApiRequestInterceptor) useApiRequestInterceptor()
                resolve(axios)
            }).catch(err => { reject(`axios2:${err}`) })
        }
    })
}

export { setupAccessToken }

export default axios