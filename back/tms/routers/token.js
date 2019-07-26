const redis = require('redis')
const uuidv4 = require('uuid/v4');

// token过期时间
const EXPIRE_IN = 7200

/**
 * 
 */
class TokenRedis {
    constructor(client) {
        this.redisClient = client
    }
    // 连接redis
    static create() {
        return new Promise((resolve) => {
            const client = redis.createClient()
            client.on('ready', () => {
                resolve(new TokenRedis(client))
            })
            client.on('error', () => {
                resolve(false)
            })
        });
    }
    quit() {
        this.redisClient.quit()
    }
    /**
     * 保存创建的token
     * 
     * @param {string} token 
     * @param {string} clientId 
     * @param {object} data 
     */
    store(token, clientId, data) {
        let createAt = parseInt(new Date * 1 / 1000)
        let key = `accessToken:${token}:${clientId}`
        return new Promise((resolve) => {
            this.redisClient.set(key, JSON.stringify({ expireAt: createAt + 7200, data: data }), () => {
                this.redisClient.expire(key, EXPIRE_IN, () => {
                    resolve(EXPIRE_IN)
                })
            })
        })
    }
    /**
     * 检查是否已经分配过token
     * 
     * @param {*} clientId 
     */
    scan(clientId) {
        return new Promise((resolve, reject) => {
            this.redisClient.scan('0', 'MATCH', `*:${clientId}`, (err, res) => {
                if (err) reject(err)
                else resolve(res[1])
            })
        })
    }
    /**
     * 
     * @param {array} keys 
     */
    del(keys) {
        this.redisClient.del(...keys)
    }
    /**
     * 
     * @param {string} token 
     */
    get(token) {
        return new Promise((resolve, reject) => {
            this.redisClient.scan('0', 'MATCH', `accessToken:${token}:*`, (err, res) => {
                if (err) reject('error')
                else {
                    if (res[1].length === 1) {
                        let key = res[1][0]
                        this.redisClient.get(key, (err, res) => {
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
}
/**
 * 身份令牌
 */
class Token {
    /**
     * 生成token
     * 每次生成新token都要替换掉之前的token
     * 
     * @param {string} clientId
     * @param {string} clientData
     * 
     */
    static async create(clientId, clientData) {
        const tokenRedis = await TokenRedis.create()
        if (false === tokenRedis)
            return [false, '连接Redis服务失败']

        // 清除已经存在的token
        const keys = await tokenRedis.scan(clientId)
        if (keys && keys.length)
            tokenRedis.del(keys)

        // 生成并保存新token
        const token = uuidv4().replace(/-/g, '')
        const expireIn = await tokenRedis.store(token, clientId, clientData)

        tokenRedis.quit()

        return [true, {
            access_token: token,
            expire_in: expireIn
        }]
    }
    /**
     * 获取token对应的数据
     * 
     * @param {*} token 
     */
    static async fetch(token) {
        let tokenRedis = await TokenRedis.create()
        if (false === tokenRedis)
            return [false, '连接Redis服务失败']

        try {
            let oResult = await tokenRedis.get(token)
            return [true, oResult.data]
        } catch (e) {
            return [false, e]
        } finally {
            tokenRedis.quit()
        }
    }
}

module.exports = Token