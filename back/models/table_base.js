const { DbModel } = require('../tms/model')

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
        let obj = await this.selectOne(fields, wheres)
        if (this.handleDbRaw && typeof this.handleDbRaw === 'function')
            this.handleDbRaw(obj)

        return obj
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
        let rowOptions = {
            fnMapKey: fnMapKey
        }
        if (this.handleDbRaw && typeof this.handleDbRaw === 'function')
            rowOptions.fnForEach = this.handleDbRaw

        let objs = await this.select(fields, sqlWhere, {}, rowOptions)

        return objs
    }
}

module.exports = { Base }