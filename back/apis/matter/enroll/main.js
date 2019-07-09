const Api = require('../../../tms/api')
const Enroll = require('../../../models/matter/enroll')

class Main extends Api {
    constructor(who) {
        super(who)
    }

    async entryRule(req) {
        let modelApp = new Enroll()
        const oApp = await modelApp.byId(req.query.app)
        modelApp.end()
        return {
            code: 0,
            entryRule: oApp.entryRule
        }
    }
}

module.exports = function (who) {
    return new Main(who)
}