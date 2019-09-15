const { ResultData, ResultFault, ResultObjectNotFound, EntryRuleNotPassed } = require('../../../tms/ctrl')
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

        // 检查进入规则
        if (!['guide'].includes(method)) {
            if (typeof oArticle.entryRule === 'object') {
                let userid = this.client.id
                let rule = this.model('matter/entry_rule')
                rule.rule = oArticle.entryRule
                let result = await rule.check(userid)
                if (result.size) {
                    let o = {}
                    result.forEach((v, k) => { o[k] = v })
                    return new EntryRuleNotPassed(o)
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
     * 不检查进入规则，返回活动的信息
     */
    async guide() {
        return new ResultData(this.article)
    }
}

module.exports = Main