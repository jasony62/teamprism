const { Base: MatterBase } = require('../base')

class Mission extends MatterBase {
    constructor({ debug = false } = {}) {
        super('xxt_mission', { debug })
    }
    /**
     * 用户端可见字段
     */
    get fields_ue() {
        return ['id', 'title', 'pic', 'summary']
    }
}

function create({ debug = false } = {}) {
    return new Mission({ debug })
}

module.exports = { Mission, create }