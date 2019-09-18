import axios from 'axios'

const Axios2Error = (function() {
    const _msg = new WeakMap()
    class Axios2Error {
        constructor(err) {
            if (typeof err === 'string')
                _msg.set(this, err)
            else if (typeof err === 'object' && err.msg)
                _msg.set(this, err.msg)
            else
                _msg.set(this.err.toString())
        }
        get msg() {
            return `axios2:${_msg.get(this)}`
        }
    }
    return Axios2Error
})()

class ResponseError {
    constructor({ msg = '未知错误', code = 1 } = {}) {
        this.msg = msg
        this.code = code
    }
}

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
        return axios.get(`/ue/auth/token?site=${siteId}`)
            .then((res) => {
                let { access_token: accessToken, expire_in } = res.data.result
                // 记录过期时间
                let expireAt = parseInt(new Date / 1000) + expire_in - 120
                // 保留获取的数据
                that._store(`${accessToken}:${expireAt}`)
                return accessToken
            })
            .catch(err => Promise.reject(new ResponseError(err)))
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
                if (config.url.indexOf('/api/ue/') === 0) {
                    if (config.params === undefined) config.params = {}
                    let accessToken = myAccessToken.getCached()
                    if (accessToken) {
                        config.params.access_token = accessToken
                    } else {
                        return myAccessToken.refresh()
                            .then(accessToken => {
                                config.params.access_token = accessToken
                                return config
                            })
                            .catch(err => Promise.reject(new Axios2Error(err)))
                    }
                }
            }
            return config
        }, err => Promise.reject(err))
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
                        myAccessToken._remove()
                        // 获得新的access_token，重发request
                        return myAccessToken.refresh()
                            .then(() => axios.request(res.config))
                            .then(res => res)
                            .catch(err => Promise.reject(new Axios2Error(err)))
                    default:
                        return Promise.reject(res.data)
                }
            }
            return res
        }, err => Promise.reject(err))
    }
}

// 统一处理所有的响应
useResponseInterceptor()

// 最后一次设置access_token时的siteId
let myAccessToken
/**
 * 给请求自动添加access_token参数
 * 
 * @param {String} siteid 
 */
function setupAccessToken(siteid) {
    if (!siteid) return Promise.reject(new Axios2Error('参数错误'))

    myAccessToken = new AccessToken(siteid)

    return Promise.resolve(myAccessToken.getCached())
        .then(accessToken => {
            return accessToken ? accessToken : myAccessToken.refresh()
        }).then(() => {
            useApiRequestInterceptor()
            return axios
        }).catch(err => Promise.reject(new Axios2Error(err)))
}

export { setupAccessToken }

export default axios