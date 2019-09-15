const { Base } = require('../table_base')

class Member extends Base {
    constructor({ db, debug = false }) {
        super('xxt_site_member', { db, debug })
    }
    /**
     * 用户端可见字段
     */
    get fields_ue() {
        return ['id', 'siteid', 'userid']
    }
    /**
     * 获得指定用户在指定通信录中的用户信息
     * 
     * @param {String} userid
     * @param {Object} 
     * @return Array<Object>
     */
    async byUser(userid, { mschemas, fields = '*' }) {
        let sqlWhere = [
            ['fieldMatch', 'userid', '=', userid],
            ['fieldMatch', 'forbidden', '=', 'N']
        ]
        if (Array.isArray(mschemas) && mschemas.length) {
            sqlWhere.push(['fieldIn', 'schema_id', mschemas])
        }
        let rowHandler = r => { if (Reflect.has(r, 'extattr')) r.extattr = r.extattr ? JSON.parse(r.extattr) : {} }
        let members = await this.select(fields, sqlWhere, {}, { fnForEach: rowHandler })

        return members
    }
}

module.exports = { Member, create: Member.create.bind(Member) }