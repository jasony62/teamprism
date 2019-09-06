const { DbModel } = require('../../tms/model')

class Site extends DbModel {
    constructor({ debug = false } = {}) {
        super('xxt_site', { debug, autoIncId: false })
    }

    async byId(id, { fields = '*' } = {}) {
        let sqlWhere = [
            ['fieldMatch', this.id, '=', id]
        ]
        let site = await this.selectOne(fields, sqlWhere)
        return site;
    }
}

function create({ debug = false } = {}) {
    return new Site({ debug })
}

module.exports = { Site, create }