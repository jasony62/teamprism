const { Api, ResultData, ResultFault } = require('../../../tms/api')
const { Config } = require('../../../models/sns/wx/proxy')

class Main extends Api {
    constructor(...args) {
        super(...args)
    }
    /**
     * 返回站点或平台关联的微信公众号appid
     */
    async appid() {
        const { site } = this.request.query
        const modelWx = new Config()
        try {
            let oWx
            oWx = await modelWx.bySite(site, { fields: 'id,appid,joined' })
            if (!oWx || oWx.joined !== 'Y') {
                oWx = await modelWx.bySite('platform', { fields: 'id,appid,joined' })
                if (!oWx || oWx.joined !== 'Y')
                    return new ResultFault('没有获得可用数据')
            }

            return new ResultData(oWx.appid)
        } catch (e) {
            return new ResultFault(e)
        } finally {
            modelWx.end()
        }
    }
}

module.exports = Main