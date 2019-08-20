const { DbModel } = require('../../../tms/model')

class Record extends DbModel {
    async byId(ek) {
        let db = await this.db()
        let dbSelect = db.newSelectOne('xxt_enroll_record', '*')
        dbSelect.where.fieldMatch('enroll_key', '=', ek);
        let oRecord = await dbSelect.exec()
        if (!oRecord)
            throw new Error('记录活动不存在')

        return oRecord;
    }
}
module.exports = function() {
    return new Record()
}