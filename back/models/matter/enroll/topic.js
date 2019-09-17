const { Base: MatterBase } = require('../base')

class Topic extends MatterBase {
    constructor({ db, debug = false } = {}) {
        super('xxt_enroll_topic', { db, debug })
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
        
        return this._oApp
	}
}

module.exports = { Topic, create: Topic.create.bind(Topic) }