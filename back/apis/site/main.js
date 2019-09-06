const { Api, ResultData, ResultObjectNotFound } = require('../../tms/api')

class Main extends Api {
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
        moSite.end()

        if (false === oSite)
            return new ResultObjectNotFound()

        return new ResultData(oSite)
    }
}

module.exports = Main