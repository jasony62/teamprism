const { ResultData, ResultFault, ResultObjectNotFound } = require('../../../tms/api')
const Base = require('./base')
const { create : ModelRecord } = require('../../../models/matter/enroll/record')

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
        let modelRec = ModelRecord()
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