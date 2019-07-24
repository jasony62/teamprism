const crypto = require('crypto')
let redis = require('redis');

// token过期时间
const EXPIRE_IN = 7200

/**
 * 
 */
class TokenRedis {
    constructor() {
        this.client = redis.createClient(6379, 'localhost')
    }
    /**
     * 保存创建的token
     * 
     * @param {string} token 
     * @param {int} createAt 
     * @param {object} data 
     */
    store(token, createAt, identity, data) {
        let key = `accessToken:${token}:${identity}`
        return new Promise((resolve) => {
            this.client.set(key, JSON.stringify({ expireAt: createAt + 7200, data: data }), () => {
                this.client.expire(key, EXPIRE_IN, () => {
                    resolve(EXPIRE_IN)
                })
            })
        })
    }
    /**
     * 检查是否已经分配过token
     * 
     * @param {*} identity 
     */
    scan(identity) {
        return new Promise((resolve, reject) => {
            this.client.scan('0', 'MATCH', `*:${identity}`, (err, res) => {
                if (err) reject(err)
                else resolve(res[1])
            })
        })
    }
    /**
     * 
     * @param {*} keys 
     */
    del(keys) {
        this.client.del(...keys)
    }
    /**
     * 
     * @param {*} token 
     */
    get(token) {
        return new Promise((resolve, reject) => {
            this.client.scan('0', 'MATCH', `accessToken:${token}:*`, (err, res) => {
                if (err) reject('error')
                else {
                    if (res[1].length === 1) {
                        let key = res[1][0]
                        this.client.get(key, (err, res) => {
                            if (err) reject('error')
                            else resolve(JSON.parse(res))
                        })
                    } else {
                        reject('error')
                    }
                }
            })
        })
    }

    quit() {
        this.client.quit()
    }
}
/**
 * 身份令牌
 */
class Token {
    /**
     * 生成token
     * 每次生成新token都要替换掉之前的token
     * 
     * @param {*} req 
     */
    static async create(siteid, oAuthedUser) {
        let tokenRedis = new TokenRedis()

        let identity = crypto.createHash('md5').update(`${oAuthedUser.uid}${siteid}`).digest('hex')

        let keys = await tokenRedis.scan(identity)
        if (keys && keys.length)
            tokenRedis.del(keys)

        let current = parseInt(new Date * 1 / 1000)
        let token = crypto.createHash('md5').update(`${current}${identity}`).digest('hex')

        let expireIn = await tokenRedis.store(token, current, identity, oAuthedUser)

        tokenRedis.quit()

        return {
            code: 0,
            access_token: token,
            expire_in: expireIn
        }
    }
    /**
     * 获取token对应的数据
     * 
     * @param {*} token 
     */
    static async fetch(token) {
        let tokenRedis = new TokenRedis()
        try {
            let oResult = await tokenRedis.get(token)
            return oResult.data
        } catch (e) {
            return false
        } finally {
            tokenRedis.quit()
        }
    }
}

module.exports = Token