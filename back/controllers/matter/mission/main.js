const { ResultData, ResultFault, ResultObjectNotFound } = require('../../../tms/ctrl')
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
        if (!oMission || oMission.state !== 1)
            return new ResultObjectNotFound()

        this.mission = oMission

        return true
    }
    /**
     * 返回项目用户端视图数据
     */
    async get() {
        let site
        // 团队信息
        let moSite = this.model('site')
        site = await moSite.byId(this.mission.siteid, { fields: moSite.fields_ue })
        if (false === site)
            return new ResultObjectNotFound()

        Object.assign(this.mission, { site })

        return new ResultData(this.mission)
    }
}

module.exports = Main