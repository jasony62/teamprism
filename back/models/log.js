const { DbModel } = require('../tms/model')
/**
 * 日志
 */
class Log extends DbModel {
    constructor({ debug = false } = {}) {
        super('xxt_log', { debug })
    }
    /**
     * 
     */
    async log(siteid, method, data, agent = '', referer = '') {
        let log = {}
        let current = (Date.now() / 1000)
        log.siteid = siteid
        log.method = method
        log.create_at = current
        log.data = data
        log.user_agent = agent
        log.referer = referer
        log.id = await this.insert(log)

        return log
    }
}

function create({ debug = false } = {}) {
    return new Log({ debug })
}

module.exports = { Log, create }