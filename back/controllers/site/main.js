const { TpCtrl, ResultData, ResultObjectNotFound } = require('../../tms/ctrl')

class Main extends TpCtrl {
    constructor(...args) {
        super(...args)
    }
    /**
     * 
     */
    async get() {
        let { site } = this.request.query
        let moSite = this.model('site')
        let oSite = await moSite.byId(site)

        if (false === oSite)
            return new ResultObjectNotFound()

        return new ResultData(oSite)
    }
}

module.exports = Main