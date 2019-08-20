const { Api, ResultData, ResultObjectNotFound } = require('../../../tms/api')
const ModelRecord = require('../../../models/matter/enroll/record')

class Record extends Api {
    constructor(...args) {
        super(...args)
    }
    /**
     * 获得记录
     */
    async get() {
        let { ek } = this.request.query
        let modelRec = new ModelRecord()
        const oRecord = await modelRec.byId(ek)
        modelRec.end()

        if (!oRecord) {
            return new ResultObjectNotFound()
        }

        return new ResultData(oRecord)
    }
}

module.exports = Record