const Api = require('../../../tms/api')
const { Config } = require('../../../models/sns/wx/proxy')

class Main extends Api {
    constructor(who) {
        super(who)
    }
    // 返回站点对应的appid
    async appid(req) {
        const siteid = req.query.site
        const modelWx = new Config()
        try {
            const oWx = await modelWx.bySite(siteid, { fields: 'id,appid' })
            if (!oWx) {
                return {
                    code: 1,
                    errmsg: '查找的对象不存在'
                }
            }

            return {
                code: 0,
                appid: oWx.appid
            }
        } catch (e) {
            return {
                code: 1,
                errmsg: e
            }
        } finally {
            modelWx.end()
        }
    }
}

module.exports = function(who) {
    return new Main(who)
}