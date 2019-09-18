const _ = require('underscore')
const { ResultData, ResultFault, ResultObjectNotFound, EntryRuleNotPassed } = require('../../../../tms/ctrl')
const Base = require('../base')

class Main extends Base {
    constructor(...args) {
        super(...args)
    }

    async tmsBeforeEach(method) {
        let { app } = this.request.query
        if (!app) return new ResultFault(`参数错误`)

        let dmArticle = this.model('matter/article')
        const oArticle = await dmArticle.byId(app)
        if (!oArticle || oArticle.state !== 1)
            return new ResultObjectNotFound()

        // 检查进入规则，如果要获得封面信息跳过
        if (typeof oArticle.entryRule === 'object') {
            let oCheckResult = await this.entryCheck(oArticle.entryRule)
            if (oCheckResult) {
                oArticle.entryRule.result = oCheckResult
                // 团队信息
                let dmSite = this.model('site')
                let site = await dmSite.byId(oArticle.siteid, { fields: dmSite.fields_ue })
                if (site) oArticle.site = site
                if (!['cover'].includes(method)) {
                    let cover = _.pick(oArticle, dmArticle.fields_cover)
                    return new EntryRuleNotPassed(cover)
                }
            }
        }

        this.article = oArticle

        return true
    }
    /**
     * 返回素材的完整数据，包含：site，mission
     */
    async get() {
        let site, mission, channels
        // 团队信息
        let dmSite = this.model('site')
        site = await dmSite.byId(this.article.siteid, { fields: dmSite.fields_ue })
        if (false === site)
            return new ResultObjectNotFound()

        // 项目信息
        if (this.article.mission_id) {
            let moMission = this.model('matter/mission')
            mission = await moMission.byId(this.article.mission_id, { fields: moMission.fields_ue })
            if (false === mission)
                return new ResultObjectNotFound()
        }

        // 所属频道
        let moChannel = this.model('matter/channel')
        channels = await moChannel.byMatter(this.article.id, 'article')
        if (channels && channels.length === 0) channels = undefined

        // 过滤不需要的字段
        let moArticle = this.model('matter/article')
        let keys = Object.keys(this.article)
        keys.forEach(key => {
            if (false === moArticle.fields_ue.includes(key)) delete this.article[key]
        })

        Object.assign(this.article, { site, mission, channels })

        return new ResultData(this.article)
    }
    /**
     * 不检查进入规则，返回活动的基本信息
     */
    async cover() {
        let dmArticle = this.model('matter/article')
        let cover = _.pick(this.article, dmArticle.fields_cover)

        return new ResultData(cover)
    }
}

module.exports = Main