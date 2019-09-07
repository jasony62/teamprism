const { ResultData, ResultFault, ResultObjectNotFound } = require('../../../tms/api')
const Base = require('../base')

class Main extends Base {
    constructor(...args) {
        super(...args)
    }
    async tmsBeforeEach() {
        let { app } = this.request.query
        if (!app) return new ResultFault(`参数错误`)

        let moArticle = this.model('matter/article')
        const oArticle = await moArticle.byId(app)
        moArticle.end()
        if (!oArticle || oArticle.state !== 1)
            return new ResultObjectNotFound()

        this.article = oArticle

        return true
    }
    /**
     * 返回素材的完整数据，包含：site，mission
     */
    async get() {
        let site, mission, channels
        // 团队信息
        let moSite = this.model('site')
        site = await moSite.byId(this.article.siteid, { fields: moSite.fields_ue })
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
}

module.exports = Main