const { DbModel } = require('../../tms/model')
/**
 * 事物
 */
class Transaction extends DbModel {
    constructor() {
        super('tms_transaction')
    }
    /**
     * 开始事物
     */
    async begin(request) {
        let trans = {}
        trans.begin_at = request.begin_at || (Date.now() / 1000)
        trans.request_uri = request.request_uri || ''
        trans.user_agent = request.user_agent || ''
        trans.referer = request.referer || ''
        trans.remote_addr = request.remote_addr || ''
        trans.id = await this.insert(trans)

        return trans
    }
    /**
     * 结束事物
     */
    async end(transId) {
        const endAt = Date.now() / 1000
        let ret = this.updateById(transId, { end_at: endAt })

        return ret
    }
}
/**
 * express http request事物
 */
class RequestTransaction extends Transaction {
    constructor(req) {
        super()
        this.req = req
    }
    async begin() {
        let reqTrans = {}
        reqTrans.request_uri = this.req.originalUrl
        reqTrans.user_agent = this.req.headers['user-agent'] || ''
        reqTrans.referer = this.req.headers.referer || this.req.headers.referrer || ''
        reqTrans.remote_addr = this.req.id || ''

        return super.begin(reqTrans)
    }
}

module.exports = { Transaction, RequestTransaction }