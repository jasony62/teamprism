const _ = require('underscore')
const { ResultData, ResultFault, ResultObjectNotFound, EntryRuleNotPassed } = require('../../../tms/ctrl')
const Base = require('../base')

class Main extends Base {
    constructor(...args) {
        super(...args)
    }
    async tmsBeforeEach(method) {
        let { app } = this.request.query
        if (!app) return new ResultFault(`参数错误`)

        let dmLink = this.model('matter/link')
        const oLink = await dmLink.byId(app)
        if (!oLink || oLink.state !== 1)
            return new ResultObjectNotFound()

        // 检查进入规则，如果要获得封面信息跳过
        if (typeof oLink.entryRule === 'object') {
            let oCheckResult = await this.entryCheck(oLink.entryRule)
            if (oCheckResult) {
                oLink.entryRule.result = oCheckResult
                // 团队信息
                let dmSite = this.model('site')
                let site = await dmSite.byId(oLink.siteid, { fields: dmSite.fields_ue })
                if (site) oLink.site = site
                if (!['cover'].includes(method)) {
                    let cover = _.pick(oLink, dmLink.fields_cover)
                    return new EntryRuleNotPassed(cover)
                }
            }
        }

        this.link = oLink

        return true
    }
    /**
     * 
     */
    async get() {
        let site, mission
        // 团队信息
        let dmSite = this.model('site')
        site = await dmSite.byId(this.link.siteid, { fields: dmSite.fields_ue })
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
    /**
     * 不检查进入规则，返回活动的基本信息
     */
    async cover() {
        let dmLink = this.model('matter/link')
        let cover = _.pick(this.link, dmLink.fields_cover)

        return new ResultData(cover)
    }
}

module.exports = Main