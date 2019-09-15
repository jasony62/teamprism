const { Base: MatterBase } = require('../base')

class Mission extends MatterBase {
    constructor({ db, debug = false }) {
        super('xxt_mission', { db, debug })
    }
    /**
     * 用户端可见字段
     */
    get fields_ue() {
        return ['id', 'title', 'pic', 'summary']
    }
}

module.exports = { Mission, create: Mission.create.bind(Mission) }