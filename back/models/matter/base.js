const { DbModel } = require('../../tms/model')

class Base extends DbModel {
    constructor(table, ...args) {
        super(table, ...args)
    }
    /**
     * 
     * 返回指定素材的数据

     * @param {Int} id 
     */
    async byId(id, { fields = '*' } = {}) {
        let wheres = [
            ['fieldMatch', this.id, '=', id]
        ]
        let oMatter = await this.selectOne(fields, wheres)

        return oMatter
    }
    /**
     * 返回指定素材的数据
     * 
     * @param {Array} ids 
     */
    async byIds(ids, { fields = '*', fnMapKey = false } = {}) {
        if (!ids || !Array.isArray(ids) || ids.length === 0) return false

        let sqlWhere = [
            ['fieldIn', this.id, ids]
        ]
        let matters = await this.select(fields, sqlWhere, { fnMapKey })

        return matters
    }
}

module.exports = { Base }