const { Base: MatterBase } = require('../base')

class Article extends MatterBase {
    constructor({ debug = false } = {}) {
        super('xxt_article', { debug })
    }
}

function create({ debug = false } = {}) {
    return new Article({ debug })
}

module.exports = { Article, create }