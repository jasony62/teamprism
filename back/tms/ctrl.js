const { Ctrl, ResultData, ResultFault, ResultObjectNotFound } = require('tms-koa')
/**
 * 业务逻辑错误
 * 前2位编码从30开始
 */
class EntryRuleNotPassed extends ResultFault {
    constructor(result, msg = '不满足进入规则') {
        if (result && result instanceof Map) {
            let o = {}
            result.forEach((v, k) => { o[k] = v })
            result = o
        }

        super(msg, 30001, result)
    }
}

class TpCtrl extends Ctrl {
    constructor(request, client, db) {
        super(request, client, db)
    }
}

module.exports = { TpCtrl, ResultData, ResultFault, ResultObjectNotFound, EntryRuleNotPassed }