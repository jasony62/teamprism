const { ResultData, ResultFault, ResultObjectNotFound } = require('../../../tms/api')
const Base = require('../base')
const { Channel } = require('../../../models/matter/channel')

class Main extends Base {
    constructor(...args) {
        super(...args)
    }
    async tmsBeforeEach() {
        let { app } = this.request.query
        if (!app)
            return new ResultFault(`参数错误`)

        let dbChannel = new Channel()
        const oChannel = await dbChannel.byId(app)
        dbChannel.end()
        if (!oChannel || oChannel.state !== 1)
            return new ResultObjectNotFound()

        this.channel = oChannel

        return true
    }
    /**
     * 
     */
    app() {
        return new ResultData(this.channel)
    }
    /**
     * 
     */
    async mattersGet() {

    }
}

module.exports = Main