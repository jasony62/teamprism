const { ResultData, ResultObjectNotFound } = require('../../../../tms/ctrl')
const Base = require('./base')

class Record extends Base {
    constructor(...args) {
        super(...args)
    }
    tmsRequireTransaction() {
        return {
            submit: true
        }
    }
    /**
     * 获得记录
     */
    async get() {
        let { ek } = this.request.query
        let modelRec = this.model('matter/enroll/record')
        const oRecord = await modelRec.byId(ek)

        if (!oRecord) {
            return new ResultObjectNotFound()
        }

        return new ResultData(oRecord)
    }
    /**
     * 提交记录
     */
    async submit() {

    }
}

module.exports = Record