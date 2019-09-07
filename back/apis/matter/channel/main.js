const { ResultData, ResultFault, ResultObjectNotFound } = require('../../../tms/api')
const Base = require('../base')

class Main extends Base {
    constructor(...args) {
        super(...args)
    }
    async tmsBeforeEach() {
        let { app } = this.request.query
        if (!app)
            return new ResultFault(`参数错误`)

        let dbChannel = this.model('matter/channel')
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
    get() {
        return new ResultData(this.channel)
    }
    /**
     * 频道下的素材 
     */
    async mattersGet() {
        let dbChanMatter = this.model('matter/channel/matter')
        let matters = await dbChanMatter.byChannel(this.channel, { page: 1, size: 12 })
        dbChanMatter.end()

        return new ResultData(matters)
    }
}

module.exports = Main