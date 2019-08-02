const { DbModel } = require('../../../tms/model')

const DEFAULT_FIELDS = 'id,state,value,tag,supplement,rid,enroll_key,schema_id,userid,group_id,nickname,submit_at,score,remark_num,last_remark_at,like_num,like_log,modify_log,agreed,agreed_log,multitext_seq,vote_num'

class Data extends DbModel {
	/**
     * 获得指定登记记录登记数据的详细信息
     */
	async byRecord(ek, aOptions = {}) {
		let fields = aOptions.fields ? aOptions.fields : DEFAULT_FIELDS
        let bExcludeRoot = aOptions.excludeRoot ? true : false

    	if (-1 === fields.indexOf('schema_id')) {
            fields += ',schema_id'
        }
        if (-1 === fields.indexOf('multitext_seq')) {
            fields += ',multitext_seq'
        }

        let db = await this.db()
        let dbSelect = db.newSelect('xxt_enroll_record_data', fields)
        dbSelect.where.fieldMatch('enroll_key', '=', ek)
        dbSelect.where.fieldMatch('state', '=', 1)

        if (bExcludeRoot) {
        	dbSelect.where.fieldMatch('is_multitext_root', '=', "N")
        } else {
        	dbSelect.where.fieldMatch('is_multitext_root', '=', 0)
        }

        let fnHandleData = function(oData) {
            if (oData.tag !== "undefined") {
                oData.tag = oData.tag ? new Array() : JSON.stringify(oData.tag);
            }
            if (oData.like_log !== "undefined") {
                oData.like_log = oData.like_log ? {} : JSON.stringify(oData.like_log);
            }
            if (oData.agreed_log !== "undefined") {
                oData.agreed_log = oData.agreed_log ? {} : JSON.stringify(Data.agreed_log);
            }
        };
        let fnHandleResult = function(data, bExcludeRoot, fnHandleData) {
            oResult = {};
            if (data.length) {
                data.forEach(function(oSchemaData) {
                    await fnHandleData(oSchemaData);
                    let schemaId = oSchemaData.schema_id;
                    delete oSchemaData.schema_id;
                    if (bExcludeRoot) {
                        if (oSchemaData.multitext_seq > 0) {
                            oResult[schemaId].push = oSchemaData;
                        } else {
                            delete oSchemaData.multitext_seq;
                            oResult[schemaId] = oSchemaData;
                        }
                    } else {
                        oResult[schemaId] = oSchemaData;
                    }
                })
            }

            return oResult;
        };

        if (!aOptions.schema || Object.prototype.toString.call(aOptions.schema) === "[object Array]") {
	        if (aOptions.schema && Object.prototype.toString.call(aOptions.schema) === "[object Array]") {
                dbSelect.where.fieldIn('schema_id', aOptions.schema)
	        }
			let data = await dbSelect.exec()

	        let mixResult = await fnHandleResult(data, bExcludeRoot, fnHandleData);
	    } else {
        	dbSelect.where.fieldMatch('schema_id', '=', aOptions.schema)
	        if (bExcludeRoot) {
				let data = await dbSelect.exec()
                await data.forEach(v => fnHandleData(v));
                if (data.length === 1 && data[0].multitext_seq === 0) {
	                await fnHandleData(data);
	                let mixResult = data[0];
	            } else {
	                let mixResult = data;
	            }
	        } else {
				let data = await dbSelect.exec()
	            if (data) {
	                await fnHandleData(data);
	            }
	            let mixResult = data;
	        }
	    }

        return mixResult;
	}
}

module.exports = function () {
    return new Data()
}