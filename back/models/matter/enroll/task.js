const {
    DbModel
} = require('../../../tms/model')
const utilities =  global.utilities
const TYPENAMEZH = {'baseline' : '目标', 'question' : '提问', 'answer' : '回答', 'vote' : '投票', 'score' : '打分'}

class Task extends DbModel {
	constructor(oApp = null) {
        this._oApp = oApp;
    }

	async byId(id, aOptions = {}) {
		let fields = aOptions.fields ? aOptions.fields : 'id,aid,rid,start_at,end_at,config_type,config_id';

        let db = await this.db()
        let dbSelect = db.newSelectOne('xxt_enroll_task', fields)
        dbSelect.where.fieldMatch('id', '=', id)
		let oTask = await dbSelect.exec()

        if (oTask && oTask.config_type && oTask.config_id) {
            if (!this._oApp && oTask.aid) {
                this._oApp = await utilities.model('matter\\enroll').byId(oTask.aid, {'fields' : '*'});
            }
            if (this._oApp[oTask.config_type + 'Config']) {
                let oRuleConfig = await utilities.model('matter\\enroll\\task', this._oApp).configById(oTask.config_type, oTask.config_id);
                if (oRuleConfig && oRuleConfig.enabled === 'Y') {
                    let oTaskRound = await utilities.model('matter\\enroll\\round').byId(oTask.rid);
                    if (oTaskRound) {
                        let oRuleState = await this.getRuleStateByRound(oRuleConfig, oTaskRound);
                        if (true === oRuleState[0]) {
                            await utilities.tms_object_merge(oTask, oRuleConfig, ['source', 'scoreApp', 'schemas', 'limit']);
                            await utilities.tms_object_merge(oTask, oRuleState[1], ['state']);
                        }
                    }
                }
            }
        }

        return oTask;
	}

	async configById(type, id) {
        let oConfig = await utilities.tms_array_search(this._oApp[type + 'Config'], function (oRule, id) {return oRule.id === id}, id);
        if (oConfig) {
            oConfig.type = type
        }

        return oConfig
	}

	async getRuleStateByRound(oTaskConfig, oRound) {
        let taskState = 'IP';
        let startAt = endAt = 0;
        let current = time();
        if (oStartRule = await utilities.getDeepValue(oTaskConfig, 'start.time')) {
            if (utilities.getDeepValue(oStartRule, 'mode') === 'after_round_start_at') {
                if (utilities.getDeepValue(oStartRule, 'unit') === 'hour') {
                    let afterHours = utilities.getDeepValue(oStartRule, 'value', 0);
                    if (oRound.start_at) {
                        startAt = oRound.start_at + (afterHours * 3600);
                        if (current < startAt) {
                            taskState = 'BS';
                        }
                    } else {
                        taskState = 'BS';
                    }
                }
            }
        }
        if (oEndRule = await utilities.getDeepValue(oTaskConfig, 'end.time')) {
            if (utilities.getDeepValue(oEndRule, 'mode') === 'after_round_start_at') {
                if (utilities.getDeepValue(oEndRule, 'unit') === 'hour') {
                    let afterHours = utilities.getDeepValue(oEndRule, 'value', 0);
                    if (oRound.start_at) {
                        endAt = oRound.start_at + (afterHours * 3600);
                        if (current > endAt) {
                            taskState = 'AE'
                        }
                    } else {
                        taskState = 'AE'
                    }
                }
            }
        }

        return [true, {'state' : taskState, 'start_at' : startAt, 'end_at' : endAt}];
	}
}

module.exports = function () {
    return new Task()
}