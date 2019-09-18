const { DbModel } = require('tms-koa')
const axios = require('axios')

/**
 * 微信公众号配置信息
 */
class Config extends DbModel {
    constructor() {
        super('xxt_site_wx')
    }
    /**
     * 站点绑定的公众号
     */
    async bySite(siteId, oOptions = {}) {
        const fields = oOptions.fields || '*'

        let db = this.db
        let dbSelect = db.newSelectOne(this.table, fields)
        dbSelect.where.fieldMatch('siteid', '=', siteId)
        let wx = await dbSelect.exec()

        return wx
    }
}
/**
 * 通过OAuth后根据openid获得用户信息
 */
function getOAuthUserInfo(openid, accessToken) {
    return new Promise((resolve, reject) => {
        const cmd = 'https://api.weixin.qq.com/sns/userinfo'
        const params = {
            'access_token': accessToken,
            'openid': openid,
            'lang': 'zh_CN'
        }
        axios.get(cmd, { params }).then(res => {
            //if (user.nickname) {
            //user.nickname = \TMS_APP::model().cleanEmoji($user.nickname, true);
            //}
            resolve(res)
        }).catch(err => {
            reject(err)
        })
    })
}
/**
 * 微信公众号接口代理
 */
class WxProxy {
    constructor(config) {
        this.config = config
    }
    /**
     * 获得OAuth 用户的openid
     */
    getOAuthUser(code) {
        return new Promise((resolve, reject) => {
            /* 获得用户的openid */
            const cmd = "https://api.weixin.qq.com/sns/oauth2/access_token";
            const params = {
                appid: this.config.siteid,
                secret: this.config.appsecret,
                code: code,
                grant_type: 'authorization_code'
            }
            axios.get(cmd, { params }).then(res => {
                const { openid, scope, access_token } = res.data
                /* 获得用户描述信息 */
                if (scope && -1 !== scope.indexOf('snsapi_userinfo')) {
                    getOAuthUserInfo(openid, access_token).then(res => {
                        let user = res.data
                        resolve(user)
                    }).catch(err => {
                        reject(err)
                    })
                } else {
                    resolve({ openid })
                }
            }).catch(err => {
                reject(err)
            })
        })
    }
}
// 创建微信公众号api代理
async function createProxy(siteid) {
    const model = new Config()
    try {
        let wxConfig = await model.bySite(siteid, { fields: 'id,appid,appsecret' })
        let proxy = new WxProxy(wxConfig)
        return proxy
    } catch (e) {
        return false
    }
}

module.exports = { Config, createProxy }