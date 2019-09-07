const { ResultData, ResultFault, ResultObjectNotFound } = require('../../../tms/api')
const Base = require('../base')

class Main extends Base {
    constructor(...args) {
        super(...args)
    }
    async tmsBeforeEach() {
        let { app } = this.request.query
        if (!app) return new ResultFault(`参数错误`)

        let dbMission = this.model('matter/mission')
        const oMission = await dbMission.byId(app)
        dbMission.end()
        if (!oMission || oMission.state !== 1)
            return new ResultObjectNotFound()

        this.mission = oMission

        return true
    }
    /**
     * 返回项目用户端视图数据
     */
    async get() {
        return new ResultData(this.article)
    }
}

module.exports = Main