const { Api, ResultData, ResultObjectNotFound } = require('../../../tms/api')
const Enroll = require('../../../models/matter/enroll')

class Main extends Api {
    constructor(...args) {
        super(...args)
    }
    /**
     * 获得记录活动
     */
    async get() {
        let { app } = this.request.query
        let modelApp = new Enroll()
        const oApp = await modelApp.byId(app)
        modelApp.end()

        if (!oApp) {
            return new ResultObjectNotFound()
        }

        return new ResultData(oApp)
    }
    /**
     * 获得指定记录活动的进入规则以及当前用户的匹配情况
     */
    async entryRule() {
        let { app } = this.request.query
        let modelApp = new Enroll()
        const oApp = await modelApp.byId(app)
        modelApp.end()

        if (!oApp) {
            return new ResultObjectNotFound()
        }

        return new ResultData(oApp.entryRule)
    }
}

module.exports = Main