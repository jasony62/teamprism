const { ResultData, ResultFault, ResultObjectNotFound } = require('../../../tms/ctrl')
const Base = require('../base')

class Main extends Base {
    constructor(...args) {
        super(...args)
    }
    async tmsBeforeEach() {
        let { app } = this.request.query
        if (!app) return new ResultFault(`参数错误`)

        let dbLink = this.model('matter/link')
        const oLink = await dbLink.byId(app)
        if (!oLink || oLink.state !== 1)
            return new ResultObjectNotFound()

        this.link = oLink

        return true
    }
    /**
     * 
     */
    async get() {
        let site, mission
        // 团队信息
        let moSite = this.model('site')
        site = await moSite.byId(this.link.siteid, { fields: moSite.fields_ue })
        if (false === site)
            return new ResultObjectNotFound()

        // 项目信息
        if (this.link.mission_id) {
            let moMission = this.model('matter/mission')
            mission = await moMission.byId(this.link.mission_id, { fields: moMission.fields_ue })
            if (false === mission)
                return new ResultObjectNotFound()
        }

        Object.assign(this.link, { site, mission })

        return new ResultData(this.link)
    }
}

module.exports = Main