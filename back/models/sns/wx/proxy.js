const { DbModel } = require('../../../tms/model')

/**
 * 微信公众号配置信息
 */
class Config extends DbModel {
    constructor() {
        super('xxt_site_wx')
    }
    /**
     * 站点绑定的公众号
     */
    async bySite(siteId, oOptions = {}) {
        const fields = oOptions.fields || '*'

        let db = await this.db()
        let dbSelect = db.newSelectOne(this.table, fields)
        dbSelect.where.fieldMatch('siteid', '=', siteId)
        let wx = await dbSelect.exec()
        if (!wx)
            throw new Error('对象不存在')

        return wx
    }
}
/**
 * 微信公众号接口代理
 */
class Proxy {

}

module.exports = { Config, Proxy }