const { DbModel } = require('tms-koa')

class Site extends DbModel {
    constructor({ db, debug = false }) {
        super('xxt_site', { db, debug, autoIncId: false })
    }
    /**
     * 用户端可见字段
     */
    get fields_ue() {
        return ['id', 'name', 'summary', 'heading_pic']
    }

    async byId(id, { fields = '*' } = {}) {
        let sqlWhere = [
            ['fieldMatch', this.id, '=', id]
        ]
        let site = await this.selectOne(fields, sqlWhere)
        return site;
    }
}

module.exports = { Site, create: Site.create.bind(Site) }