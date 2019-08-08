const { DbModel } = require('../../../tms/model')
const Data = require('../../../models/matter/enroll/data')
const Round = require('../../../models/matter/enroll/round')

class Record extends DbModel {
    async byId(ek, aOptions = {}) {
		let fields = "fields" in aOptions ? aOptions.fields : '*';
		let verbose = "verbose" in aOptions ? aOptions.verbose : 'N';

		let db = await this.db()
        let dbSelect = db.newSelectOne('xxt_enroll_record', fields)
        dbSelect.where.fieldMatch('enroll_key', '=', ek)
		if (aOptions.state) {
			dbSelect.where.fieldMatch('state', '=', aOptions.state)
		}

		let oRecord = await dbSelect.exec()

		if (oRecord) {
			oRecord = await this._processRecord(oRecord, fields, verbose);
		}

		return oRecord;
	}
	/**
	 * 处理从数据库中取出的数据
	 */
	async _processRecord(oRecord, fields, verbose = 'Y') {
		if (fields === '*' || "data" in oRecord) {
			oRecord.data = oRecord.data == '' ? {} : JSON.parse(oRecord.data);
		}
		if (fields === '*' || 'supplement' in oRecord) {
			oRecord.supplement = oRecord.supplement == '' ? {} : JSON.parse(oRecord.supplement);
		}
		if (fields === '*' || 'score' in oRecord) {
			oRecord.score = oRecord.score ? {} : JSON.parse(oRecord.score);
		}
		if (fields === '*' || 'agreed_log' in oRecord) {
			oRecord.agreed_log = oRecord.agreed_log ? {} : JSON.parse(oRecord.agreed_log);
		}
		if (fields === '*' || 'like_log' in oRecord) {
			oRecord.like_log = oRecord.like_log ? {} : JSON.parse(oRecord.like_log);
		}
		if (fields === '*' || 'dislike_log' in oRecord) {
			oRecord.dislike_log = oRecord.dislike_log ? {} : JSON.parse(oRecord.dislike_log);
		}
		if (verbose === 'Y' && "enroll_key" in oRecord) {
			let modelData = new Data()
			oRecord.verbose = await modelData.byRecord(oRecord.enroll_key);
		}
		if (oRecord.rid) {
			let modelRound = new Round()
			let oRound = await modelRound.byId(oRecord.rid, {'fields' : 'id,rid,title,state,start_at,end_at,purpose'});
			if (oRound) {
				oRecord.round = oRound;
			} else {
				oRecord.round = {};
				oRecord.round.title = '';
			}
		}
		
		return oRecord;
	}
}

module.exports = function () {
    return new Record()
}