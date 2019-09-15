const { Base } = require('../table_base')

class Mschema extends Base {
    constructor({ db, debug = false }) {
        super('xxt_site_member_schema', { db, debug })
    }
    /**
     * 用户端可见字段
     */
    get fields_ue() {
        return ['id', 'siteid', 'title']
    }
}

module.exports = { Mschema, create: Mschema.create.bind(Mschema) }