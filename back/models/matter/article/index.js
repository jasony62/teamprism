const { Base: MatterBase } = require('../base')

class Article extends MatterBase {
    constructor({ debug = false } = {}) {
        super('xxt_article', { debug })
    }
    /**
     * 用户端可见字段
     */
    get fields_ue() {
        return ['id', 'title', 'pic', 'summary', 'author', 'create_at', 'modify_at', 'url', 'body', 'read_num', 'entryRule']
    }
    /**
     * 处理从数据库中获得数据
     * @param {object} raw
     */
    handleDbRaw(raw) {
        if (raw && typeof raw === 'object') {
            if (Reflect.has(raw, 'entry_rule') && typeof raw.entry_rule === 'string') {
                raw.entryRule = raw.entry_rule ? JSON.parse(raw.entry_rule) : {}
                delete raw.entry_rule
            }
        }

        return raw
    }
}

function create({ debug = false } = {}) {
    return new Article({ debug })
}

module.exports = { Article, create }