const { Base: MatterBase } = require('../base')

class Group extends MatterBase {
    constructor({ debug = false } = {}) {
        super('xxt_group', { debug })
    }
    /**
     * 用户端可见字段
     */
    get fields_ue() {
        return ['id', 'title']
    }
}

function create({ debug = false } = {}) {
    return new Group({ debug })
}

module.exports = { Group, create }