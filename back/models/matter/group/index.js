const { Base: MatterBase } = require('../base')

class Group extends MatterBase {
    constructor({ db, debug = false }) {
        super('xxt_group', { db, debug })
    }
    /**
     * 用户端可见字段
     */
    get fields_ue() {
        return ['id', 'title']
    }
}

module.exports = { Group, create: Group.create.bind(Group) }