const { ResultData, ResultFault, ResultObjectNotFound } = require('../../../tms/api')
const Base = require('../base')
const { Article } = require('../../../models/matter/article')

class Main extends Base {
    constructor(...args) {
        super(...args)
    }
    async tmsBeforeEach() {
        let { app } = this.request.query
        if (!app)
            return new ResultFault(`参数错误`)

        let dbArticle = new Article()
        const oArticle = await dbArticle.byId(app)
        dbArticle.end()
        if (!oArticle || oArticle.state !== 1)
            return new ResultObjectNotFound()

        this.article = oArticle

        return true
    }
    /**
     * 
     */
    async app() {
        return new ResultData(this.article)
    }
}

module.exports = Main