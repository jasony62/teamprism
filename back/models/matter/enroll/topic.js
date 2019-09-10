const { Base: MatterBase } = require('../base')

class Topic extends MatterBase {
    constructor({ debug = false } = {}) {
        super('xxt_enroll_topic', { debug })
    }
    /**
     * 
     */
    set setApp(oApp) {
        this._oApp = oApp
    }
	/**
	 * 返回专题下的记录
	 *
	 * 如果是任务专题，可能需要动态获取任务信息
	 */
	async records(oTopic, aOptions = {}) {
        
	}
}

function create({ debug = false } = {}) {
    return new Topic({ debug })
}

module.exports = { Topic, create }