const { Base: MatterBase } = require('../base')

class Leave extends MatterBase {
    constructor({ db, debug = false }) {
        super('xxt_group_leave', { db, debug })
    }
    /**
     * 用户端可见字段
     */
    get fields_ue() {
        return ['id', 'userid', 'nickname', 'begin_at', 'end_at']
    }
    /**
     * 
     * @param {string} appId
     * @param {string} userid
     * @param {object} options
     * @param {string} [options.fields='*']
     */
    byUser(appId, userid, { fields = '*' } = {}) {
        let sqlWhere = [
            ['fieldMatch', 'aid', '=', appId],
            ['fieldMatch', 'state', '=', 1],
            ['fieldMatch', 'userid', '=', userid]
        ]
        let leaves = this.select(fields, sqlWhere)

        return leaves
    }
}

module.exports = { Leave, create: Leave.create.bind(Leave) }