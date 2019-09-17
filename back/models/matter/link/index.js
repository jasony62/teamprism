const { Base: MatterBase } = require('../base')

class Link extends MatterBase {
    constructor({ db, debug = false }) {
        super('xxt_link', { db, debug })
    }
    /**
     * 用户端可见字段
     */
    get fields_ue() {
        return ['id', 'title', 'pic', 'summary', 'author', 'create_at', 'modify_at', 'url', 'urlsrc', 'embeded', 'entryRule']
    }
    /**
     * 素材封面可见字段
     */
    get fields_cover() {
        return ['id', 'title', 'create_at', 'summary', 'pic', 'entryRule', 'site']
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

module.exports = { Link, create: Link.create.bind(Link) }