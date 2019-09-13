const { Base } = require('../table_base')

class Member extends Base {
    constructor({ debug = false } = {}) {
        super('xxt_site_member_schema', { debug })
    }
    /**
     * 用户端可见字段
     */
    get fields_ue() {
        return ['id', 'siteid', 'title']
    }
}

function create({ debug = false } = {}) {
    return new Member({ debug })
}

module.exports = { Member, create }