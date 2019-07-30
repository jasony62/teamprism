const {
    DbModel
} = require('../../../tms/model')
const utilities =  global.utilities

class Round extends DbModel {
	async byId(rid, aOptions = {}) {
		let fields = 'fields' in aOptions ? aOptions.fields : '*';

        let db = await this.db()
        let dbSelect = db.newSelectOne('xxt_enroll_round', fields)
        dbSelect.where.fieldMatch('rid', '=', rid)
		let oRound = await dbSelect.exec()

        return oRound;
	}
}

module.exports = function () {
    return new Round()
}