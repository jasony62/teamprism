const Api = require('../../../tms/api')
const { Config } = require('../../../models/sns/wx/proxy')

class Main extends Api {
    constructor(who) {
        super(who)
    }
    /**
     * 返回站点或平台关联的微信公众号appid
     */
    async appid(req) {
        const siteid = req.query.site
        const modelWx = new Config()
        try {
            let oWx
            oWx = await modelWx.bySite(siteid, { fields: 'id,appid,joined' })
            if (!oWx || oWx.joined !== 'Y') {
                oWx = await modelWx.bySite('platform', { fields: 'id,appid,joined' })
                if (!oWx || oWx.joined !== 'Y')
                    return {
                        code: 1,
                        errmsg: '没有获得可用数据'
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