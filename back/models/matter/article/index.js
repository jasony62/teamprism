const { Base: MatterBase } = require('../base')

class Article extends MatterBase {
    constructor({ debug = false } = {}) {
        super('xxt_article', { debug })
    }
    /**
     * 用户端可见字段
     */
    get fields_ue() {
        return ['id', 'title', 'pic', 'summary', 'author', 'create_at', 'modify_at', 'url', 'body', 'read_num']
    }
}

function create({ debug = false } = {}) {
    return new Article({ debug })
}

module.exports = { Article, create }